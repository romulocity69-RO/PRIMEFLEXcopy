"""
Mercado Pago Checkout Pro integration (card, Pix, boleto).
One-time payment per plan/period. Payment confirmation is done by
querying Mercado Pago's API (authoritative) on return + webhook.
"""
import os
import time
import uuid
import hmac
import hashlib
import logging
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Request, Header, Query
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

MP_ACCESS_TOKEN = os.environ.get("MP_ACCESS_TOKEN", "")
MP_PUBLIC_KEY = os.environ.get("MP_PUBLIC_KEY", "")
MP_WEBHOOK_SECRET = os.environ.get("MP_WEBHOOK_SECRET", "")
MP_BASE = "https://api.mercadopago.com"

# Separate Mongo client for this module
_mongo_url = os.environ["MONGO_URL"]
_client = AsyncIOMotorClient(_mongo_url)
_db = _client[os.environ.get("DB_NAME", "test_database")]
_tx = _db.transactions

router = APIRouter(prefix="/api/payments")

# Server-side price catalog. NEVER trust prices from the browser.
PLANS = {
    "start": {
        "name": "Plano START",
        "periods": {
            "mensal": {"label": "Mensal", "price": 39.90},
            "trimestral": {"label": "Trimestral", "price": 99.90},
            "semestral": {"label": "Semestral", "price": 179.90},
            "anual": {"label": "Anual", "price": 299.90},
        },
    },
    "2.0": {
        "name": "Plano PRIME 2.0",
        "periods": {
            "mensal": {"label": "Mensal", "price": 69.90},
            "trimestral": {"label": "Trimestral", "price": 179.90},
            "semestral": {"label": "Semestral", "price": 279.90},
            "anual": {"label": "Anual", "price": 499.90},
        },
    },
    "3d": {
        "name": "Plano PRIME 3D",
        "periods": {
            "mensal": {"label": "Mensal", "price": 109.90},
            "trimestral": {"label": "Trimestral", "price": 279.90},
            "semestral": {"label": "Semestral", "price": 479.90},
            "anual": {"label": "Anual", "price": 799.90},
        },
    },
}

STATUS_MAP = {
    "approved": "paid",
    "authorized": "paid",
    "pending": "pending",
    "in_process": "pending",
    "in_mediation": "pending",
    "rejected": "failed",
    "cancelled": "cancelled",
    "refunded": "refunded",
    "charged_back": "charged_back",
}


class CheckoutRequest(BaseModel):
    plan_id: str
    period: str
    email: str = Field(min_length=4, max_length=254)
    name: Optional[str] = ""
    origin: str  # frontend origin, e.g. https://app.example.com


def _sanitize(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


async def _mp_get_payment(payment_id: str):
    async with httpx.AsyncClient(timeout=20) as http:
        r = await http.get(
            f"{MP_BASE}/v1/payments/{payment_id}",
            headers={"Authorization": f"Bearer {MP_ACCESS_TOKEN}"},
        )
        if r.status_code == 404:
            return None
        r.raise_for_status()
        return r.json()


async def _apply_payment(payment: dict):
    ref = payment.get("external_reference")
    if not ref:
        return None
    status = payment.get("status")
    mapped = STATUS_MAP.get(status, "pending")
    await _tx.update_one(
        {"external_reference": ref},
        {"$set": {
            "status": mapped,
            "mp_status": status,
            "mp_status_detail": payment.get("status_detail"),
            "mp_payment_id": str(payment.get("id")),
            "payment_type": payment.get("payment_type_id"),
            "updated_at": time.time(),
        }},
    )
    return mapped


@router.get("/config")
async def config():
    return {"public_key": MP_PUBLIC_KEY, "configured": bool(MP_ACCESS_TOKEN)}


@router.get("/plans")
async def plans():
    return PLANS


@router.post("/checkout")
async def create_checkout(data: CheckoutRequest):
    if not MP_ACCESS_TOKEN:
        raise HTTPException(500, "Mercado Pago não configurado")
    plan = PLANS.get(data.plan_id)
    if not plan:
        raise HTTPException(400, "Plano inválido")
    period = plan["periods"].get(data.period)
    if not period:
        raise HTTPException(400, "Período inválido")

    external_ref = f"gp:{data.plan_id}:{data.period}:{uuid.uuid4().hex}"
    title = f"{plan['name']} — {period['label']}"

    await _tx.insert_one({
        "external_reference": external_ref,
        "plan_id": data.plan_id,
        "period": data.period,
        "title": title,
        "amount": period["price"],
        "email": data.email,
        "name": data.name,
        "status": "pending",
        "created_at": time.time(),
    })

    origin = data.origin.rstrip("/")
    preference = {
        "items": [{
            "id": f"{data.plan_id}-{data.period}",
            "title": title,
            "quantity": 1,
            "currency_id": "BRL",
            "unit_price": period["price"],
        }],
        "payer": {"email": data.email, "name": data.name or ""},
        "external_reference": external_ref,
        "statement_descriptor": "GLUTEO PRIME",
        "notification_url": f"{origin}/api/payments/webhook",
        "back_urls": {
            "success": f"{origin}/pagamento?ref={external_ref}",
            "pending": f"{origin}/pagamento?ref={external_ref}",
            "failure": f"{origin}/pagamento?ref={external_ref}",
        },
        "auto_return": "approved",
    }

    headers = {
        "Authorization": f"Bearer {MP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Idempotency-Key": external_ref,
    }
    async with httpx.AsyncClient(timeout=20) as http:
        r = await http.post(f"{MP_BASE}/checkout/preferences", headers=headers, json=preference)
        if r.is_error:
            logger.error("MP preference error: %s", r.text[:500])
            raise HTTPException(502, "Erro ao criar pagamento no Mercado Pago")
        result = r.json()

    await _tx.update_one(
        {"external_reference": external_ref},
        {"$set": {"mp_preference_id": result.get("id")}},
    )

    return {
        "preference_id": result.get("id"),
        "checkout_url": result.get("init_point"),
        "sandbox_url": result.get("sandbox_init_point"),
        "external_reference": external_ref,
        "public_key": MP_PUBLIC_KEY,
        "amount": period["price"],
        "title": title,
    }


@router.get("/status/{external_reference:path}")
async def status(external_reference: str):
    row = await _tx.find_one({"external_reference": external_reference})
    if not row:
        raise HTTPException(404, "Transação não encontrada")
    return _sanitize(row)


@router.get("/verify")
async def verify(external_reference: Optional[str] = Query(None),
                 payment_id: Optional[str] = Query(None)):
    """Called by the result page to confirm payment via MP API (authoritative)."""
    if payment_id:
        payment = await _mp_get_payment(payment_id)
        if payment:
            await _apply_payment(payment)
    if external_reference:
        # try to find latest payment by searching MP for this external_reference
        if not payment_id:
            async with httpx.AsyncClient(timeout=20) as http:
                r = await http.get(
                    f"{MP_BASE}/v1/payments/search",
                    headers={"Authorization": f"Bearer {MP_ACCESS_TOKEN}"},
                    params={"external_reference": external_reference, "sort": "date_created", "criteria": "desc"},
                )
                if r.status_code == 200:
                    results = r.json().get("results", [])
                    if results:
                        await _apply_payment(results[0])
        row = await _tx.find_one({"external_reference": external_reference})
        if not row:
            raise HTTPException(404, "Transação não encontrada")
        return _sanitize(row)
    raise HTTPException(400, "Informe external_reference ou payment_id")


def _valid_signature(x_signature: Optional[str], x_request_id: Optional[str], data_id: Optional[str]) -> bool:
    if not MP_WEBHOOK_SECRET:
        # Signature validation disabled (no secret configured). We still fetch
        # the payment from MP API which is authoritative.
        return True
    if not x_signature:
        return False
    parts = dict(p.split("=", 1) for p in x_signature.split(",") if "=" in p)
    ts, received = parts.get("ts"), parts.get("v1")
    if not ts or not received:
        return False
    manifest = f"id:{data_id.lower() if data_id else ''};"
    if x_request_id:
        manifest += f"request-id:{x_request_id};"
    manifest += f"ts:{ts};"
    expected = hmac.new(MP_WEBHOOK_SECRET.encode(), manifest.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, received)


@router.post("/webhook")
async def webhook(request: Request,
                  x_signature: Optional[str] = Header(None),
                  x_request_id: Optional[str] = Header(None),
                  data_id: Optional[str] = Query(None, alias="data.id"),
                  type: Optional[str] = Query(None)):
    try:
        body = await request.json()
    except Exception:
        body = {}
    event_type = type or body.get("type")
    payment_id = data_id or str(body.get("data", {}).get("id", "") or "")
    if event_type not in (None, "payment") and body.get("type") != "payment":
        return {"received": True}
    if not _valid_signature(x_signature, x_request_id, payment_id):
        raise HTTPException(401, "invalid signature")
    if payment_id:
        payment = await _mp_get_payment(payment_id)
        if payment:
            await _apply_payment(payment)
    return {"received": True}

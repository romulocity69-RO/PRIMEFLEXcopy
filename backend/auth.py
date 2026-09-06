"""
Real authentication: register / login / me / update profile.
JWT tokens + hashed passwords (pbkdf2_sha256). Users isolated by id.
"""
import os
import time
import uuid
import logging
from typing import Optional

import jwt
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = "HS256"
JWT_TTL = 60 * 60 * 24 * 30  # 30 days

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").lower().strip()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
ADMIN_EMAILS = {e.strip().lower() for e in os.environ.get("ADMIN_EMAILS", "").split(",") if e.strip()}
if ADMIN_EMAIL:
    ADMIN_EMAILS.add(ADMIN_EMAIL)

pwd = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
bearer = HTTPBearer(auto_error=False)

_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
_db = _client[os.environ.get("DB_NAME", "test_database")]
_users = _db.users

router = APIRouter(prefix="/api/auth")


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ProfileIn(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    goal: Optional[str] = None
    level: Optional[str] = None
    days_per_week: Optional[int] = None
    session_minutes: Optional[int] = None
    equipment: Optional[str] = None
    onboarding_done: Optional[bool] = None


def _token(user_id: str) -> str:
    payload = {"sub": user_id, "iat": int(time.time()), "exp": int(time.time()) + JWT_TTL}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def _public(u: dict) -> dict:
    return {
        "id": u["id"],
        "name": u.get("name"),
        "email": u.get("email"),
        "plan": u.get("plan", "free"),
        "is_admin": u.get("is_admin", False),
        "profile": u.get("profile", {}),
        "onboarding_done": u.get("profile", {}).get("onboarding_done", False),
        "created_at": u.get("created_at"),
    }


async def current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)) -> dict:
    if not creds:
        raise HTTPException(401, "Não autenticado")
    try:
        data = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.PyJWTError:
        raise HTTPException(401, "Sessão inválida ou expirada")
    user = await _users.find_one({"id": data.get("sub")})
    if not user:
        raise HTTPException(401, "Usuário não encontrado")
    return user


async def require_admin(user: dict = Depends(current_user)) -> dict:
    if not user.get("is_admin"):
        raise HTTPException(403, "Acesso restrito a administradores")
    return user


async def ensure_admin():
    """Seed an admin account on startup (idempotent)."""
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        return
    existing = await _users.find_one({"email": ADMIN_EMAIL})
    if existing:
        if not existing.get("is_admin"):
            await _users.update_one({"id": existing["id"]}, {"$set": {"is_admin": True}})
        return
    await _users.insert_one({
        "id": str(uuid.uuid4()),
        "name": "Administrador",
        "email": ADMIN_EMAIL,
        "password_hash": pwd.hash(ADMIN_PASSWORD),
        "plan": "premium",
        "is_admin": True,
        "profile": {"onboarding_done": True},
        "created_at": time.time(),
    })


@router.post("/register")
async def register(data: RegisterIn):
    email = data.email.lower().strip()
    if await _users.find_one({"email": email}):
        raise HTTPException(409, "Este e-mail já está cadastrado")
    user = {
        "id": str(uuid.uuid4()),
        "name": data.name.strip(),
        "email": email,
        "password_hash": pwd.hash(data.password),
        "plan": "free",
        "is_admin": email in ADMIN_EMAILS,
        "profile": {"onboarding_done": False},
        "created_at": time.time(),
    }
    await _users.insert_one(user)
    return {"token": _token(user["id"]), "user": _public(user)}


@router.post("/login")
async def login(data: LoginIn):
    email = data.email.lower().strip()
    user = await _users.find_one({"email": email})
    if not user or not pwd.verify(data.password, user.get("password_hash", "")):
        raise HTTPException(401, "E-mail ou senha incorretos")
    return {"token": _token(user["id"]), "user": _public(user)}


@router.get("/me")
async def me(user: dict = Depends(current_user)):
    return {"user": _public(user)}


@router.put("/profile")
async def update_profile(data: ProfileIn, user: dict = Depends(current_user)):
    updates = {k: v for k, v in data.dict().items() if v is not None}
    set_doc = {}
    if "name" in updates:
        set_doc["name"] = updates.pop("name")
    for k, v in updates.items():
        set_doc[f"profile.{k}"] = v
    if set_doc:
        await _users.update_one({"id": user["id"]}, {"$set": set_doc})
    fresh = await _users.find_one({"id": user["id"]})
    return {"user": _public(fresh)}

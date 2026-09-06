"""
Workout sessions (real training log) + Admin endpoints.
Sessions are isolated per user. Admin routes require is_admin.
"""
import os
import time
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

from auth import current_user, require_admin

_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
_db = _client[os.environ.get("DB_NAME", "test_database")]
_sessions = _db.workout_sessions
_users = _db.users
_tx = _db.transactions

router = APIRouter(prefix="/api")


class SeriesIn(BaseModel):
    weight: float = 0
    reps: int = 0


class ExerciseLogIn(BaseModel):
    name: str
    series: List[SeriesIn] = []


class SessionIn(BaseModel):
    plan_id: str
    workout_name: str
    duration_seconds: int = 0
    exercises: List[ExerciseLogIn] = []


def _clean(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


@router.post("/workouts/session/finish")
async def finish_session(data: SessionIn, user: dict = Depends(current_user)):
    total_volume = 0.0
    total_sets = 0
    for ex in data.exercises:
        for s in ex.series:
            total_volume += (s.weight or 0) * (s.reps or 0)
            total_sets += 1
    session = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "plan_id": data.plan_id,
        "workout_name": data.workout_name,
        "duration_seconds": data.duration_seconds,
        "exercises": [e.dict() for e in data.exercises],
        "total_volume": round(total_volume, 2),
        "total_sets": total_sets,
        "created_at": time.time(),
    }
    await _sessions.insert_one(session)
    return _clean(session)


@router.get("/workouts/sessions")
async def list_sessions(user: dict = Depends(current_user)):
    rows = await _sessions.find({"user_id": user["id"]}).sort("created_at", -1).to_list(200)
    return [_clean(r) for r in rows]


@router.get("/workouts/progress")
async def progress(user: dict = Depends(current_user)):
    rows = await _sessions.find({"user_id": user["id"]}).sort("created_at", 1).to_list(500)
    rows = [_clean(r) for r in rows]
    total = len(rows)
    total_volume = round(sum(r.get("total_volume", 0) for r in rows), 2)
    total_time = sum(r.get("duration_seconds", 0) for r in rows)
    best_volume = max((r.get("total_volume", 0) for r in rows), default=0)
    return {
        "total_sessions": total,
        "total_volume": total_volume,
        "total_time_seconds": total_time,
        "best_volume": best_volume,
        "sessions": rows[-12:],
    }


# ---------------- Admin ----------------

@router.get("/admin/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    total_users = await _users.count_documents({})
    premium_users = await _users.count_documents({"plan": "premium"})
    total_sessions = await _sessions.count_documents({})
    now = time.time()
    day_ago = now - 86400
    sessions_today = await _sessions.count_documents({"created_at": {"$gte": day_ago}})
    paid_tx = await _tx.find({"status": "paid"}).to_list(1000)
    revenue = round(sum(t.get("amount", 0) for t in paid_tx), 2)
    new_users = await _users.count_documents({"created_at": {"$gte": day_ago}})
    return {
        "total_users": total_users,
        "premium_users": premium_users,
        "free_users": total_users - premium_users,
        "new_users_24h": new_users,
        "total_sessions": total_sessions,
        "sessions_today": sessions_today,
        "active_subscriptions": premium_users,
        "revenue_total": revenue,
        "paid_transactions": len(paid_tx),
    }


@router.get("/admin/users")
async def admin_users(admin: dict = Depends(require_admin)):
    rows = await _users.find({}).sort("created_at", -1).to_list(500)
    out = []
    for u in rows:
        out.append({
            "id": u["id"],
            "name": u.get("name"),
            "email": u.get("email"),
            "plan": u.get("plan", "free"),
            "is_admin": u.get("is_admin", False),
            "goal": u.get("profile", {}).get("goal"),
            "level": u.get("profile", {}).get("level"),
            "created_at": u.get("created_at"),
        })
    return out


@router.get("/admin/sessions")
async def admin_sessions(admin: dict = Depends(require_admin)):
    rows = await _sessions.find({}).sort("created_at", -1).to_list(200)
    return [_clean(r) for r in rows]

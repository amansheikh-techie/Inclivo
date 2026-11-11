from datetime import datetime, timezone
from app.core.supabase import get_supabase
from app.schemas.passport import PassportPayload


def get_passport(user_id: str) -> dict:
    res = get_supabase().table("passports").select("*").eq("user_id", user_id).execute()
    rows = res.data or []
    if rows:
        return rows[0]
    return {"user_id": user_id, **PassportPayload().model_dump(), "updated_at": None}


def upsert_passport(user_id: str, payload: PassportPayload) -> dict:
    row = {
        "user_id": user_id,
        **payload.model_dump(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    res = get_supabase().table("passports").upsert(row, on_conflict="user_id").execute()
    return res.data[0]

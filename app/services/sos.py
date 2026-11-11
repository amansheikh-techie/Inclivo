from fastapi import HTTPException, status
from app.core.supabase import get_supabase
from app.schemas.sos import ContactCreate


def list_contacts(user_id: str) -> list[dict]:
    res = (
        get_supabase()
        .table("emergency_contacts")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return res.data or []


def create_contact(user_id: str, payload: ContactCreate) -> dict:
    row = {"user_id": user_id, **payload.model_dump()}
    res = get_supabase().table("emergency_contacts").insert(row).execute()
    return res.data[0]


def delete_contact(user_id: str, contact_id: str) -> dict:
    res = (
        get_supabase()
        .table("emergency_contacts")
        .delete()
        .eq("id", contact_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found",
        )
    return {"deleted": True, "id": contact_id}


def trigger_sos(user_id: str, lat: float, lng: float) -> dict:
    event_res = (
        get_supabase()
        .table("sos_events")
        .insert({"user_id": user_id, "lat": lat, "lng": lng})
        .execute()
    )
    event = event_res.data[0]
    contacts = list_contacts(user_id)
    return {
        "event_id": event["id"],
        "maps_url": f"https://maps.google.com/?q={lat},{lng}",
        "contacts": contacts,
        "created_at": event.get("created_at"),
    }

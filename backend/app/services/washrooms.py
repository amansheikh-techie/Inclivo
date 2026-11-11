from app.core.supabase import get_supabase
from app.services.scoring import filter_by_radius


def list_washrooms(
    lat: float | None = None,
    lng: float | None = None,
    radius_km: float | None = None,
    verified: bool | None = None,
) -> list[dict]:
    query = get_supabase().table("washrooms").select("*")
    if verified is not None:
        query = query.eq("verified", verified)
    rows = query.execute().data or []
    return filter_by_radius(rows, lat, lng, radius_km)


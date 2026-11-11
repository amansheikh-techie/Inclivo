from fastapi import HTTPException, status
from app.core.supabase import get_supabase
from app.services.scoring import compute_accessibility_score, filter_by_radius


def _enrich_place(row: dict) -> dict:
    score, breakdown = compute_accessibility_score(row)
    return {**row, "accessibility_score": score, "score_breakdown": breakdown}


def list_places(
    ramp: bool | None = None,
    elevator: bool | None = None,
    parking: bool | None = None,
    wheelchair: bool | None = None,
    quiet: bool | None = None,
    lat: float | None = None,
    lng: float | None = None,
    radius_km: float | None = None,
) -> list[dict]:
    query = get_supabase().table("places").select("*")
    filters = (
        ("has_ramp", ramp),
        ("has_elevator", elevator),
        ("accessible_parking", parking),
        ("wheelchair_friendly", wheelchair),
        ("quiet", quiet),
    )
    for column, value in filters:
        if value is not None:
            query = query.eq(column, value)

    rows = query.execute().data or []
    rows = filter_by_radius(rows, lat, lng, radius_km)
    return [_enrich_place(row) for row in rows]


def get_place(place_id: str) -> dict:
    res = get_supabase().table("places").select("*").eq("id", place_id).execute()
    rows = res.data or []
    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found",
        )
    return _enrich_place(rows[0])


from pydantic import BaseModel


class PlaceOut(BaseModel):
    id: str
    name: str
    category: str | None = None
    lat: float
    lng: float
    address: str | None = None
    has_ramp: bool = False
    has_elevator: bool = False
    accessible_parking: bool = False
    wheelchair_friendly: bool = False
    quiet: bool = False
    rating: float | None = None
    accessibility_score: int
    score_breakdown: list[str]
    distance_km: float | None = None

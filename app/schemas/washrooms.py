from datetime import date
from pydantic import BaseModel


class WashroomOut(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    address: str | None = None
    cleanliness_rating: float | None = None
    verified: bool = False
    last_verified: date | None = None
    distance_km: float | None = None

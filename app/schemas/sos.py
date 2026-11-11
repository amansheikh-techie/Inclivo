from datetime import datetime
from pydantic import BaseModel, Field


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=5, max_length=30)


class ContactOut(ContactCreate):
    id: str
    user_id: str


class SosRequest(BaseModel):
    lat: float
    lng: float


class SosResponse(BaseModel):
    event_id: str
    maps_url: str
    contacts: list[ContactOut]
    created_at: datetime | None = None

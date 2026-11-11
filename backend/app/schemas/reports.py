from datetime import datetime
from pydantic import BaseModel


class ReportOut(BaseModel):
    id: str
    user_id: str | None = None
    issue_type: str
    description: str | None = None
    lat: float | None = None
    lng: float | None = None
    photo_url: str | None = None
    status: str = "open"
    upvotes: int = 0
    created_at: datetime | None = None


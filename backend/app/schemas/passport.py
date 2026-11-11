from datetime import datetime
from pydantic import BaseModel


class PassportPayload(BaseModel):
    mobility_needs: str | None = None
    vision_needs: str | None = None
    hearing_needs: str | None = None
    preferred_language: str = "en"
    font_size: str = "medium"
    sensory_mode: bool = False


class PassportOut(PassportPayload):
    user_id: str
    updated_at: datetime | None = None


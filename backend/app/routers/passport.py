from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.schemas.passport import PassportOut, PassportPayload
from app.services import passport as passport_service

router = APIRouter(prefix="/passport", tags=["passport"])


@router.get("", response_model=PassportOut)
def get_passport(user_id: str = Depends(get_current_user)):
    return passport_service.get_passport(user_id)


@router.put("", response_model=PassportOut)
def update_passport(payload: PassportPayload, user_id: str = Depends(get_current_user)):
    return passport_service.upsert_passport(user_id, payload)


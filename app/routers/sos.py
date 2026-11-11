from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.schemas.sos import ContactCreate, ContactOut, SosRequest, SosResponse
from app.services import sos as sos_service

router = APIRouter(tags=["sos"])


@router.get("/contacts", response_model=list[ContactOut])
def get_contacts(user_id: str = Depends(get_current_user)):
    return sos_service.list_contacts(user_id)


@router.post("/contacts", response_model=ContactOut)
def add_contact(payload: ContactCreate, user_id: str = Depends(get_current_user)):
    return sos_service.create_contact(user_id, payload)


@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: str, user_id: str = Depends(get_current_user)):
    return sos_service.delete_contact(user_id, contact_id)


@router.post("/sos", response_model=SosResponse)
def trigger_sos(payload: SosRequest, user_id: str = Depends(get_current_user)):
    return sos_service.trigger_sos(user_id, payload.lat, payload.lng)

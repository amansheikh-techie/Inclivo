from fastapi import APIRouter
from app.schemas.washrooms import WashroomOut
from app.services import washrooms as washrooms_service

router = APIRouter(prefix="/washrooms", tags=["washrooms"])


@router.get("", response_model=list[WashroomOut])
def get_washrooms(
    lat: float | None = None,
    lng: float | None = None,
    radius_km: float | None = None,
    verified: bool | None = None,
):
    return washrooms_service.list_washrooms(
        lat=lat,
        lng=lng,
        radius_km=radius_km,
        verified=verified,
    )

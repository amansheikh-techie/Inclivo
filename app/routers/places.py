from fastapi import APIRouter
from app.schemas.places import PlaceOut
from app.services import places as places_service

router = APIRouter(prefix="/places", tags=["places"])


@router.get("", response_model=list[PlaceOut])
def get_places(
    ramp: bool | None = None,
    elevator: bool | None = None,
    parking: bool | None = None,
    wheelchair: bool | None = None,
    quiet: bool | None = None,
    lat: float | None = None,
    lng: float | None = None,
    radius_km: float | None = None,
):
    return places_service.list_places(
        ramp=ramp,
        elevator=elevator,
        parking=parking,
        wheelchair=wheelchair,
        quiet=quiet,
        lat=lat,
        lng=lng,
        radius_km=radius_km,
    )


@router.get("/{place_id}", response_model=PlaceOut)
def get_place(place_id: str):
    return places_service.get_place(place_id)

from fastapi import APIRouter
from app.schemas.schemes import MatchedSchemeOut, SchemeMatchRequest, SchemeOut
from app.services import schemes as schemes_service

router = APIRouter(prefix="/schemes", tags=["schemes"])


@router.get("", response_model=list[SchemeOut])
def get_schemes(
    q: str | None = None,
    type: str | None = None,
    state: str | None = None,
    lang: str = "en",
):
    return schemes_service.list_schemes(
        q=q,
        disability_type=type,
        state=state,
        lang=lang,
    )


@router.post("/match", response_model=list[MatchedSchemeOut])
async def match_schemes(payload: SchemeMatchRequest):
    return await schemes_service.match_schemes(payload)


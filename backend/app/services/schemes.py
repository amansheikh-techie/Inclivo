from app.core.supabase import get_supabase
from app.schemas.schemes import SchemeMatchRequest
from app.services import gemini

LANG_NAME_FIELD = {"hi": "name_hi", "te": "name_te", "ta": "name_ta"}


def _localize_scheme(row: dict, lang: str) -> dict:
    field = LANG_NAME_FIELD.get(lang.lower())
    display_name = (row.get(field) if field else None) or row["name"]
    return {**row, "display_name": display_name}


def list_schemes(
    q: str | None = None,
    disability_type: str | None = None,
    state: str | None = None,
    lang: str = "en",
) -> list[dict]:
    rows = get_supabase().table("schemes").select("*").execute().data or []
    filtered: list[dict] = []
    q_lower = q.lower().strip() if q else None
    type_lower = disability_type.lower().strip() if disability_type else None
    state_lower = state.lower().strip() if state else None

    for row in rows:
        if type_lower:
            row_type = (row.get("disability_type") or "").lower()
            if row_type not in (type_lower, "all"):
                continue
        if state_lower:
            row_state = (row.get("state") or "").lower()
            if row_state not in (state_lower, "india"):
                continue
        if q_lower:
            haystack = " ".join(
                str(row.get(k) or "") for k in ("name", "description", "eligibility", "benefits")
            ).lower()
            if q_lower not in haystack:
                continue
        filtered.append(_localize_scheme(row, lang))
    return filtered


async def match_schemes(payload: SchemeMatchRequest) -> list[dict]:
    candidates = list_schemes(
        disability_type=payload.disability_type,
        state=payload.state,
        lang=payload.lang,
    )
    if not candidates:
        return []

    ranked = await gemini.match_schemes_ai(payload.model_dump(), candidates)
    if ranked:
        by_id = {s["id"]: s for s in candidates}
        return [
            {"scheme": by_id[item["id"]], "reason": item["reason"]}
            for item in ranked
            if item["id"] in by_id
        ]

    return [
        {
            "scheme": s,
            "reason": f"Matches {payload.disability_type} criteria"
            + (f" in {s['state']}" if s.get("state") else ""),
        }
        for s in candidates
    ]


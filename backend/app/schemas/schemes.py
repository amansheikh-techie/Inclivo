from pydantic import BaseModel


class SchemeOut(BaseModel):
    id: str
    name: str
    display_name: str
    description: str | None = None
    eligibility: str | None = None
    benefits: str | None = None
    disability_type: str | None = None
    state: str | None = None
    apply_url: str | None = None
    name_hi: str | None = None
    name_te: str | None = None
    name_ta: str | None = None


class SchemeMatchRequest(BaseModel):
    disability_type: str
    age: int | None = None
    state: str | None = None
    income_range: str | None = None
    lang: str = "en"


class MatchedSchemeOut(BaseModel):
    scheme: SchemeOut
    reason: str


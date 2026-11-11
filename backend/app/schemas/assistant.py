from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    lang: str = "en"


class ChatResponse(BaseModel):
    reply: str


class DescribeImageResponse(BaseModel):
    description: str


class OcrResponse(BaseModel):
    text: str
    summary: str


class SimplifyRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=8000)
    lang: str = "en"


class SimplifyResponse(BaseModel):
    simplified: str


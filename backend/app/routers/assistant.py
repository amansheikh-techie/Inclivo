from fastapi import APIRouter, File, Form, Request, UploadFile
from app.core.limiter import limiter
from app.core.uploads import validate_image_upload
from app.schemas.assistant import (
    ChatRequest,
    ChatResponse,
    DescribeImageResponse,
    OcrResponse,
    SimplifyRequest,
    SimplifyResponse,
)
from app.services import gemini

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(request: Request, payload: ChatRequest):
    reply = await gemini.chat(payload.message, payload.lang)
    return ChatResponse(reply=reply)


@router.post("/describe-image", response_model=DescribeImageResponse)
@limiter.limit("10/minute")
async def describe_image(
    request: Request,
    image: UploadFile = File(...),
    lang: str = Form("en"),
):
    image_bytes = await validate_image_upload(image)
    description = await gemini.describe_image(
        image_bytes, image.content_type or "image/jpeg", lang
    )
    return DescribeImageResponse(description=description)


@router.post("/ocr", response_model=OcrResponse)
@limiter.limit("10/minute")
async def ocr(
    request: Request,
    image: UploadFile = File(...),
    lang: str = Form("en"),
):
    image_bytes = await validate_image_upload(image)
    text, summary = await gemini.ocr_image(
        image_bytes, image.content_type or "image/jpeg", lang
    )
    return OcrResponse(text=text, summary=summary)


@router.post("/simplify", response_model=SimplifyResponse)
@limiter.limit("10/minute")
async def simplify(request: Request, payload: SimplifyRequest):
    simplified = await gemini.simplify_text(payload.text, payload.lang)
    return SimplifyResponse(simplified=simplified)


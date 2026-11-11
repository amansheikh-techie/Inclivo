from fastapi import HTTPException, UploadFile, status

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024


async def validate_image_upload(file: UploadFile) -> bytes:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG and PNG images are allowed",
        )
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image size exceeds 5 MB limit",
        )
    return data


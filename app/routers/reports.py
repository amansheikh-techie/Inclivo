from fastapi import APIRouter, Depends, File, Form, UploadFile
from app.core.auth import get_current_user
from app.core.uploads import validate_image_upload
from app.schemas.reports import ReportOut
from app.services import reports as reports_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=list[ReportOut])
def get_reports(status: str | None = None):
    return reports_service.list_reports(status_filter=status)


@router.post("", response_model=ReportOut)
async def create_report(
    issue_type: str = Form(...),
    description: str | None = Form(None),
    lat: float | None = Form(None),
    lng: float | None = Form(None),
    photo: UploadFile | None = File(None),
    user_id: str = Depends(get_current_user),
):
    photo_bytes = None
    photo_mime = None
    if photo is not None:
        photo_bytes = await validate_image_upload(photo)
        photo_mime = photo.content_type
    return reports_service.create_report(
        user_id=user_id,
        issue_type=issue_type,
        description=description,
        lat=lat,
        lng=lng,
        photo_bytes=photo_bytes,
        photo_mime=photo_mime,
    )


@router.post("/{report_id}/upvote", response_model=ReportOut)
def upvote_report(report_id: str, _: str = Depends(get_current_user)):
    return reports_service.upvote_report(report_id)

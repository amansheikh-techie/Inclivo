import uuid
from fastapi import HTTPException, status
from app.core.supabase import get_supabase

BUCKET_NAME = "report-photos"
MIME_EXTENSIONS = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
}


def list_reports(status_filter: str | None = None) -> list[dict]:
    query = get_supabase().table("reports").select("*").order("created_at", desc=True)
    if status_filter:
        query = query.eq("status", status_filter)
    return query.execute().data or []


def create_report(
    user_id: str,
    issue_type: str,
    description: str | None,
    lat: float | None,
    lng: float | None,
    photo_bytes: bytes | None = None,
    photo_mime: str | None = None,
) -> dict:
    supabase = get_supabase()
    photo_url = None
    if photo_bytes and photo_mime:
        normalized_mime = photo_mime.split(";")[0].strip().lower()
        ext = MIME_EXTENSIONS.get(normalized_mime, "jpg")
        path = f"{user_id}/{uuid.uuid4()}.{ext}"
        supabase.storage.from_(BUCKET_NAME).upload(
            path,
            photo_bytes,
            {"content-type": normalized_mime},
        )
        photo_url = supabase.storage.from_(BUCKET_NAME).get_public_url(path)

    row = {
        "user_id": user_id,
        "issue_type": issue_type,
        "description": description,
        "lat": lat,
        "lng": lng,
        "photo_url": photo_url,
    }
    res = supabase.table("reports").insert(row).execute()
    return res.data[0]


def upvote_report(report_id: str, user_id: str) -> dict:
    supabase = get_supabase()
    existing = supabase.table("reports").select("id").eq("id", report_id).execute().data or []
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    try:
        supabase.table("report_upvotes").insert(
            {"report_id": report_id, "user_id": user_id}
        ).execute()
    except Exception as exc:
        msg = str(exc).lower()
        if (
            getattr(exc, "code", None) == "23505"
            or "23505" in msg
            or "duplicate" in msg
            or "already exists" in msg
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Already upvoted",
            ) from exc
        raise

    count_res = (
        supabase.table("report_upvotes")
        .select("report_id", count="exact")
        .eq("report_id", report_id)
        .execute()
    )
    new_votes = count_res.count if count_res.count is not None else len(count_res.data or [])
    res = (
        supabase.table("reports")
        .update({"upvotes": new_votes})
        .eq("id", report_id)
        .execute()
    )
    return res.data[0]


import asyncio
import json
import logging
from google import genai
from google.genai import types
from app.config import get_settings

logger = logging.getLogger(__name__)

GEMINI_TIMEOUT_SEC = 15.0
FALLBACK_MESSAGE = (
    "The AI assistant is temporarily unavailable. Please try again shortly."
)
CHAT_SYSTEM_PROMPT = (
    "You are Inclivo, a concise, friendly assistant for people with disabilities. "
    "Reply in the user's language. Keep answers short and easy to speak aloud. "
    "If unsure, say so."
)
CANNED_FAQ = (
    (("udid", "disability card", "id card"),
     "You can apply for a UDID card online at swavlambancard.gov.in with your disability certificate, ID proof, and photo."),
    (("washroom", "toilet", "restroom"),
     "Open the Washrooms tab in Inclivo to filter nearby accessible washrooms and check verified ratings."),
    (("sos", "emergency", "help"),
     "Use the SOS button in Inclivo to log your location and share a Google Maps link with your saved emergency contacts."),
    (("scheme", "pension", "scholarship"),
     "Open the Schemes tab in Inclivo and use Scheme Match with your state and disability type to find eligible programs."),
)


def _canned_chat_reply(message: str) -> str:
    lower = message.lower()
    for keywords, reply in CANNED_FAQ:
        if any(word in lower for word in keywords):
            return reply
    return FALLBACK_MESSAGE


def _strip_json_fences(raw: str) -> str:
    text = raw.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return text


async def _generate(contents, system_instruction: str | None = None) -> str | None:
    settings = get_settings()
    if not settings.gemini_api_key or not settings.gemini_model:
        return None

    def _call() -> str:
        client = genai.Client(api_key=settings.gemini_api_key)
        config = (
            types.GenerateContentConfig(system_instruction=system_instruction)
            if system_instruction
            else None
        )
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=contents,
            config=config,
        )
        return (response.text or "").strip()

    try:
        text = await asyncio.wait_for(asyncio.to_thread(_call), timeout=GEMINI_TIMEOUT_SEC)
        return text or None
    except Exception:
        logger.exception("Gemini _generate failed")
        return None


async def chat(message: str, lang: str = "en") -> str:
    prompt = f"Language: {lang}\nUser: {message}"
    reply = await _generate(prompt, system_instruction=CHAT_SYSTEM_PROMPT)
    return reply or _canned_chat_reply(message)


async def describe_image(image_bytes: bytes, mime_type: str, lang: str = "en") -> str:
    prompt = (
        f"Describe this scene for a blind person: obstacles, signs, people, layout, in {lang}."
    )
    part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    reply = await _generate([prompt, part])
    return reply or FALLBACK_MESSAGE


async def ocr_image(image_bytes: bytes, mime_type: str, lang: str = "en") -> tuple[str, str]:
    prompt = (
        "Extract all visible text exactly as written, then give a one-line summary "
        f"in {lang}. Return valid JSON with keys \"text\" and \"summary\"."
    )
    part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    raw = await _generate([prompt, part])
    if not raw:
        return "", FALLBACK_MESSAGE
    try:
        parsed = json.loads(_strip_json_fences(raw))
        return str(parsed.get("text", "")), str(parsed.get("summary", FALLBACK_MESSAGE))
    except Exception:
        return raw, raw.splitlines()[0][:200]


async def simplify_text(text: str, lang: str = "en") -> str:
    prompt = f"Explain this government scheme in simple words in {lang}:\n\n{text}"
    reply = await _generate(prompt)
    return reply or FALLBACK_MESSAGE


async def match_schemes_ai(user_answers: dict, schemes: list[dict]) -> list[dict] | None:
    compact_schemes = [
        {
            "id": s["id"],
            "name": s["name"],
            "disability_type": s.get("disability_type"),
            "state": s.get("state"),
            "eligibility": s.get("eligibility"),
            "benefits": s.get("benefits"),
        }
        for s in schemes
    ]
    lang = user_answers.get("lang", "en")
    prompt = (
        "Given these user details and schemes, return ONLY a JSON array of matching "
        'items ranked best-first as [{"id": "<scheme_id>", "reason": "<one-line reason in '
        + f"{lang}"
        + '>"}].\n'
        f"User: {json.dumps(user_answers)}\n"
        f"Schemes: {json.dumps(compact_schemes)}"
    )
    raw = await _generate(prompt)
    if not raw:
        return None
    try:
        parsed = json.loads(_strip_json_fences(raw))
        if not isinstance(parsed, list):
            return None
        valid_ids = {s["id"] for s in schemes}
        cleaned = [
            {"id": item["id"], "reason": str(item.get("reason", "Matches your profile"))}
            for item in parsed
            if isinstance(item, dict) and item.get("id") in valid_ids
        ]
        return cleaned or None
    except Exception:
        return None

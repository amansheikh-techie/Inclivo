from google import genai
from app.config import get_settings


def mask_key(key: str) -> str:
    if not key:
        return "UNSET (len=0)"
    return f"{key[:4]}... (len={len(key)})"


def test_call(label: str, *, vertexai: bool, api_key: str, model: str) -> None:
    print(f"--- {label} (vertexai={vertexai}, model={model}) ---")
    try:
        client = (
            genai.Client(vertexai=True, api_key=api_key)
            if vertexai
            else genai.Client(api_key=api_key)
        )
        resp = client.models.generate_content(
            model=model,
            contents="Say hello in one short sentence",
        )
        print("SUCCESS:", (resp.text or "").strip())
    except Exception as exc:
        msg = str(exc).replace(api_key, mask_key(api_key)) if api_key else str(exc)
        print(f"FAILED: {type(exc).__name__}: {msg}")


def main() -> None:
    settings = get_settings()
    key = settings.gemini_api_key or ""
    model = settings.gemini_model or ""
    print(f"GEMINI_API_KEY={mask_key(key)}, GEMINI_MODEL={model!r}")

    # 1. Exact gemini.py configuration
    test_call("1. Exact gemini.py config", vertexai=False, api_key=key, model=model)

    # 2. Alternative models with standard client
    for alt_model in ("gemini-2.0-flash", "gemini-2.5-flash-lite"):
        test_call(f"2. Standard client + {alt_model}", vertexai=False, api_key=key, model=alt_model)

    # 3. Vertex AI express mode
    for v_model in (model, "gemini-2.0-flash", "gemini-2.5-flash-lite"):
        test_call(f"3. Vertex AI express + {v_model}", vertexai=True, api_key=key, model=v_model)


if __name__ == "__main__":
    main()


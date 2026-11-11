from functools import lru_cache
import os
from pathlib import Path
from pydantic import BaseModel, Field


def _load_dotenv() -> None:
    env_path = Path(".env")
    if not env_path.is_file():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv()


class Settings(BaseModel):
    supabase_url: str = Field(default_factory=lambda: os.getenv("SUPABASE_URL", ""))
    supabase_service_key: str = Field(
        default_factory=lambda: os.getenv("SUPABASE_SERVICE_KEY", "")
    )
    gemini_api_key: str = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY", ""))
    gemini_model: str = Field(default_factory=lambda: os.getenv("GEMINI_MODEL", ""))
    client_origins: list[str] = Field(
        default_factory=lambda: [
            o.strip() for o in os.getenv("CLIENT_ORIGINS", "").split(",") if o.strip()
        ]
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

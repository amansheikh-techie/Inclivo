from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from app.config import get_settings
from app.core.errors import register_error_handlers
from app.core.limiter import limiter
from app.routers import assistant, passport, places, reports, schemes, sos, washrooms

settings = get_settings()

app = FastAPI(title="Inclivo API")
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.client_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SlowAPIMiddleware)
register_error_handlers(app)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


for router in (
    places.router,
    washrooms.router,
    schemes.router,
    assistant.router,
    reports.router,
    passport.router,
    sos.router,
):
    app.include_router(router, prefix="/api")

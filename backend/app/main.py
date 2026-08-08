from fastapi import FastAPI, Request
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.core.security import setup_security
from app.core.logging import setup_logging
from app.middleware.request_id import RequestIDMiddleware
from app.api.v1.router import api_router

setup_logging()

class CacheControlMiddleware(BaseHTTPMiddleware):
    """
    Middleware that adds HTTP Cache-Control headers to GET API responses.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if request.method == "GET" and response.status_code == 200:
            if "/api/v1/historical" in request.url.path or "/api/v1/seasons" in request.url.path:
                response.headers["Cache-Control"] = "public, max-age=86400, stale-while-revalidate=3600"
            else:
                response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=10"
        return response

app = FastAPI(
    title="F1 Hub API",
    description="Production-grade Formula 1 Data API providing real-time and historical F1 analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json"
)

# GZip Compression for payloads >= 1000 bytes
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(CacheControlMiddleware)
app.add_middleware(RequestIDMiddleware)
setup_security(app)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "title": "🏎️ F1 Hub API",
        "docs": "/docs",
        "health": "/api/v1/health",
        "version": "1.0.0"
    }

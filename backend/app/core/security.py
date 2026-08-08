import time
import logging
from typing import Dict, Tuple
from fastapi import FastAPI, Request, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings

logger = logging.getLogger("f1_security")

# Rate Limiter In-Memory Sliding Window (IP -> (request_count, window_start_time))
RATE_LIMIT_REQUESTS = 120  # Max requests per minute
RATE_LIMIT_WINDOW = 60      # Window in seconds
ip_request_counts: Dict[str, Tuple[int, float]] = {}

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware that enforces OWASP Security Headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "img-src 'self' data: https:; "
            "style-src 'self' 'unsafe-inline'; "
            "script-src 'self' 'unsafe-inline';"
        )
        return response

class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Middleware that enforces per-IP Rate Limiting to prevent DoS attacks and API abuse.
    """
    async def dispatch(self, request: Request, call_next):
        # Exclude health check endpoints from rate limiting
        if "/health" in request.url.path:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        if client_ip in ip_request_counts:
            count, start_time = ip_request_counts[client_ip]
            if now - start_time < RATE_LIMIT_WINDOW:
                if count >= RATE_LIMIT_REQUESTS:
                    logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                    return HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Too many requests. Please slow down."
                    )
                ip_request_counts[client_ip] = (count + 1, start_time)
            else:
                ip_request_counts[client_ip] = (1, now)
        else:
            ip_request_counts[client_ip] = (1, now)

        return await call_next(request)

def setup_security(app: FastAPI):
    """
    Configures CORS, Security Headers, and Rate Limiting on the FastAPI application instance.
    """
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RateLimiterMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    if settings.SECRET_KEY and api_key and api_key == settings.SECRET_KEY:
        return api_key
    # Public endpoints proceed without strict API key requirement
    return None

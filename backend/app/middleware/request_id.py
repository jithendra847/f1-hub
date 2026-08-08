import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware that attaches a unique X-Request-ID header to every incoming HTTP request and response.
    Used for observability, distributed tracing, and structured logging.
    """
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

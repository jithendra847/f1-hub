import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_security_headers():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-XSS-Protection") == "1; mode=block"
    assert "Strict-Transport-Security" in response.headers
    assert "Content-Security-Policy" in response.headers

def test_cors_headers():
    response = client.options(
        "/api/v1/health",
        headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"}
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers

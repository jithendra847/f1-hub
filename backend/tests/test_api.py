import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoints():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "X-Request-ID" in response.headers

def test_seasons_endpoint():
    response = client.get("/api/v1/seasons")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data

def test_calendar_endpoint():
    response = client.get("/api/v1/calendar?season=current")
    assert response.status_code == 200
    data = response.json()
    assert "races" in data

def test_standings_endpoints():
    response = client.get("/api/v1/standings/drivers?season=current")
    assert response.status_code == 200
    data = response.json()
    assert "standings" in data

    response = client.get("/api/v1/standings/constructors?season=current")
    assert response.status_code == 200
    data = response.json()
    assert "standings" in data

def test_drivers_endpoint():
    response = client.get("/api/v1/drivers?season=current")
    assert response.status_code == 200
    data = response.json()
    assert "drivers" in data

def test_constructors_endpoint():
    response = client.get("/api/v1/constructors?season=current")
    assert response.status_code == 200
    data = response.json()
    assert "constructors" in data

def test_circuits_endpoint():
    response = client.get("/api/v1/circuits")
    assert response.status_code == 200
    data = response.json()
    assert "circuits" in data

def test_news_endpoint():
    response = client.get("/api/v1/news")
    assert response.status_code == 200
    data = response.json()
    assert "articles" in data

def test_technical_updates_endpoint():
    response = client.get("/api/v1/technical-updates")
    assert response.status_code == 200
    data = response.json()
    assert "updates" in data
    assert data["message"] == "No verified technical updates available."

def test_weather_endpoint():
    response = client.get("/api/v1/weather/2026_1")
    assert response.status_code == 200
    data = response.json()
    assert "weather" in data

def test_search_endpoint():
    response = client.get("/api/v1/search?q=verstappen")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data

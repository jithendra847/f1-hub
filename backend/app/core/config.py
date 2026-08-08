from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    CURRENT_F1_SEASON: int = 2026
    LOG_LEVEL: str = "INFO"
    SECRET_KEY: str = "change-this-in-production-f1-2026-secret-key"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://f1_user:f1_password@postgres:5432/f1_analytics"


    # Data Providers
    JOLPICA_BASE_URL: str = "https://api.jolpi.ca/ergast/f1"
    OPENF1_BASE_URL: str = "https://api.openf1.org/v1"
    FASTF1_CACHE_DIR: str = "/tmp/fastf1_cache"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

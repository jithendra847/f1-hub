from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NewsArticleSchema(BaseModel):
    title: str
    subtitle: Optional[str] = None
    summary: str
    author: Optional[str] = None
    image_url: Optional[str] = None
    source: str
    category: str = "RACE"
    article_url: str
    confidence_score: float = 1.0
    provider: str = "RSSAdapter"
    verification_status: str = "VERIFIED"
    published_at: datetime

class TechnicalUpdateSchema(BaseModel):
    race_id: str
    constructor_id: str
    category: str
    description: str
    source_url: Optional[str] = None
    verification_status: str = "OFFICIAL"
    published_at: Optional[datetime] = None

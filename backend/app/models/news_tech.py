import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base

class TechnicalUpdate(Base):
    __tablename__ = "technical_updates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    race_id = Column(String(100), ForeignKey("races.id", ondelete="CASCADE"), nullable=False, index=True)
    constructor_id = Column(String(100), ForeignKey("constructors.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(100), nullable=False) # Front Wing, Rear Wing, Floor, Sidepod, Diffuser, Engine
    description = Column(Text, nullable=False)
    source_url = Column(String(512), nullable=True)
    verification_status = Column(String(50), default="OFFICIAL", nullable=False) # OFFICIAL, REPORTED, ANALYSIS
    published_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    race = relationship("Race", back_populates="technical_updates")

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(512), nullable=False)
    subtitle = Column(String(512), nullable=True)
    summary = Column(Text, nullable=False)
    author = Column(String(255), nullable=True)
    image_url = Column(String(512), nullable=True)
    source = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True) # RACE, DRIVERS, TEAMS, TECHNICAL, FIA, REGULATIONS, TRANSFERS, BREAKING
    article_url = Column(String(512), unique=True, nullable=False, index=True)
    confidence_score = Column(Float, default=1.0, nullable=False)
    provider = Column(String(50), nullable=False)
    verification_status = Column(String(50), default="VERIFIED", nullable=False)
    published_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

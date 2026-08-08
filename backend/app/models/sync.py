import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class DataSyncRun(Base):
    __tablename__ = "data_sync_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String(100), nullable=False, index=True)
    job_name = Column(String(100), nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="RUNNING", nullable=False) # RUNNING, SUCCESS, FAILED, RETRYING
    records_processed = Column(Integer, default=0, nullable=False)
    records_changed = Column(Integer, default=0, nullable=False)
    error_message = Column(Text, nullable=True)

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(String(50), primary_key=True) # e.g. jolpica, fastf1, openf1, weather, news
    name = Column(String(100), nullable=False)
    base_url = Column(String(512), nullable=True)
    is_active = Column(String(20), default="ACTIVE", nullable=False)
    priority = Column(Integer, default=1, nullable=False)
    last_synced_at = Column(DateTime, nullable=True)

import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.sync import DataSyncRun

class SyncRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def start_sync_run(self, provider: str, job_name: str) -> DataSyncRun:
        run = DataSyncRun(
            provider=provider,
            job_name=job_name,
            started_at=datetime.utcnow(),
            status="RUNNING",
            records_processed=0,
            records_changed=0
        )
        self.db.add(run)
        await self.db.commit()
        await self.db.refresh(run)
        return run

    async def record_sync_success(self, run_id: uuid.UUID, processed: int, changed: int) -> DataSyncRun:
        res = await self.db.get(DataSyncRun, run_id)
        if res:
            res.status = "SUCCESS"
            res.completed_at = datetime.utcnow()
            res.records_processed = processed
            res.records_changed = changed
            await self.db.commit()
            await self.db.refresh(res)
        return res

    async def record_sync_failure(self, run_id: uuid.UUID, error_msg: str) -> DataSyncRun:
        res = await self.db.get(DataSyncRun, run_id)
        if res:
            res.status = "FAILED"
            res.completed_at = datetime.utcnow()
            res.error_message = error_msg
            await self.db.commit()
            await self.db.refresh(res)
        return res

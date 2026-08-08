import logging
from datetime import datetime, date
from typing import List, Dict, Any, Union
from sqlalchemy.ext.asyncio import AsyncSession
from app.providers.manager import provider_manager
from app.repositories.f1_repository import F1Repository
from app.repositories.sync_repository import SyncRepository
from app.schemas.f1 import (
    SeasonSchema, CircuitSchema, RaceSchema, SessionSchema, DriverStandingSchema, ConstructorStandingSchema, SessionResultSchema
)

logger = logging.getLogger("f1_services.ingestion")

class IngestionService:
    """
    Data Ingestion and Normalization Service.
    Normalizes provider payloads into canonical internal models, validates data with Pydantic,
    executes idempotent repository upserts, and records sync execution metrics in data_sync_runs.
    """
    def __init__(self, db: AsyncSession):
        self.db = db
        self.f1_repo = F1Repository(db)
        self.sync_repo = SyncRepository(db)

    async def sync_calendar(self, season: Union[int, str] = "current") -> Dict[str, Any]:
        year = 2026 if season == "current" else int(season)
        sync_run = await self.sync_repo.start_sync_run("ProviderManager", f"sync_calendar_{year}")

        try:
            raw_races = await provider_manager.get_schedule(season)
            if not raw_races:
                await self.sync_repo.record_sync_success(sync_run.id, processed=0, changed=0)
                return {"status": "SUCCESS", "records_processed": 0}

            # Upsert Season record first
            await self.f1_repo.upsert_season(SeasonSchema(year=year))

            processed_count = 0
            changed_count = 0

            for item in raw_races:
                # 1. Normalize & Validate Circuit
                circuit_data = item.get("circuit", {})
                circuit_schema = CircuitSchema(
                    id=circuit_data.get("id", "unknown"),
                    name=circuit_data.get("name", "Unknown Circuit"),
                    locality=circuit_data.get("locality"),
                    country=circuit_data.get("country"),
                    latitude=circuit_data.get("lat"),
                    longitude=circuit_data.get("long")
                )
                await self.f1_repo.upsert_circuit(circuit_schema)

                # 2. Normalize & Validate Race
                race_date = date.fromisoformat(item["date"]) if isinstance(item["date"], str) else item["date"]
                race_id = f"{year}_{item['round']}"
                race_schema = RaceSchema(
                    id=race_id,
                    season=year,
                    round=item["round"],
                    name=item["name"],
                    circuit_id=circuit_schema.id,
                    date=race_date,
                    status="UPCOMING" if race_date > date.today() else "COMPLETED"
                )
                await self.f1_repo.upsert_race(race_schema)

                # 3. Create default Race session
                session_schema = SessionSchema(
                    id=f"{race_id}_race",
                    race_id=race_id,
                    type="RACE",
                    name="Grand Prix Race",
                    scheduled_start=datetime.combine(race_date, datetime.min.time()),
                    status="SCHEDULED" if race_date > date.today() else "COMPLETED"
                )
                await self.f1_repo.upsert_session(session_schema)

                processed_count += 1
                changed_count += 1

            await self.sync_repo.record_sync_success(sync_run.id, processed=processed_count, changed=changed_count)
            logger.info(f"Calendar sync for {year} completed. Processed: {processed_count}")
            return {"status": "SUCCESS", "records_processed": processed_count, "records_changed": changed_count}

        except Exception as e:
            logger.error(f"Calendar sync for {year} failed: {e}")
            await self.sync_repo.record_sync_failure(sync_run.id, str(e))
            raise e

    async def sync_driver_standings(self, season: Union[int, str] = "current") -> Dict[str, Any]:
        year = 2026 if season == "current" else int(season)
        sync_run = await self.sync_repo.start_sync_run("ProviderManager", f"sync_driver_standings_{year}")

        try:
            raw_standings = await provider_manager.get_driver_standings(season)
            if not raw_standings:
                await self.sync_repo.record_sync_success(sync_run.id, processed=0, changed=0)
                return {"status": "SUCCESS", "records_processed": 0}

            processed_count = 0
            for item in raw_standings:
                schema = DriverStandingSchema(
                    season=year,
                    round=1, # Default current round
                    driver_id=item["driver_id"],
                    constructor_id=item.get("constructor_id"),
                    position=item["position"],
                    points=item["points"],
                    wins=item.get("wins", 0)
                )
                await self.f1_repo.upsert_driver_standing(schema)
                processed_count += 1

            await self.sync_repo.record_sync_success(sync_run.id, processed=processed_count, changed=processed_count)
            return {"status": "SUCCESS", "records_processed": processed_count}

        except Exception as e:
            await self.sync_repo.record_sync_failure(sync_run.id, str(e))
            raise e

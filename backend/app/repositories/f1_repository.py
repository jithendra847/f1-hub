import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from app.models.f1 import (
    Season, Circuit, Constructor, Driver, Race, Session, SessionResult, DriverStanding, ConstructorStanding
)
from app.schemas.f1 import (
    SeasonSchema, CircuitSchema, ConstructorSchema, DriverSchema, RaceSchema, SessionSchema, SessionResultSchema, DriverStandingSchema, ConstructorStandingSchema
)

logger = logging.getLogger("f1_repositories.f1")

class F1Repository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def upsert_season(self, schema: SeasonSchema) -> Season:
        stmt = pg_insert(Season).values(
            year=schema.year,
            wikipedia_url=schema.wikipedia_url
        ).on_conflict_do_update(
            index_elements=["year"],
            set_={"wikipedia_url": schema.wikipedia_url}
        )
        await self.db.execute(stmt)
        await self.db.commit()
        return await self.db.get(Season, schema.year)

    async def upsert_circuit(self, schema: CircuitSchema) -> Circuit:
        stmt = pg_insert(Circuit).values(
            id=schema.id,
            name=schema.name,
            locality=schema.locality,
            country=schema.country,
            latitude=schema.latitude,
            longitude=schema.longitude,
            length_km=schema.length_km,
            turns=schema.turns
        ).on_conflict_do_update(
            index_elements=["id"],
            set_={
                "name": schema.name,
                "locality": schema.locality,
                "country": schema.country,
                "latitude": schema.latitude,
                "longitude": schema.longitude,
                "length_km": schema.length_km,
                "turns": schema.turns
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        res = await self.db.get(Circuit, schema.id)
        if res:
            await self.db.refresh(res)
        return res

    async def upsert_constructor(self, schema: ConstructorSchema) -> Constructor:
        stmt = pg_insert(Constructor).values(
            id=schema.id,
            name=schema.name,
            nationality=schema.nationality,
            color_hex=schema.color_hex,
            logo_url=schema.logo_url
        ).on_conflict_do_update(
            index_elements=["id"],
            set_={
                "name": schema.name,
                "nationality": schema.nationality,
                "color_hex": schema.color_hex,
                "logo_url": schema.logo_url
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        res = await self.db.get(Constructor, schema.id)
        if res:
            await self.db.refresh(res)
        return res

    async def upsert_driver(self, schema: DriverSchema) -> Driver:
        stmt = pg_insert(Driver).values(
            id=schema.id,
            driver_code=schema.driver_code,
            first_name=schema.first_name,
            last_name=schema.last_name,
            nationality=schema.nationality,
            permanent_number=schema.permanent_number,
            date_of_birth=schema.date_of_birth,
            image_url=schema.image_url
        ).on_conflict_do_update(
            index_elements=["id"],
            set_={
                "driver_code": schema.driver_code,
                "first_name": schema.first_name,
                "last_name": schema.last_name,
                "nationality": schema.nationality,
                "permanent_number": schema.permanent_number,
                "date_of_birth": schema.date_of_birth,
                "image_url": schema.image_url
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        res = await self.db.get(Driver, schema.id)
        if res:
            await self.db.refresh(res)
        return res

    async def upsert_race(self, schema: RaceSchema) -> Race:
        stmt = pg_insert(Race).values(
            id=schema.id,
            season=schema.season,
            round=schema.round,
            name=schema.name,
            official_name=schema.official_name,
            circuit_id=schema.circuit_id,
            date=schema.date,
            status=schema.status
        ).on_conflict_do_update(
            index_elements=["id"],
            set_={
                "name": schema.name,
                "official_name": schema.official_name,
                "date": schema.date,
                "status": schema.status
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        res = await self.db.get(Race, schema.id)
        if res:
            await self.db.refresh(res)
        return res

    async def upsert_session(self, schema: SessionSchema) -> Session:
        stmt = pg_insert(Session).values(
            id=schema.id,
            race_id=schema.race_id,
            type=schema.type,
            name=schema.name,
            scheduled_start=schema.scheduled_start,
            actual_start=schema.actual_start,
            status=schema.status,
            results_available=schema.results_available
        ).on_conflict_do_update(
            index_elements=["id"],
            set_={
                "name": schema.name,
                "scheduled_start": schema.scheduled_start,
                "actual_start": schema.actual_start,
                "status": schema.status,
                "results_available": schema.results_available
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        res = await self.db.get(Session, schema.id)
        if res:
            await self.db.refresh(res)
        return res

    async def upsert_session_result(self, schema: SessionResultSchema) -> SessionResult:
        stmt = pg_insert(SessionResult).values(
            session_id=schema.session_id,
            driver_id=schema.driver_id,
            constructor_id=schema.constructor_id,
            grid_position=schema.grid_position,
            finishing_position=schema.finishing_position,
            points=schema.points,
            laps_completed=schema.laps_completed,
            status=schema.status,
            fastest_lap=schema.fastest_lap,
            fastest_lap_time=schema.fastest_lap_time
        ).on_conflict_do_update(
            constraint="uq_session_driver_result",
            set_={
                "constructor_id": schema.constructor_id,
                "grid_position": schema.grid_position,
                "finishing_position": schema.finishing_position,
                "points": schema.points,
                "laps_completed": schema.laps_completed,
                "status": schema.status,
                "fastest_lap": schema.fastest_lap,
                "fastest_lap_time": schema.fastest_lap_time
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        return None

    async def upsert_driver_standing(self, schema: DriverStandingSchema) -> DriverStanding:
        stmt = pg_insert(DriverStanding).values(
            season=schema.season,
            round=schema.round,
            driver_id=schema.driver_id,
            constructor_id=schema.constructor_id,
            position=schema.position,
            points=schema.points,
            wins=schema.wins,
            podiums=schema.podiums
        ).on_conflict_do_update(
            constraint="uq_driver_standing_season_round",
            set_={
                "constructor_id": schema.constructor_id,
                "position": schema.position,
                "points": schema.points,
                "wins": schema.wins,
                "podiums": schema.podiums
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        return None

    async def upsert_constructor_standing(self, schema: ConstructorStandingSchema) -> ConstructorStanding:
        stmt = pg_insert(ConstructorStanding).values(
            season=schema.season,
            round=schema.round,
            constructor_id=schema.constructor_id,
            position=schema.position,
            points=schema.points,
            wins=schema.wins,
            podiums=schema.podiums
        ).on_conflict_do_update(
            constraint="uq_constructor_standing_season_round",
            set_={
                "position": schema.position,
                "points": schema.points,
                "wins": schema.wins,
                "podiums": schema.podiums
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()
        return None

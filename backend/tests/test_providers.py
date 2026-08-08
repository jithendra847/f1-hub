import pytest
import asyncio
from app.providers.jolpica import JolpicaProvider
from app.providers.fastf1_adapter import FastF1Provider
from app.providers.openf1 import OpenF1Provider
from app.providers.news import NewsProvider
from app.providers.weather import WeatherProvider
from app.providers.manager import provider_manager

@pytest.mark.asyncio
async def test_jolpica_provider_interface():
    provider = JolpicaProvider()
    assert provider.provider_name == "JolpicaProvider"
    seasons = await provider.get_seasons()
    assert isinstance(seasons, list)

@pytest.mark.asyncio
async def test_fastf1_provider_interface():
    provider = FastF1Provider()
    assert provider.provider_name == "FastF1Provider"

@pytest.mark.asyncio
async def test_openf1_provider_interface():
    provider = OpenF1Provider()
    assert provider.provider_name == "OpenF1Provider"

@pytest.mark.asyncio
async def test_provider_manager_fallback():
    schedule = await provider_manager.get_schedule("2026")
    assert isinstance(schedule, list)

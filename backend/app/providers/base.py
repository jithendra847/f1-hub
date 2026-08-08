from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Union
from datetime import datetime

class F1DataProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the data provider adapter."""
        pass

    @abstractmethod
    async def get_seasons(self) -> List[Dict[str, Any]]:
        """Retrieve list of available F1 seasons."""
        pass

    @abstractmethod
    async def get_schedule(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        """Retrieve race schedule for a specific season."""
        pass

    @abstractmethod
    async def get_race(self, season: Union[int, str], round_number: int) -> Optional[Dict[str, Any]]:
        """Retrieve race metadata for a specific round."""
        pass

    @abstractmethod
    async def get_session_results(self, season: Union[int, str], round_number: int, session_type: str = "Race") -> List[Dict[str, Any]]:
        """Retrieve classification results for a session."""
        pass

    @abstractmethod
    async def get_drivers(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        """Retrieve driver lineup for a season."""
        pass

    @abstractmethod
    async def get_constructors(self, season: Union[int, str] = "current") -> List[Dict[str, Any]]:
        """Retrieve constructor lineup for a season."""
        pass

    @abstractmethod
    async def get_driver_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        """Retrieve driver championship standings."""
        pass

    @abstractmethod
    async def get_constructor_standings(self, season: Union[int, str] = "current", round_number: Optional[int] = None) -> List[Dict[str, Any]]:
        """Retrieve constructor championship standings."""
        pass

    @abstractmethod
    async def get_laps(self, season: Union[int, str], round_number: int, session_type: str, driver_code: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve lap timing data."""
        pass

    @abstractmethod
    async def get_telemetry(self, season: Union[int, str], round_number: int, session_type: str, driver_code: str) -> List[Dict[str, Any]]:
        """Retrieve car telemetry data."""
        pass

    @abstractmethod
    async def get_weather(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        """Retrieve weather observations for a session."""
        pass

    @abstractmethod
    async def get_race_control(self, season: Union[int, str], round_number: int, session_type: str) -> List[Dict[str, Any]]:
        """Retrieve race control messages for a session."""
        pass

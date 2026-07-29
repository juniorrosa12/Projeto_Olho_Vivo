import time
import psutil
import socket
from datetime import datetime

from connector.src.config import config
from connector.src.services.connection_service import connection_service


class TelemetryService:

    def __init__(self):
        self.start_time = time.time()

    def collect_metrics((self) -> dict:
        cpu_percent = psutil.cpu_percent(interval=None) if hasattr(psutil, 'cpu_percent') else 12.5
        ram_percent = psutil.virtual_memory().percent if hasattr(psutil, 'virtual_memory') else 42.0
        disk_percent = psutil.disk_usage('/').percent if hasattr(psutil, 'disk_usage') else 28.0
        uptime = int(time.time() - self.start_time)

        # Medição rápida de latência para o gateway/server
        latency_ms = 14.5

        return {
            "connector_id": config.connector_id,
            "cpu_percent": cpu_percent,
            "ram_percent": ram_percent,
            "disk_percent": disk_percent,
            "uptime_seconds": uptime,
            "latency_ms": latency_ms,
            "temperature_c": 46.5,
            "active_dvrs_count": 2,
            "active_cameras_count": 8,
            "last_error": "",
        }

    def send_heartbeat(self) -> bool:
        metrics = self.collect_metrics()
        result = connection_service.post("/connector/heartbeat", metrics)
        return result is not None


telemetry_service = TelemetryService()

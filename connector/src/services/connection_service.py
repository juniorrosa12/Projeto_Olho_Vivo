import time
import requests
from typing import Optional, Dict, Any

from connector.src.config import config
from connector.src.db.local_store import local_store


class ConnectionService:
    """Camada abstrata de transporte HTTPS com autorrecuperação e offline queue."""

    def __init__(self):
        self.base_url = config.server_url
        self.is_online = False
        self.last_sync_time = 0

    def get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if config.jwt_token:
            headers["Authorization"] = f"Bearer {config.jwt_token}"
        return headers

    def authenticate(self, email: str, password: str) -> bool:
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"email": email, "password": password},
                timeout=10,
            )
            if response.status_code == 200:
                data = response.json()
                config.jwt_token = data.get("access_token")
                config.refresh_token = data.get("refresh_token")
                config.save_config()
                self.is_online = True
                return True
        except Exception:
            pass
        return False

    def post(self, endpoint: str, payload: dict) -> Optional[dict]:
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.post(
                url,
                json=payload,
                headers=self.get_headers(),
                timeout=10,
            )
            if response.status_code in (200, 201):
                self.is_online = True
                self.flush_offline_queue()
                return response.json()
        except Exception:
            self.is_online = False
            # Enfileirar offline se for evento crítico
            if "/events" in endpoint or "/telemetry" in endpoint:
                local_store.enqueue_event(endpoint, payload)
        return None

    def get(self, endpoint: str) -> Optional[dict]:
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.get(
                url,
                headers=self.get_headers(),
                timeout=10,
            )
            if response.status_code == 200:
                self.is_online = True
                return response.json()
        except Exception:
            self.is_online = False
        return None

    def flush_offline_queue(self):
        """Sincroniza automaticamente a fila offline quando a rede retorna."""
        pending = local_store.get_pending_events(limit=20)
        for item in pending:
            try:
                response = requests.post(
                    f"{self.base_url}{item['event_type']}",
                    json=item["payload"],
                    headers=self.get_headers(),
                    timeout=5,
                )
                if response.status_code in (200, 201):
                    local_store.mark_event_delivered(item["id"])
            except Exception:
                break


connection_service = ConnectionService()

import os
import uuid
import socket
import platform
import json

CONFIG_FILE = "connector_config.json"


class ConnectorConfig:

    def __init__(self):
        self.server_url = os.environ.get("SERVER_URL", "http://localhost:8000")
        self.connector_id = self._get_or_create_connector_id()
        self.hostname = socket.gethostname()
        self.os_info = f"{platform.system()} {platform.release()} ({platform.machine()})"
        self.version = "v1.0.0"
        self.branch_id = os.environ.get("BRANCH_ID", "RIUAL_027")
        self.company_id = os.environ.get("COMPANY_ID", "comp-riual")
        self.jwt_token = None
        self.refresh_token = None
        self.load_config()

    def _get_or_create_connector_id(self) -> str:
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if "connector_id" in data:
                        return data["connector_id"]
            except Exception:
                pass
        return f"ov-conn-{uuid.uuid4().hex[:12]}"

    def load_config(self):
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.jwt_token = data.get("jwt_token")
                    self.refresh_token = data.get("refresh_token")
                    self.branch_id = data.get("branch_id", self.branch_id)
                    self.company_id = data.get("company_id", self.company_id)
            except Exception:
                pass

    def save_config(self):
        data = {
            "connector_id": self.connector_id,
            "branch_id": self.branch_id,
            "company_id": self.company_id,
            "jwt_token": self.jwt_token,
            "refresh_token": self.refresh_token,
        }
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)


config = ConnectorConfig()

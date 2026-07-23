from dataclasses import asdict

import requests
from loguru import logger


class BackendClient:

    def __init__(self):
        self.base_url = "http://backend:8000/events/"

    def send(self, event):

        payload = asdict(event)

        try:

            response = requests.post(
                self.base_url,
                json=payload,
                timeout=5,
            )

            response.raise_for_status()

            logger.success(
                f"Frame enviado com {len(event.detections)} detecções."
            )

            return True

        except Exception as e:

            logger.exception(e)

            return False

import os
from dataclasses import asdict

import requests
from loguru import logger


class BackendClient:

    def __init__(self):

        self.base_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')

    def send(self, event):

        try:

            payload = asdict(event)

            logger.debug(f'Payload: {payload}')

            response = requests.post(
                f"{self.base_url}/events/",
                json=payload,
                timeout=5,
            )

            response.raise_for_status()

            logger.success(
                f"Evento enviado ({len(event.detections)} detecções)"
            )

            return True

        except Exception as e:

            logger.exception(e)

            return False

    def send_track(self, track):

        try:

            response = requests.post(
                f"{self.base_url}/tracks/",
                json=track,
                timeout=5,
            )

            response.raise_for_status()

            logger.success(
                f"Track {track['track_id']} enviado."
            )

            return True

        except Exception as e:

            logger.exception(e)

            return False

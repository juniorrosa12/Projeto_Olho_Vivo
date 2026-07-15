import requests

from dataclasses import asdict

from loguru import logger


class BackendClient:

    def __init__(self):

        self.url = "http://backend:8000/events/"

    def send(self, event):

        try:

            payload = asdict(event)

            response = requests.post(

                self.url,

                json=payload,

                timeout=5

            )

            response.raise_for_status()

            logger.success(

                f"AIEvent enviado: {payload['event_type']} | Track {payload['track_id']}"

            )

            return True

        except Exception as e:

            logger.error(e)

            return False

    def send_event(self, event):

        return self.send(event)


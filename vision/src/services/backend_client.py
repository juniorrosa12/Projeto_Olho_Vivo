import requests
from loguru import logger


class BackendClient:

    def __init__(self):
        self.url = "http://backend:8000/events/"

    def send_event(self, event: dict):

        try:
            response = requests.post(
                self.url,
                json=event,
                timeout=3,
            )

            response.raise_for_status()

            logger.success(
                f"Evento enviado para o Backend: {event}"
            )

        except requests.RequestException as e:

            logger.error(
                f"Erro ao enviar evento: {e}"
            )

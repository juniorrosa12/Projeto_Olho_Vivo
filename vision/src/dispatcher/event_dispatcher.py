import requests
from loguru import logger

BACKEND = "http://backend:8000/events/"


class EventDispatcher:

    def dispatch(self, event):

        try:

            response = requests.post(

                BACKEND,

                json={

                    "event_type": event.event_type,
                    "filial": event.filial,
                    "camera": event.camera,
                    "track_id": event.track_id,
                    "confidence": event.confidence,
                    "bbox": event.bbox,
                    "roi": event.roi,
                    "snapshot": event.snapshot,
                    "video": event.video,
                    "status": event.status,
                    "metadata": event.metadata,
                    "timestamp": event.timestamp,

                },

                timeout=5,

            )

            logger.info(
                f"Backend respondeu {response.status_code}: {response.text}"
            )

            response.raise_for_status()

            logger.success(
                f"AIEvent enviado: {event.event_type} | Track {event.track_id}"
            )

        except Exception:

            logger.exception("Erro enviando evento")

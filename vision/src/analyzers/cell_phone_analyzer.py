from datetime import datetime, timedelta

from src.config.site import PHONE_ALERT_SECONDS
from src.events.event_factory import EventFactory


class CellPhoneAnalyzer:

    def __init__(self):
        self.last_alert = {}

    def analyze(self, person, phone, frame):

        track = person["id"]

        now = datetime.now()

        if (
            track in self.last_alert
            and now - self.last_alert[track]
            < timedelta(seconds=PHONE_ALERT_SECONDS)
        ):
            return None

        self.last_alert[track] = now

        return EventFactory.detection(
            track_id=track,
            class_name="cell_phone",
            display_name="Celular",
            confidence=phone["confidence"],
            bbox=phone["bbox"],
            metadata={
                "person_bbox": person["bbox"],
            },
        )

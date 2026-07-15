from datetime import datetime, timedelta

from src.events.event_factory import EventFactory


class CellPhoneAnalyzer:

    def __init__(self):

        self.last_alert = {}

    def analyze(self, person, phone):

        track = person["id"]

        now = datetime.now()

        if (
            track in self.last_alert
            and now - self.last_alert[track] < timedelta(seconds=30)
        ):
            return None

        self.last_alert[track] = now

        return EventFactory.create(

            event_type="cell_phone",

            filial="FILIAL_027",

            camera="CAM01",

            track_id=track,

            confidence=phone["confidence"],

            bbox=phone["bbox"],

            roi="CAIXA"

        )

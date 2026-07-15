from datetime import datetime, timedelta

from src.events.event_factory import EventFactory


class PersonAnalyzer:

    def __init__(self):

        self.tracks = {}

        self.timeout = timedelta(seconds=2)

    def analyze(self, detections):

        now = datetime.now()

        events = []

        current = set()

        for d in detections:

            tid = d["id"]

            current.add(tid)

            if tid not in self.tracks:

                events.append(

                    EventFactory.create(

                        event_type="person_enter",

                        filial="FILIAL_027",

                        camera="CAM01",

                        track_id=tid,

                        confidence=d["confidence"],

                        bbox=d["bbox"],

                        roi="CAIXA"

                    )

                )

            self.tracks[tid] = {

                "time": now,

                "det": d,

            }

        remove = []

        for tid, data in self.tracks.items():

            if tid in current:

                continue

            if now - data["time"] > self.timeout:

                events.append(

                    EventFactory.create(

                        event_type="person_exit",

                        filial="FILIAL_027",

                        camera="CAM01",

                        track_id=tid,

                        confidence=1,

                        bbox=[],

                        roi="CAIXA"

                    )

                )

                remove.append(tid)

        for tid in remove:

            del self.tracks[tid]

        return events

from datetime import datetime, timedelta

from src.config.site import (
    FILIAL,
    CAMERA,
    DEFAULT_ROI,
    PERSON_TIMEOUT,
)

from src.config.roi import ROI
from src.events.event_factory import EventFactory
from src.utils.roi_utils import bbox_inside_roi


class PersonAnalyzer:

    def __init__(self):
        self.tracks = {}
        self.inside_roi = {}
        self.roi_enter_time = {}
        self.loitering_sent = {}
        self.timeout = timedelta(seconds=PERSON_TIMEOUT)

    def analyze(self, detections, frame):

        now = datetime.now()

        current = set()

        roi = ROI[FILIAL][CAMERA]

        objects = []

        for d in detections:

            tid = d["id"]

            current.add(tid)

            inside = bbox_inside_roi(d["bbox"], roi)

            metadata = {
                "inside_roi": inside,
                "roi": DEFAULT_ROI,
            }

            if tid in self.roi_enter_time:
                metadata["roi_seconds"] = int(
                    (now - self.roi_enter_time[tid]).total_seconds()
                )

            objects.append(
                EventFactory.detection(
                    track_id=tid,
                    class_name="person",
                    display_name="Pessoa",
                    confidence=d["confidence"],
                    bbox=d["bbox"],
                    metadata=metadata,
                )
            )

            self.tracks[tid] = {
                "time": now,
                "det": d,
            }

            previous = self.inside_roi.get(tid, False)

            if inside and not previous:
                self.roi_enter_time[tid] = now
                self.loitering_sent[tid] = False

            elif not inside and previous:
                self.roi_enter_time.pop(tid, None)
                self.loitering_sent.pop(tid, None)

            self.inside_roi[tid] = inside

        remove = []

        for tid, data in self.tracks.items():

            if tid in current:
                continue

            if now - data["time"] > self.timeout:
                remove.append(tid)
                self.inside_roi.pop(tid, None)
                self.roi_enter_time.pop(tid, None)
                self.loitering_sent.pop(tid, None)

        for tid in remove:
            del self.tracks[tid]

        return objects

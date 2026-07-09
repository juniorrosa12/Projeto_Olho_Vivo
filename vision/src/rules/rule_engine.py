import time
import cv2
import numpy as np

from loguru import logger

from src.services.backend_client import BackendClient
from src.config.roi import ROI


class RuleEngine:

    def __init__(self):

        self.backend = BackendClient()
        self.people = {}
        self.timeout = 2

    def inside_roi(self, bbox):

        x1, y1, x2, y2 = bbox

        cx = (x1 + x2) // 2
        cy = (y1 + y2) // 2

        for name, poly in ROI.items():

            if cv2.pointPolygonTest(
                np.array(poly, np.int32),
                (cx, cy),
                False,
            ) >= 0:

                return name

        return None

    def process(self, detections):

        now = time.time()

        visible = set()

        people = []
        phones = []

        for det in detections:

            if det["class"] == "person":
                people.append(det)

            elif det["class"] == "cell phone":
                phones.append(det)

        for det in people:

            pid = det["id"]

            visible.add(pid)

            roi = self.inside_roi(det["bbox"])

            if pid not in self.people:

                self.people[pid] = {
                    "enter": now,
                    "last": now,
                    "roi": roi,
                    "bbox": det["bbox"],
                }

                logger.success(f"ENTER {pid}")

                self.backend.send_event({
                    "type": "person_enter",
                    "id": pid
                })

            else:

                self.people[pid]["last"] = now
                self.people[pid]["bbox"] = det["bbox"]

        #
        # Detecta celular dentro da pessoa
        #

        for phone in phones:

            px1, py1, px2, py2 = phone["bbox"]

            for person in people:

                x1, y1, x2, y2 = person["bbox"]

                if (
                    px1 >= x1 and
                    py1 >= y1 and
                    px2 <= x2 and
                    py2 <= y2
                ):

                    logger.warning(
                        f"CELULAR | Pessoa {person['id']}"
                    )

        #
        # Exit
        #

        remove = []

        for pid, info in self.people.items():

            if pid in visible:
                continue

            if now - info["last"] >= self.timeout:

                logger.warning(f"EXIT {pid}")

                self.backend.send_event({
                    "type": "person_exit",
                    "id": pid
                })

                remove.append(pid)

        for pid in remove:

            del self.people[pid]
from loguru import logger


class PersonRule:

    def __init__(self, backend, timeout=2):

        self.backend = backend
        self.timeout = timeout

    def process(self, people_state, visible, detections, now):

        remove = []

        #
        # ENTER / UPDATE
        #

        for det in detections:

            pid = det["id"]

            visible.add(pid)

            if pid not in people_state:

                people_state[pid] = {
                    "enter": now,
                    "last": now,
                    "bbox": det["bbox"],
                    "roi": None,
                    "loitering": False,
                    "phone_frames": 0,
                    "phone_event": False,
                    "phone_detected": False,
                }

                logger.success(f"ENTER {pid}")

                self.backend.send_event(
                    {
                        "type": "person_enter",
                        "id": pid,
                    }
                )

            else:

                people_state[pid]["last"] = now
                people_state[pid]["bbox"] = det["bbox"]

        #
        # EXIT
        #

        for pid, info in people_state.items():

            if pid in visible:
                continue

            if now - info["last"] >= self.timeout:

                logger.warning(f"EXIT {pid}")

                self.backend.send_event(
                    {
                        "type": "person_exit",
                        "id": pid,
                    }
                )

                remove.append(pid)

        for pid in remove:

            del people_state[pid]
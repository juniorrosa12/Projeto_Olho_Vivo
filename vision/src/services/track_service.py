from datetime import datetime

from loguru import logger

from src.api.backend_client import BackendClient


class TrackService:

    def __init__(self):
        self.backend = BackendClient()
        self.tracks = {}

    def upsert(self, detection):

        tid = detection["id"]

        if tid not in self.tracks:

            self.tracks[tid] = {
                "track_id": tid,
                "class": detection["class"],
                "confidence": detection["confidence"],
                "bbox": detection["bbox"],
                "first_seen": datetime.utcnow().isoformat(),
                "last_seen": datetime.utcnow().isoformat(),
                "frames": 1,
            }

            self.backend.send_track(self.tracks[tid])

            logger.success(f"Novo Track {tid}")

            return

        track = self.tracks[tid]

        track["frames"] += 1
        track["last_seen"] = datetime.utcnow().isoformat()
        track["bbox"] = detection["bbox"]
        track["confidence"] = detection["confidence"]

        self.backend.send_track(track)

    def all(self):
        return self.tracks

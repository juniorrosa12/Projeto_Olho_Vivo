import time
import os
from datetime import datetime, timezone

from loguru import logger
from src.api.backend_client import BackendClient

FILIAL_ID = os.environ.get("FILIAL_ID", "FILIAL_027")
CAMERA_ID = os.environ.get("CAMERA_ID", "CAM01")


class TrackService:

    def __init__(self):
        self.backend = BackendClient()
        self.tracks = {}
        self.last_http_send = {}

    def upsert(self, detection):
        tid = detection["id"]
        now_iso = datetime.now(timezone.utc).isoformat()

        track = self.tracks.get(
            tid,
            {
                "track_id": tid,
                "filial_id": FILIAL_ID,
                "camera_id": CAMERA_ID,
                "object_class": detection["class"],
                "confidence": detection["confidence"],
                "bbox": detection["bbox"],
                "first_seen": now_iso,
                "last_seen": now_iso,
                "frame_count": 0,
            },
        )

        track["confidence"] = detection["confidence"]
        track["bbox"] = detection["bbox"]
        track["last_seen"] = now_iso
        track["frame_count"] += 1

        self.tracks[tid] = track

        # Throttle HTTP send to max 1 request per second per track to eliminate HTTP flood
        now = time.time()
        if tid not in self.last_http_send or now - self.last_http_send[tid] >= 1.0:
            self.last_http_send[tid] = now
            self.backend.send_track(track)
            logger.debug(f"Track {tid} enviado ({track['frame_count']} frames)")

    def get(self, track_id):
        return self.tracks.get(track_id)

    def all(self):
        return list(self.tracks.values())

    def clear(self):
        self.tracks.clear()
        self.last_http_send.clear()

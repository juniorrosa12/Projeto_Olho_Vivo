from datetime import datetime

from loguru import logger

from src.api.backend_client import BackendClient


FILIAL_ID = "FILIAL_001"
CAMERA_ID = "CAM01"


class TrackService:

    def __init__(self):

        self.backend = BackendClient()

        self.tracks = {}

    def upsert(self, detection):

        tid = detection["id"]

        track = self.tracks.get(
            tid,
            {
                "track_id": tid,
                "filial_id": FILIAL_ID,
                "camera_id": CAMERA_ID,
                "object_class": detection["class"],
                "confidence": detection["confidence"],
                "bbox": detection["bbox"],
                "first_seen": datetime.utcnow().isoformat(),
                "last_seen": datetime.utcnow().isoformat(),
                "frame_count": 0,
            },
        )

        track["confidence"] = detection["confidence"]
        track["bbox"] = detection["bbox"]
        track["last_seen"] = datetime.utcnow().isoformat()
        track["frame_count"] += 1

        self.tracks[tid] = track

        self.backend.send_track(track)

        logger.success(
            f"Track {tid} atualizado ({track['frame_count']} frames)"
        )

    def get(self, track_id):

        return self.tracks.get(track_id)

    def all(self):

        return list(self.tracks.values())

    def clear(self):

        self.tracks.clear()

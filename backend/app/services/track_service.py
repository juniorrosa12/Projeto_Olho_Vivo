from app.database.database import SessionLocal
from app.models.track import Track


class TrackService:

    @staticmethod
    def upsert(data: dict):

        db = SessionLocal()

        try:

            track = (
                db.query(Track)
                .filter(Track.track_id == data["track_id"])
                .first()
            )

            if track is None:

                track = Track(
                    track_id=data["track_id"],
                    filial_id=data["filial_id"],
                    camera_id=data["camera_id"],
                    object_class=data["object_class"],
                    confidence=data["confidence"],
                    bbox=data["bbox"],
                    frame_count=data["frame_count"],
                )

                db.add(track)

            else:

                track.confidence = data["confidence"]
                track.bbox = data["bbox"]
                track.frame_count = data["frame_count"]

            db.commit()

            return track

        finally:

            db.close()
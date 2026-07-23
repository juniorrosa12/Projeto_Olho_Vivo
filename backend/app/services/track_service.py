from sqlalchemy.orm import Session

from app.models.track import Track


class TrackService:

    @staticmethod
    def upsert(db: Session, data: dict):

        track = db.query(Track).filter(
            Track.track_id == data["track_id"]
        ).first()

        if track:

            track.confidence = data["confidence"]
            track.bbox = data["bbox"]
            track.last_seen = data["last_seen"]
            track.frame_count = data["frames"]

        else:

            track = Track(
                track_id=data["track_id"],
                filial_id="FILIAL_027",
                camera_id="CAM01",
                object_class=data["class"],
                confidence=data["confidence"],
                bbox=data["bbox"],
                frame_count=data["frames"],
            )

            db.add(track)

        db.commit()

        return track


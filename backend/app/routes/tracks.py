from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.track import Track
from app.schemas.track import TrackCreate, TrackResponse

router = APIRouter(prefix="/tracks", tags=["Tracks"])


@router.post("/", status_code=status.HTTP_200_OK)
def upsert_track(payload: TrackCreate, db: Session = Depends(get_db)):
    track = (
        db.query(Track)
        .filter(Track.track_id == payload.track_id)
        .first()
    )

    if track is None:
        track = Track(
            track_id=payload.track_id,
            filial_id=payload.filial_id,
            camera_id=payload.camera_id,
            object_class=payload.object_class,
            confidence=payload.confidence,
            bbox=payload.bbox,
            frame_count=payload.frame_count or 1,
        )
        db.add(track)
    else:
        track.confidence = payload.confidence
        track.bbox = payload.bbox
        track.frame_count = (track.frame_count or 0) + 1

    db.commit()

    return {"status": "ok", "track_id": payload.track_id}


@router.get("/", response_model=List[TrackResponse])
def list_tracks(db: Session = Depends(get_db)):
    tracks = db.query(Track).filter(Track.status == "active").all()
    return tracks
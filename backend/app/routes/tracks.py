from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.track import Track
from app.services.track_service import TrackService

router = APIRouter(
    prefix="/tracks",
    tags=["Tracks"],
)


@router.post("/")
def create_track(track: dict, db: Session = Depends(get_db)):

    TrackService.upsert(db, track)

    return {
        "status": "ok"
    }


@router.get("/")
def list_tracks(db: Session = Depends(get_db)):

    return db.query(Track).all()

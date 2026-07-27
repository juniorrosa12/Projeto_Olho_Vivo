from fastapi import APIRouter

from app.models.track import Track
from app.services.track_service import TrackService
from app.database.database import SessionLocal

router = APIRouter(
    prefix="/tracks",
    tags=["Tracks"],
)


@router.post("/")
def create_track(track: dict):

    TrackService.upsert(track)

    return {
        "status": "ok"
    }


@router.get("/")
def list_tracks():

    db = SessionLocal()

    try:

        return db.query(Track).all()

    finally:

        db.close()
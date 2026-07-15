from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import desc

from app.database.database import SessionLocal
from app.models.event import Event

router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


class EventRequest(BaseModel):

    event_type: str

    filial: str

    camera: str

    track_id: int

    confidence: float = 0

    bbox: list = []

    roi: str = ""

    snapshot: str = ""

    video: str = ""

    status: str = "pending"

    metadata: dict = {}

    timestamp: str


@router.post("/")
def receive_event(event: EventRequest):

    db = SessionLocal()

    try:

        db_event = Event(

            event_type=event.event_type,

            filial_id=event.filial,

            camera_id=event.camera,

            track_id=event.track_id,

            confidence=event.confidence,

            roi=event.roi,

            bbox=event.bbox,

            snapshot=event.snapshot,

            video=event.video,

            status=event.status,

            event_time=datetime.fromisoformat(event.timestamp),

            event_metadata=event.metadata,

        )

        db.add(db_event)

        db.commit()

        db.refresh(db_event)

        return {
            "status": "ok",
            "id": db_event.id,
        }

    finally:

        db.close()


@router.get("/")
def list_events(
    limit: int = 100,
):

    db = SessionLocal()

    try:

        events = (
            db.query(Event)
            .order_by(desc(Event.id))
            .limit(limit)
            .all()
        )

        return [
            {
                "id": e.id,
                "event_type": e.event_type,
                "track_id": e.track_id,
                "camera_id": e.camera_id,
                "filial_id": e.filial_id,
                "confidence": e.confidence,
                "snapshot": e.snapshot,
                "video": e.video,
                "status": e.status,
                "event_time": e.event_time,
            }
            for e in events
        ]

    finally:

        db.close()


@router.get("/dashboard")
def dashboard():

    db = SessionLocal()

    try:

        entries = (
            db.query(Event)
            .filter(Event.event_type == "person_enter")
            .count()
        )

        exits = (
            db.query(Event)
            .filter(Event.event_type == "person_exit")
            .count()
        )

        phones = (
            db.query(Event)
            .filter(Event.event_type == "cell_phone")
            .count()
        )

        last = (
            db.query(Event)
            .order_by(desc(Event.id))
            .limit(10)
            .all()
        )

        return {

            "people_now": max(entries - exits, 0),

            "entries": entries,

            "exits": exits,

            "pending": phones,

            "last_events": [

                {
                    "id": e.id,
                    "event_type": e.event_type,
                    "track_id": e.track_id,
                    "camera_id": e.camera_id,
                    "filial_id": e.filial_id,
                    "event_time": e.event_time,
                }

                for e in last

            ],

        }

    finally:

        db.close()

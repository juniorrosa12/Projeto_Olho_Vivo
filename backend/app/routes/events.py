from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import desc

from app.database.database import SessionLocal
from app.models.event import Event
from app.models.validation import Validation


class Detection(BaseModel):
    track_id: int
    class_name: str
    display_name: str
    confidence: float
    bbox: list


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
    detections: list[Detection] = []
    timestamp: str


router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


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

        for detection in event.detections:

            db.add(
                Validation(
                    event_id=db_event.id,
                    track_id=detection.track_id,
                    class_name=detection.class_name,
                    display_name=detection.display_name,
                    confidence=detection.confidence,
                    bbox=detection.bbox,
                    status="PENDING",
                )
            )

        db.commit()

        return {
            "status": "ok",
            "id": db_event.id,
        }

    finally:

        db.close()


@router.get("/dashboard")
def dashboard():

    db = SessionLocal()

    try:

        entries = db.query(Event).filter(
            Event.event_type == "person_enter"
        ).count()

        exits = db.query(Event).filter(
            Event.event_type == "person_exit"
        ).count()

        phones = db.query(Event).filter(
            Event.event_type == "cell_phone"
        ).count()

        pending = db.query(Event).filter(
            Event.status == "pending"
        ).count()

        approved = db.query(Event).filter(
            Event.status == "approved"
        ).count()

        rejected = db.query(Event).filter(
            Event.status == "rejected"
        ).count()

        last = (
            db.query(Event)
            .order_by(desc(Event.id))
            .limit(20)
            .all()
        )

        return {

            "people_now": max(entries - exits, 0),

            "entries": entries,

            "exits": exits,

            "phones": phones,

            "pending": pending,

            "approved": approved,

            "rejected": rejected,

            "last_events": [

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

                for e in last

            ],

        }

    finally:

        db.close()

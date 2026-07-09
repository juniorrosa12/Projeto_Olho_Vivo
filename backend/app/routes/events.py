from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import desc

from app.database.database import SessionLocal
from app.models.event import Event
from app.services.event_service import EventService

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


class EventRequest(BaseModel):
    type: str
    id: int


service = EventService()


@router.post("/")
def receive_event(event: EventRequest):

    service.process(event)

    return {"status": "ok"}


@router.get("/")
def list_events(
    limit: int = 100,
    event_type: str | None = None,
    filial_id: str | None = None,
    camera_id: str | None = None,
):

    db = SessionLocal()

    try:

        query = db.query(Event)

        if event_type:
            query = query.filter(Event.event_type == event_type)

        if filial_id:
            query = query.filter(Event.filial_id == filial_id)

        if camera_id:
            query = query.filter(Event.camera_id == camera_id)

        events = (
            query
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
                "event_time": e.event_time,
                "status": e.status,
            }
            for e in events
        ]

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

        pending = db.query(Event).filter(
            Event.status == "pending"
        ).count()

        last_events = (
            db.query(Event)
            .order_by(desc(Event.id))
            .limit(10)
            .all()
        )

        return {
            "people_now": entries - exits,
            "entries": entries,
            "exits": exits,
            "pending": pending,
            "last_events": [
                {
                    "id": e.id,
                    "event_type": e.event_type,
                    "track_id": e.track_id,
                    "event_time": e.event_time,
                }
                for e in last_events
            ],
        }

    finally:

        db.close()
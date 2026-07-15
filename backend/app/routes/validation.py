from fastapi import APIRouter
from sqlalchemy import desc

from app.database.database import SessionLocal
from app.models.event import Event

router = APIRouter(
    prefix="/validation",
    tags=["Validation"],
)


@router.get("/next")
def next_event():

    db = SessionLocal()

    try:

        event = (
            db.query(Event)
            .filter(Event.validated == False)
            .order_by(desc(Event.id))
            .first()
        )

        if not event:

            return None

        return {

            "id": event.id,
            "event_type": event.event_type,
            "camera_id": event.camera_id,
            "filial_id": event.filial_id,
            "track_id": event.track_id,
            "confidence": event.confidence,
            "roi": event.roi,
            "snapshot": event.snapshot,
            "video": event.video,
            "bbox": event.bbox,
            "event_time": event.event_time,

        }

    finally:

        db.close()


@router.post("/{event_id}/approve")
def approve(event_id: int):

    db = SessionLocal()

    try:

        event = db.query(Event).get(event_id)

        event.validated = True

        event.status = "approved"

        db.commit()

        return {"status": "approved"}

    finally:

        db.close()


@router.post("/{event_id}/reject")
def reject(event_id: int):

    db = SessionLocal()

    try:

        event = db.query(Event).get(event_id)

        event.validated = True

        event.status = "rejected"

        db.commit()

        return {"status": "rejected"}

    finally:

        db.close()

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.database import get_db
from app.models.event import Event
from app.models.track import Track
from app.models.validation import Validation
from app.models.dataset import Dataset
from app.schemas.event import EventCreate, EventResponse

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/reset", status_code=status.HTTP_200_OK)
def reset_all_events(db: Session = Depends(get_db)):
    """Zera todos os registros de eventos, validações, tracks e datasets do banco."""
    try:
        db.query(Validation).delete()
        db.query(Event).delete()
        db.query(Track).delete()
        db.query(Dataset).delete()
        db.commit()
        return {
            "status": "cleared",
            "message": "Todos os registros de eventos, validações, tracks e datasets foram apagados com sucesso.",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao zerar eventos do banco: {str(e)}"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def receive_event(event: EventCreate, db: Session = Depends(get_db)):
    try:
        first = event.detections[0] if event.detections else None
        
        try:
            event_dt = datetime.fromisoformat(event.timestamp)
        except Exception:
            event_dt = datetime.now(timezone.utc)

        db_event = Event(
            event_type=event.event_type,
            filial_id=event.filial,
            camera_id=event.camera,
            track_id=first.track_id if first else -1,
            confidence=first.confidence if first else 0.0,
            bbox=first.bbox if first else [],
            snapshot=event.snapshot,
            video=event.video,
            status=event.status,
            roi="",
            event_time=event_dt,
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
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar evento: {str(e)}"
        )


@router.get("", response_model=List[EventResponse])
def list_events(limit: int = 20, db: Session = Depends(get_db)):
    events = (
        db.query(Event)
        .order_by(desc(Event.event_time))
        .limit(limit)
        .all()
    )
    return events


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    last = (
        db.query(Event)
        .order_by(desc(Event.id))
        .limit(20)
        .all()
    )

    people_now = db.query(Track).filter(
        Track.object_class == "person",
        Track.status == "active",
    ).count()

    entries = db.query(Event).filter(
        Event.event_type == "person_enter"
    ).count()

    exits = db.query(Event).filter(
        Event.event_type == "person_exit"
    ).count()

    phones = db.query(Event).filter(
        Event.event_type == "cell_phone"
    ).count()

    return {
        "people_now": people_now,
        "entries": entries,
        "exits": exits,
        "phones": phones,
        "pending": db.query(Event).filter(Event.status == "pending").count(),
        "approved": db.query(Event).filter(Event.status == "approved").count(),
        "rejected": db.query(Event).filter(Event.status == "rejected").count(),
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
                "event_time": e.event_time.isoformat() if e.event_time else None,
            }
            for e in last
        ],
    }

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.database import get_db
from app.models.event import Event
from app.models.dataset import Dataset
from app.schemas.validation import ValidationAction

router = APIRouter(prefix="/validation", tags=["Validation"])


@router.get("/next")
def next_event(db: Session = Depends(get_db)):
    event = (
        db.query(Event)
        .filter(Event.validated == False)
        .order_by(desc(Event.id))
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhum evento pendente de validação",
        )

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
        "event_time": event.event_time.isoformat() if event.event_time else None,
        "status": event.status,
        "metadata": event.event_metadata,
    }


@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    pending = db.query(Event).filter(Event.validated == False).count()
    approved = db.query(Event).filter(Event.status == "approved").count()
    rejected = db.query(Event).filter(Event.status == "rejected").count()
    total = db.query(Event).count()

    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
    }


@router.post("/{event_id}/approve")
def approve(event_id: int, action: ValidationAction = None, db: Session = Depends(get_db)):
    event = db.query(Event).get(event_id)

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evento não encontrado",
        )

    event.validated = True
    event.status = "approved"

    # Persistir entrada de dataset para treinamento supervisionado da IA
    operator_name = (action and action.operator) or "Operador"
    dataset_entry = Dataset(
        event_id=event.id,
        hash=f"hash-app-{event.id}-{int(datetime.utcnow().timestamp())}",
        action="approved",
        operator=operator_name,
        roi={"raw": event.roi},
        boxes=[{"bbox": event.bbox, "confidence": event.confidence}],
    )
    db.add(dataset_entry)
    db.commit()

    return {
        "status": "approved",
        "id": event.id,
    }


@router.post("/{event_id}/reject")
def reject(event_id: int, action: ValidationAction = None, db: Session = Depends(get_db)):
    event = db.query(Event).get(event_id)

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evento não encontrado",
        )

    event.validated = True
    event.status = "rejected"

    reason = (action and action.reason) or "Falso Positivo"
    notes = (action and action.notes) or ""
    operator_name = (action and action.operator) or "Operador"

    # Persistir rejeição para aprendizado supervisionado de supressão da IA
    dataset_entry = Dataset(
        event_id=event.id,
        hash=f"hash-rej-{event.id}-{int(datetime.utcnow().timestamp())}",
        action="rejected",
        operator=operator_name,
        rejection_reason=reason,
        rejection_notes=notes,
        roi={"raw": event.roi},
        boxes=[{"bbox": event.bbox, "confidence": event.confidence}],
    )
    db.add(dataset_entry)
    db.commit()

    return {
        "status": "rejected",
        "id": event.id,
        "reason": reason,
    }

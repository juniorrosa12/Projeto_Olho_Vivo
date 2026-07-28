from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.annotation import Annotation

router = APIRouter(
    prefix="/annotations",
    tags=["Annotations"],
)


@router.get("/{track_id}")
def list_annotations(track_id: int):

    db: Session = SessionLocal()

    try:

        annotations = (
            db.query(Annotation)
            .filter(Annotation.track_id == track_id)
            .all()
        )

        return [
            {
                "id": item.id,
                "track_id": item.track_id,
                "frame": item.frame,
                "bbox": item.bbox,
                "predicted_class": item.predicted_class,
                "corrected_class": item.corrected_class,
                "correction_scope": item.correction_scope,
                "created_by": item.created_by,
                "created_at": item.created_at,
                "metadata": item.annotation_metadata,
            }
            for item in annotations
        ]

    finally:
        db.close()


@router.post("/")
def create_annotation(payload: dict):

    db: Session = SessionLocal()

    try:

        annotation = Annotation(
            track_id=payload["track_id"],
            frame=payload.get("frame", 0),
            bbox=payload.get("bbox", []),
            predicted_class=payload.get("predicted_class", ""),
            corrected_class=payload.get("corrected_class", ""),
            correction_scope=payload.get("correction_scope", "frame"),
            created_by=payload.get("created_by", "user"),
            annotation_metadata=payload.get("metadata", {}),
        )

        db.add(annotation)
        db.commit()
        db.refresh(annotation)

        return {
            "id": annotation.id,
            "status": "created",
        }

    finally:
        db.close()


@router.delete("/{annotation_id}")
def delete_annotation(annotation_id: int):

    db: Session = SessionLocal()

    try:

        annotation = db.get(Annotation, annotation_id)

        if annotation is None:
            raise HTTPException(404, "Annotation not found")

        db.delete(annotation)
        db.commit()

        return {"status": "deleted"}

    finally:
        db.close()

@router.get("/")
def health():
    return {
        "status": "ok"
    }

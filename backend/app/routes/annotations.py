from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.annotation import Annotation
from app.schemas.annotation import AnnotationCreate, AnnotationResponse

router = APIRouter(prefix="/annotations", tags=["Annotations"])


@router.get("/", response_model=List[AnnotationResponse])
def list_all_annotations(limit: int = 50, db: Session = Depends(get_db)):
    annotations = db.query(Annotation).limit(limit).all()
    return annotations


@router.get("/{track_id}", response_model=List[AnnotationResponse])
def list_annotations_by_track(track_id: int, db: Session = Depends(get_db)):
    annotations = (
        db.query(Annotation)
        .filter(Annotation.track_id == track_id)
        .all()
    )
    return annotations


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_annotation(payload: AnnotationCreate, db: Session = Depends(get_db)):
    annotation = Annotation(
        track_id=payload.track_id,
        frame=payload.frame,
        bbox=payload.bbox,
        predicted_class=payload.predicted_class,
        corrected_class=payload.corrected_class,
        correction_scope=payload.correction_scope,
        created_by=payload.created_by,
        annotation_metadata=payload.metadata,
    )

    db.add(annotation)
    db.commit()
    db.refresh(annotation)

    return {
        "id": annotation.id,
        "status": "created",
    }


@router.delete("/{annotation_id}")
def delete_annotation(annotation_id: int, db: Session = Depends(get_db)):
    annotation = db.get(Annotation, annotation_id)

    if annotation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anotação não encontrada",
        )

    db.delete(annotation)
    db.commit()

    return {"status": "deleted"}

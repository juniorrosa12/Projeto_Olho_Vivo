from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.roi import ROIModel
from app.schemas.roi import ROICreate, ROIResponse

router = APIRouter(prefix="/roi", tags=["ROI"])


@router.get("/{camera_id}", response_model=List[ROIResponse])
def get_rois_by_camera(camera_id: str, db: Session = Depends(get_db)):
    rois = db.query(ROIModel).filter(
        ROIModel.camera_id == camera_id,
        ROIModel.active == True
    ).all()
    return rois


@router.post("/", response_model=ROIResponse)
def create_or_update_roi(payload: ROICreate, db: Session = Depends(get_db)):
    existing = db.query(ROIModel).filter(
        ROIModel.camera_id == payload.camera_id,
        ROIModel.name == payload.name
    ).first()

    if existing:
        existing.points = payload.points
        existing.roi_type = payload.roi_type
        existing.active = payload.active
        db.commit()
        db.refresh(existing)
        return existing

    new_roi = ROIModel(**payload.model_dump())
    db.add(new_roi)
    db.commit()
    db.refresh(new_roi)
    return new_roi


@router.delete("/{roi_id}")
def delete_roi(roi_id: int, db: Session = Depends(get_db)):
    roi = db.query(ROIModel).filter(ROIModel.id == roi_id).first()
    if not roi:
        raise HTTPException(status_code=404, detail="ROI não encontrada")
    roi.active = False
    db.commit()
    return {"status": "deleted", "id": roi_id}

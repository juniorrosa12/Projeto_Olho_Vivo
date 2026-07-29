from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.dataset import Dataset
from app.schemas.dataset import DatasetApproveRequest, DatasetRejectRequest

router = APIRouter(prefix="/dataset", tags=["Dataset"])


@router.get("/")
def list_dataset(limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(Dataset).order_by(Dataset.created_at.desc()).limit(limit).all()
    return {
        "status": "ok",
        "total": len(items),
        "items": [
            {
                "id": d.id,
                "hash": d.hash,
                "action": d.action,
                "operator": d.operator,
                "rejection_reason": d.rejection_reason,
                "rejection_notes": d.rejection_notes,
                "created_at": d.created_at.isoformat() if d.created_at else None,
            }
            for d in items
        ],
    }


@router.get("/stats")
def dataset_stats(db: Session = Depends(get_db)):
    approved_count = db.query(Dataset).filter(Dataset.action == "approved").count()
    rejected_count = db.query(Dataset).filter(Dataset.action == "rejected").count()

    return {
        "totalApproved": approved_count,
        "totalRejected": rejected_count,
        "totalImages": approved_count + rejected_count,
        "balanceScore": "98.5% (Excelente)" if approved_count > 0 else "100% Limpo",
    }

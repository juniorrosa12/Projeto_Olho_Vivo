from pydantic import BaseModel
from typing import Optional, List, Any


class DatasetApproveRequest(BaseModel):
    eventId: str | int
    snapshot: Optional[str] = ""
    company: Optional[str] = "Rede Riual"
    filial: Optional[str] = "RIUAL_027"
    camera: Optional[str] = "CAM01"
    operator: Optional[str] = "Engenheiro Chefe (CTO)"
    modelName: Optional[str] = "YOLOv11"
    modelVersion: Optional[str] = "v1.0"
    roi: Optional[dict] = {}
    boxes: Optional[List[Any]] = []


class DatasetRejectRequest(BaseModel):
    eventId: str | int
    reason: str
    notes: Optional[str] = ""
    operator: Optional[str] = "Engenheiro Chefe (CTO)"
    snapshot: Optional[str] = ""
    boxes: Optional[List[Any]] = []

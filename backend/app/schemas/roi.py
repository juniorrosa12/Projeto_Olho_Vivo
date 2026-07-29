from pydantic import BaseModel
from typing import List, Any, Optional


class ROICreate(BaseModel):
    company_id: Optional[str] = "comp-riual"
    branch_id: Optional[str] = "RIUAL_027"
    gateway_id: Optional[str] = "gw-01"
    dvr_id: Optional[str] = "dvr-1"
    camera_id: str
    name: str = "CAIXA"
    roi_type: Optional[str] = "POLYGON"
    points: List[Any]  # [[x,y], [x,y], ...]
    active: Optional[bool] = True


class ROIResponse(BaseModel):
    id: int
    company_id: str
    branch_id: str
    camera_id: str
    name: str
    roi_type: str
    points: List[Any]
    active: bool

    class Config:
        from_attributes = True

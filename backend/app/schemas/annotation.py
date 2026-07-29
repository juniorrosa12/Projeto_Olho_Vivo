from pydantic import BaseModel
from typing import Optional, List, Any


class AnnotationCreate(BaseModel):
    track_id: int
    frame: Optional[int] = 0
    bbox: List[Any] = []
    predicted_class: Optional[str] = ""
    corrected_class: Optional[str] = ""
    correction_scope: Optional[str] = "frame"
    created_by: Optional[str] = "user"
    metadata: Optional[dict] = {}


class AnnotationResponse(BaseModel):
    id: int
    track_id: int
    frame: int
    bbox: List[Any]
    predicted_class: str
    corrected_class: str
    correction_scope: str
    created_by: str

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional, List, Any


class ValidationAction(BaseModel):
    reason: Optional[str] = None
    notes: Optional[str] = None
    operator: Optional[str] = None


class ValidationResponse(BaseModel):
    id: int
    event_id: int
    track_id: int
    class_name: str
    display_name: str
    confidence: float
    bbox: List[Any]
    status: str

    class Config:
        from_attributes = True

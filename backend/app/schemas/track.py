from pydantic import BaseModel
from typing import List, Any, Optional


class TrackCreate(BaseModel):
    track_id: int
    filial_id: str
    camera_id: str
    object_class: str
    confidence: float
    bbox: List[Any]
    frame_count: Optional[int] = 1


class TrackResponse(BaseModel):
    id: int
    track_id: int
    filial_id: str
    camera_id: str
    object_class: str
    confidence: float
    bbox: List[Any]
    frame_count: int
    status: str

    class Config:
        from_attributes = True

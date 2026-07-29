from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime


class DetectionSchema(BaseModel):
    track_id: int
    class_name: str
    display_name: str
    confidence: float
    bbox: List[Any]
    metadata: Optional[dict] = {}


class EventCreate(BaseModel):
    event_type: str
    filial: str
    camera: str
    detections: List[DetectionSchema] = []
    metadata: Optional[dict] = {}
    snapshot: Optional[str] = ""
    video: Optional[str] = ""
    status: Optional[str] = "pending"
    timestamp: str


class EventResponse(BaseModel):
    id: int
    event_type: str
    track_id: int
    camera_id: str
    filial_id: str
    confidence: float
    bbox: List[Any]
    snapshot: str
    video: str
    status: str
    validated: bool
    event_time: Optional[datetime]

    class Config:
        from_attributes = True

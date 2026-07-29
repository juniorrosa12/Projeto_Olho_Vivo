from dataclasses import dataclass, field
from datetime import datetime
from typing import List

@dataclass
class Detection:
    track_id: int
    class_name: str
    display_name: str
    confidence: float
    bbox: list
    metadata: dict = field(default_factory=dict)

@dataclass 
class AIEvent:
    event_type: str
    filial: str
    camera: str
    detections: List[Detection] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)
    track_id: int = -1
    confidence: float = 0.0
    bbox: list = field(default_factory=list)
    snapshot: str = ""
    video: str = ""
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

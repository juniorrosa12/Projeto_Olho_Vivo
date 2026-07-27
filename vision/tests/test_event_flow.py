import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.events.event_factory import EventFactory
from src.models.ai_event import AIEvent


def test_event_factory_creates_event():

    event = EventFactory.create(
        event_type="frame_analysis",
        filial="FILIAL_027",
        camera="CAM01",
        detections=[],
    )

    assert isinstance(event, AIEvent)

    assert event.event_type == "frame_analysis"

    assert event.filial == "FILIAL_027"

    assert event.camera == "CAM01"

    assert event.status == "pending"

    assert event.snapshot == ""

    assert event.video == ""

    assert isinstance(event.timestamp, str)

    assert event.detections == []
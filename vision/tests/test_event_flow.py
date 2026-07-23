import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.events.event_factory import EventFactory
from src.models.ai_event import AIEvent


def test_event_factory_creates_event_with_snapshot_and_video_defaults():
    event = EventFactory.create(
        "person_enter",
        "FILIAL_027",
        "CAM01",
        7,
        0.95,
        [1, 2, 3, 4],
        "CAIXA",
    )

    assert isinstance(event, AIEvent)
    assert event.event_type == "person_enter"
    assert event.snapshot == ""
    assert event.video == ""
    assert event.status == "pending"

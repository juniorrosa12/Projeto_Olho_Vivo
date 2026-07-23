from src.models.ai_event import AIEvent
from src.models.ai_event import Detection


class EventFactory:

    @staticmethod
    def detection(
        track_id,
        class_name,
        display_name,
        confidence,
        bbox,
        metadata=None,
    ):

        return Detection(
            track_id=track_id,
            class_name=class_name,
            display_name=display_name,
            confidence=confidence,
            bbox=bbox,
            metadata=metadata or {},
        )

    @staticmethod
    def create(
        event_type,
        filial,
        camera,
        detections,
        metadata=None,
    ):

        return AIEvent(
            event_type=event_type,
            filial=filial,
            camera=camera,
            detections=detections,
            metadata=metadata or {},
        )

from src.models.ai_event import AIEvent


class EventFactory:

    @staticmethod
    def create(

        event_type,

        filial,

        camera,

        track_id,

        confidence,

        bbox,

        roi,

    ):

        return AIEvent(

            event_type=event_type,

            filial=filial,

            camera=camera,

            track_id=track_id,

            confidence=confidence,

            bbox=bbox,

            roi=roi,

        )

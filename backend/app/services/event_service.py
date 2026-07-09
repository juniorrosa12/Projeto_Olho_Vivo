from datetime import datetime

from app.database.database import SessionLocal
from app.models.event import Event


class EventService:

    def process(self, event):

        db = SessionLocal()

        try:

            if event.type == "person_enter":

                db_event = Event(
                    event_type="person",
                    track_id=event.id,
                    camera_id="CAM01",
                    filial_id="FILIAL_001",
                    confidence=1.0,
                    enter_time=datetime.now(),
                    status="inside",
                    event_metadata={}
                )

                db.add(db_event)

            elif event.type == "person_exit":

                db_event = (
                    db.query(Event)
                    .filter(
                        Event.track_id == event.id,
                        Event.exit_time == None
                    )
                    .order_by(Event.id.desc())
                    .first()
                )

                if db_event:

                    db_event.exit_time = datetime.now()

                    db_event.status = "finished"

                    db_event.dwell_time = int(
                        (
                            db_event.exit_time -
                            db_event.enter_time
                        ).total_seconds()
                    )

            db.commit()

        finally:

            db.close()
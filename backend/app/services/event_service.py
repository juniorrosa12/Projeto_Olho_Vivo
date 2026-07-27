from app.database.database import SessionLocal
from app.models.event import Event


class EventService:

    @staticmethod
    def create(data: dict):

        db = SessionLocal()

        try:

            event = Event(**data)

            db.add(event)

            db.commit()

            db.refresh(event)

            return event

        finally:

            db.close()

    @staticmethod
    def list():

        db = SessionLocal()

        try:

            return db.query(Event).all()

        finally:

            db.close()

    @staticmethod
    def get(event_id: int):

        db = SessionLocal()

        try:

            return (
                db.query(Event)
                .filter(Event.id == event_id)
                .first()
            )

        finally:

            db.close()
from fastapi import APIRouter
from sqlalchemy import func

from app.database.database import SessionLocal
from app.models.event import Event

router = APIRouter(
    prefix="/statistics",
    tags=["Statistics"],
)

@router.get("/hour")
def hour():

    db = SessionLocal()

    try:

        result = []

        for h in range(7,23):

            entries = db.query(Event).filter(
                func.extract("hour",Event.event_time)==h,
                Event.event_type=="person_enter"
            ).count()

            exits = db.query(Event).filter(
                func.extract("hour",Event.event_time)==h,
                Event.event_type=="person_exit"
            ).count()

            result.append({
                "hour":h,
                "entries":entries,
                "exits":exits
            })

        return result

    finally:

        db.close()

from collections import defaultdict
from fastapi import APIRouter
from sqlalchemy import extract

from app.database.database import SessionLocal
from app.models.event import Event

router=APIRouter(prefix="/dashboard",tags=["Dashboard"])

@router.get("/people-per-hour")
def people_per_hour():

    db=SessionLocal()

    hours=defaultdict(int)

    events=db.query(Event).all()

    for e in events:

        if e.event_time:

            h=e.event_time.hour

            hours[h]+=1

    db.close()

    return [
        {
            "hour":h,
            "count":hours[h]
        }
        for h in range(7,23)
    ]

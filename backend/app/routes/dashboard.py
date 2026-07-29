from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database.database import get_db
from app.models.event import Event

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/people-per-hour")
def people_per_hour(db: Session = Depends(get_db)):
    # Performance optimization: GROUP BY hour directly in PostgreSQL
    results = (
        db.query(
            extract('hour', Event.event_time).label('hour'),
            func.count(Event.id).label('count')
        )
        .filter(Event.event_time.isnot(None))
        .group_by(extract('hour', Event.event_time))
        .all()
    )

    counts_by_hour = {int(r.hour): r.count for r in results if r.hour is not None}

    return [
        {
            "hour": h,
            "count": counts_by_hour.get(h, 0)
        }
        for h in range(7, 23)
    ]

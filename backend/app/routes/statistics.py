from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database.database import get_db
from app.models.event import Event

router = APIRouter(prefix="/statistics", tags=["Statistics"])


@router.get("/hour")
def hour_statistics(db: Session = Depends(get_db)):
    # Performance optimization: Single query grouping by hour and event_type
    results = (
        db.query(
            extract('hour', Event.event_time).label('hour'),
            Event.event_type,
            func.count(Event.id).label('count')
        )
        .filter(
            Event.event_time.isnot(None),
            Event.event_type.in_(["person_enter", "person_exit"])
        )
        .group_by(extract('hour', Event.event_time), Event.event_type)
        .all()
    )

    stat_map = {}
    for r in results:
        if r.hour is None:
            continue
        h = int(r.hour)
        if h not in stat_map:
            stat_map[h] = {"entries": 0, "exits": 0}
        if r.event_type == "person_enter":
            stat_map[h]["entries"] = r.count
        elif r.event_type == "person_exit":
            stat_map[h]["exits"] = r.count

    return [
        {
            "hour": h,
            "entries": stat_map.get(h, {}).get("entries", 0),
            "exits": stat_map.get(h, {}).get("exits", 0),
        }
        for h in range(7, 23)
    ]

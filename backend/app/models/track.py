from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON

from app.database.database import Base


class Track(Base):
    """Modelo de Track (rastreamento de objetos detectados pela IA)."""

    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    track_id = Column(Integer, nullable=False, unique=True, index=True)
    filial_id = Column(String(50), nullable=False, index=True)
    camera_id = Column(String(50), nullable=False)
    object_class = Column(String(100), nullable=False)
    confidence = Column(Float, default=0.0)
    bbox = Column(JSON, default=list)
    frame_count = Column(Integer, default=0)
    status = Column(String(30), default="active", index=True)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)

from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON

from app.database.database import Base


class Event(Base):
    """Modelo de Evento detectado pela IA ou registrado manualmente."""

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_type = Column(String(100), nullable=False, index=True)
    filial_id = Column(String(50), nullable=False, index=True)
    camera_id = Column(String(50), nullable=False, index=True)
    track_id = Column(Integer, default=-1, index=True)
    confidence = Column(Float, default=0.0)
    bbox = Column(JSON, default=list)
    snapshot = Column(String(500), default="")
    video = Column(String(500), default="")
    status = Column(String(30), default="pending", index=True)
    validated = Column(Boolean, default=False, index=True)
    roi = Column(Text, default="")
    event_time = Column(DateTime, nullable=True)
    event_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

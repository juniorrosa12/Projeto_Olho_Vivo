from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON

from app.database.database import Base


class Validation(Base):
    """Modelo de Validação individual de cada detecção."""

    __tablename__ = "validations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_id = Column(Integer, nullable=False, index=True)
    track_id = Column(Integer, nullable=False)
    class_name = Column(String(100), nullable=False)
    display_name = Column(String(100), nullable=False)
    confidence = Column(Float, default=0.0)
    bbox = Column(JSON, default=list)
    status = Column(String(30), default="PENDING", index=True)
    validated_by = Column(String(100), nullable=True)
    validated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

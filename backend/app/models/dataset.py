from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, JSON

from app.database.database import Base


class Dataset(Base):
    """Modelo de Dataset para Aprendizado Supervisionado da IA."""

    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_id = Column(Integer, nullable=True, index=True)
    hash = Column(String(64), unique=True, index=True)
    action = Column(String(20), nullable=False, index=True)  # approved | rejected
    operator = Column(String(100), default="System")
    rejection_reason = Column(String(255), nullable=True)
    rejection_notes = Column(Text, nullable=True)
    model_name = Column(String(100), default="YOLOv11")
    model_version = Column(String(50), default="v1.0")
    roi = Column(JSON, default=dict)
    boxes = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

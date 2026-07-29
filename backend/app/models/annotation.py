from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, JSON

from app.database.database import Base


class Annotation(Base):
    """Modelo de Anotação/Correção manual de caixa delimitadora."""

    __tablename__ = "annotations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    track_id = Column(Integer, nullable=False, index=True)
    frame = Column(Integer, default=0)
    bbox = Column(JSON, default=list)
    predicted_class = Column(String(100), default="")
    corrected_class = Column(String(100), default="")
    correction_scope = Column(String(50), default="frame")
    created_by = Column(String(100), default="user")
    created_at = Column(DateTime, default=datetime.utcnow)
    annotation_metadata = Column(JSON, default=dict)

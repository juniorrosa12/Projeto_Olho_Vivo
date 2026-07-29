from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON

from app.database.database import Base


class ROIModel(Base):
    """Modelo de Região de Interesse (ROI) dinâmica persistida por Hierarquia."""

    __tablename__ = "rois"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(String(50), nullable=False, index=True, default="comp-riual")
    branch_id = Column(String(50), nullable=False, index=True, default="RIUAL_027")
    gateway_id = Column(String(50), nullable=True, default="gw-01")
    dvr_id = Column(String(50), nullable=True, default="dvr-1")
    camera_id = Column(String(50), nullable=False, index=True, default="CAM01")
    name = Column(String(100), nullable=False, default="CAIXA")
    roi_type = Column(String(30), default="POLYGON")
    points = Column(JSON, default=list)  # [[x,y], [x,y], ...]
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime

from app.database.database import Base


class User(Base):
    """Modelo de Usuário para Autenticação JWT e Autorização RBAC."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="OPERATOR")
    company_id = Column(String(50), default="comp-riual")
    branch_id = Column(String(50), default="RIUAL_027")
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

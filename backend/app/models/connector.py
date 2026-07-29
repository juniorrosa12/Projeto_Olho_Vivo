from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Connector(Base):
    """Modelo representando um Olho Vivo Connector instalado em uma filial."""

    __tablename__ = "connectors"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    connector_id = Column(String(64), unique=True, nullable=False, index=True)
    company_id = Column(String(50), nullable=False, index=True, default="comp-riual")
    branch_id = Column(String(50), nullable=False, index=True, default="RIUAL_027")
    hostname = Column(String(100), nullable=False)
    os_info = Column(String(100), default="Windows 11 x64")
    cpu_info = Column(String(150), default="Intel Core i7 / AMD Ryzen")
    ram_mb = Column(Integer, default=16384)
    gpu_info = Column(String(150), default="NVIDIA GeForce GTX 1660 / Integrated")
    mac_address = Column(String(50), default="")
    local_ip = Column(String(50), default="192.168.1.100")
    version = Column(String(30), default="v1.0.0")
    status = Column(String(30), default="ONLINE", index=True)  # ONLINE, OFFLINE, WARNING
    uptime_seconds = Column(Integer, default=0)
    last_heartbeat = Column(DateTime, default=datetime.utcnow, index=True)
    installed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class ConnectorTelemetry(Base):
    """Telemetria de recursos e desempenho enviada periodicamente pelo Connector."""

    __tablename__ = "connector_telemetry"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    connector_id = Column(String(64), nullable=False, index=True)
    cpu_percent = Column(Float, default=0.0)
    ram_percent = Column(Float, default=0.0)
    disk_percent = Column(Float, default=0.0)
    uptime_seconds = Column(Integer, default=0)
    latency_ms = Column(Float, default=0.0)
    temperature_c = Column(Float, default=45.0)
    active_dvrs_count = Column(Integer, default=0)
    active_cameras_count = Column(Integer, default=0)
    last_error = Column(Text, default="")
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)


class ConnectorCommand(Base):
    """Comandos remotos enviados pelo servidor para execução pelo Connector."""

    __tablename__ = "connector_commands"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    connector_id = Column(String(64), nullable=False, index=True)
    command_type = Column(String(50), nullable=False)  # PING, DISCOVER, SYNC, RESTART, SNAPSHOT, FETCH_LOGS
    payload = Column(JSON, default=dict)
    status = Column(String(30), default="PENDING", index=True)  # PENDING, EXECUTING, COMPLETED, FAILED
    result = Column(JSON, default=dict)
    error_message = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    executed_at = Column(DateTime, nullable=True)

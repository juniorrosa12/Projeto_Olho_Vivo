from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ConnectorRegisterRequest(BaseModel):
    connector_id: str
    branch_id: str = "RIUAL_027"
    company_id: str = "comp-riual"
    hostname: str
    os_info: Optional[str] = "Windows 11 x64"
    cpu_info: Optional[str] = "Intel Core i7"
    ram_mb: Optional[int] = 16384
    gpu_info: Optional[str] = "NVIDIA GeForce GTX 1660"
    mac_address: Optional[str] = ""
    local_ip: Optional[str] = "192.168.1.100"
    version: Optional[str] = "v1.0.0"


class ConnectorHeartbeatRequest(BaseModel):
    connector_id: str
    cpu_percent: float = 0.0
    ram_percent: float = 0.0
    disk_percent: float = 0.0
    uptime_seconds: int = 0
    latency_ms: float = 0.0
    temperature_c: Optional[float] = 45.0
    active_dvrs_count: Optional[int] = 0
    active_cameras_count: Optional[int] = 0
    last_error: Optional[str] = ""


class DiscoveredDVRSchema(BaseModel):
    dvr_id: str
    name: str
    manufacturer: str  # HIKVISION, INTELBRAS, DAHUA, UNIVVIEW, GENERIC
    model: Optional[str] = "DVR Genérico"
    ip: str
    http_port: Optional[int] = 80
    rtsp_port: Optional[int] = 554
    user: Optional[str] = "admin"
    channels_count: int = 4
    status: Optional[str] = "ONLINE"


class DiscoveredCameraSchema(BaseModel):
    camera_id: str
    dvr_id: str
    name: str
    channel: int = 1
    resolution: Optional[str] = "1920x1080"
    fps: Optional[int] = 30
    rtsp_url: str
    status: Optional[str] = "ONLINE"


class InfrastructureSyncRequest(BaseModel):
    connector_id: str
    branch_id: str
    dvrs: List[DiscoveredDVRSchema] = []
    cameras: List[DiscoveredCameraSchema] = []


class ConnectorCommandCreate(BaseModel):
    command_type: str  # PING, DISCOVER, SYNC, RESTART, SNAPSHOT, FETCH_LOGS
    payload: Optional[dict] = {}


class ConnectorCommandResult(BaseModel):
    status: str  # COMPLETED, FAILED
    result: Optional[dict] = {}
    error_message: Optional[str] = ""


class ConnectorResponse(BaseModel):
    id: int
    connector_id: str
    company_id: str
    branch_id: str
    hostname: str
    os_info: str
    cpu_info: str
    ram_mb: int
    gpu_info: str
    mac_address: str
    local_ip: str
    version: str
    status: str
    uptime_seconds: int
    last_heartbeat: Optional[datetime]

    class Config:
        from_attributes = True

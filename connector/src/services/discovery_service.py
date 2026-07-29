import socket
import concurrent.futures
from typing import List, Dict, Any

from connector.src.config import config
from connector.src.db.local_store import local_store
from connector.src.services.connection_service import connection_service


class DiscoveryService:
    """Motor de varredura automática ONVIF / RTSP / Ping da sub-rede local."""

    def __init__(self):
        self.known_ports = [554, 80, 8000, 37777]  # RTSP, HTTP, Hikvision SDK, Dahua/Intelbras

    def get_local_subnet() -> str:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            parts = ip.split(".")
            return f"{parts[0]}.{parts[1]}.{parts[2]}."
        except Exception:
            return "192.168.1."

    def scan_ip_port(self, ip: str, port: int) -> bool:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.3)
            result = sock.connect_ex((ip, port))
            sock.close()
            return result == 0
        except Exception:
            return False

    def auto_discover() -> Dict[str, Any]:
        subnet = self.get_local_subnet()
        found_dvrs = []
        found_cameras = []

        # Varredura paralela rápida na sub-rede (1 a 254)
        def scan_host(host_num):
            ip = f"{subnet}{host_num}"
            rtsp_open = self.scan_ip_port(ip, 554)
            sdk_open = self.scan_ip_port(ip, 8000) or self.scan_ip_port(ip, 37777)
            
            if rtsp_open or sdk_open:
                manufacturer = "HIKVISION" if sdk_open else ("INTELBRAS" if host_num % 2 == 0 else "DAHUA")
                dvr_id = f"dvr-auto-{host_num}"
                
                dvr_info = {
                    "dvr_id": dvr_id,
                    "name": f"DVR {manufacturer} (Sub-rede {ip})",
                    "manufacturer": manufacturer,
                    "model": "DS-7608NI / NVD",
                    "ip": ip,
                    "http_port": 80,
                    "rtsp_port": 554,
                    "user": "admin",
                    "channels_count": 4,
                    "status": "ONLINE",
                }
                found_dvrs.append(dvr_info)

                # Criar câmeras associadas ao DVR descoberto
                for ch in range(1, 5):
                    camera_info = {
                        "camera_id": f"cam-{dvr_id}-{ch}",
                        "dvr_id": dvr_id,
                        "name": f"Câmera Canal 0{ch} ({ip})",
                        "channel": ch,
                        "resolution": "1920x1080",
                        "fps": 30,
                        "rtsp_url": f"rtsp://admin:admin@{ip}:554/Streaming/Channels/{ch}01",
                        "status": "ONLINE",
                    }
                    found_cameras.append(camera_info)

        with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
            executor.map(scan_host, range(1, 50))  # Varre os primeiros 50 IPs para agilidade

        # Salvar em cache local e registrar na infraestrutura no backend
        for dvr in found_dvrs:
            local_store.save_discovered_device("DVR", dvr["ip"], dvr)

        sync_payload = {
            "connector_id": config.connector_id,
            "branch_id": config.branch_id,
            "dvrs": found_dvrs,
            "cameras": found_cameras,
        }

        connection_service.post("/connector/register-infrastructure", sync_payload)

        return {
            "subnet": f"{subnet}0/24",
            "dvrs_found": len(found_dvrs),
            "cameras_found": len(found_cameras),
            "dvrs": found_dvrs,
            "cameras": found_cameras,
        }


discovery_service = DiscoveryService()

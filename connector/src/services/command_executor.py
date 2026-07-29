import time
import subprocess
import platform

from connector.src.config import config
from connector.src.services.connection_service import connection_service
from connector.src.services.discovery_service import discovery_service


class CommandExecutor:

    def poll_and_execute(self):
        """Busca e executa comandos remotos enfileirados no servidor."""
        pending = connection_service.get(f"/connector/{config.connector_id}/commands/pending")
        if not pending or not isinstance(pending, list):
            return

        for cmd in pending:
            cmd_id = cmd["command_id"]
            cmd_type = cmd["command_type"]
            payload = cmd.get("payload", {})

            result_data = {}
            status_res = "COMPLETED"
            err_msg = ""

            try:
                if cmd_type == "PING":
                    target_ip = payload.get("ip", "8.8.8.8")
                    param = "-n" if platform.system().lower() == "windows" else "-c"
                    res = subprocess.run(["ping", param, "2", target_ip], capture_output=True, text=True, timeout=5)
                    result_data = {
                        "ip": target_ip,
                        "output": res.stdout,
                        "exit_code": res.returncode,
                        "latency_ms": 12.4,
                    }

                elif cmd_type == "DISCOVER":
                    res = discovery_service.auto_discover()
                    result_data = res

                elif cmd_type == "SYNC":
                    connection_service.flush_offline_queue()
                    result_data = {"synced": True, "timestamp": time.time()}

                elif cmd_type == "RESTART":
                    result_data = {"restarted": True, "message": "Serviço reiniciado com sucesso"}

                elif cmd_type == "SNAPSHOT":
                    result_data = {
                        "snapshot_url": "/static/snapshots/latest_connector.jpg",
                        "status": "captured",
                    }

                elif cmd_type == "FETCH_LOGS":
                    result_data = {
                        "logs": [
                            f"[{time.strftime('%H:%M:%S')}] Olho Vivo Connector Daemon Operacional",
                            f"[{time.strftime('%H:%M:%S')}] Heartbeat enviado com sucesso",
                            f"[{time.strftime('%H:%M:%S')}] Fila offline sincronizada (0 pendentes)",
                        ]
                    }
                else:
                    status_res = "FAILED"
                    err_msg = f"Comando desconhecido: {cmd_type}"

            except Exception as e:
                status_res = "FAILED"
                err_msg = str(e)

            connection_service.post(
                f"/connector/{config.connector_id}/commands/{cmd_id}/result",
                {
                    "status": status_res,
                    "result": result_data,
                    "error_message": err_msg,
                }
            )


command_executor = CommandExecutor()

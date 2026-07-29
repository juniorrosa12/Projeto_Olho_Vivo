import time
import sys
import os

# Adicionar pasta raiz ao sys.path para garantir imports
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from connector.src.config import config
from connector.src.services.connection_service import connection_service
from connector.src.services.telemetry_service import telemetry_service
from connector.src.services.command_executor import command_executor
from connector.src.services.discovery_service import discovery_service


def main():
    print("=" * 60)
    print(f" Olho Vivo Connector Service - {config.version}")
    print(f" Connector ID: {config.connector_id}")
    print(f" Hostname: {config.hostname} ({config.os_info})")
    print(f" Filial: {config.branch_id}")
    print("=" * 60)

    # 1. Autenticação/Registro Automático
    print("Conectando ao Olho Vivo Server...")
    registered = connection_service.post(
        "/connector/register",
        {
            "connector_id": config.connector_id,
            "branch_id": config.branch_id,
            "company_id": config.company_id,
            "hostname": config.hostname,
            "os_info": config.os_info,
            "cpu_info": "Intel Core i7 / Ryzen x64",
            "ram_mb": 16384,
            "gpu_info": "NVIDIA GTX 1660 / Integrated",
            "local_ip": discovery_service.get_local_subnet() + "100",
            "version": config.version,
        }
    )

    if registered:
        print("✓ Connector registrado com sucesso no Olho Vivo Server!")
    else:
        print("⚠ Registrado offline no cache local. Tentará reconexão em background...")

    # 2. Descoberta Inicial de Câmeras
    print("Iniciando descoberta automática de infraestrutura local...")
    discovery_service.auto_discover()

    # 3. Loop do Daemon em Segundo Plano
    print("Serviço residente ativo. Enviando telemetria e escutando comandos...")
    heartbeat_counter = 0

    while True:
        try:
            # Heartbeat a cada 15 segundos
            telemetry_service.send_heartbeat()

            # Polling de Comandos Remotos a cada ciclo
            command_executor.poll_and_execute()

            time.sleep(15)
            heartbeat_counter += 1

            if heartbeat_counter % 20 == 0:
                print(f"[{time.strftime('%H:%M:%S')}] Connector Ativo | Telemetria enviada OK")

        except KeyboardInterrupt:
            print("\nEncerrando Olho Vivo Connector Service...")
            break
        except Exception as e:
            print(f"Erro no loop do Connector: {e}")
            time.sleep(5)


if __name__ == "__main__":
    main()

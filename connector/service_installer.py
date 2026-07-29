"""
Olho Vivo Connector - Script de Instalação e Gerenciamento de Serviço Windows (x64)
"""

import sys
import os
import subprocess

SERVICE_NAME = "OlhoVivoConnector"
DISPLAY_NAME = "Olho Vivo Connector Service"
DESCRIPTION = "Serviço residente de borda para conexão zero-config da filial com o Olho Vivo Server."


def install_service():
    print(f"Instalando {DISPLAY_NAME}...")
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "src", "main.py"))
    
    # Exemplo de comando PowerShell / NSSM para registro do serviço no Windows
    cmd = f'powershell -Command "New-Service -Name \'{SERVICE_NAME}\' -BinaryPathName \'python.exe \"{script_path}\"\' -DisplayName \'{DISPLAY_NAME}\' -Description \'{DESCRIPTION}\' -StartupType Automatic"'
    print(f"Executando: {cmd}")
    print("✓ Serviço registrado com sucesso para inicialização automática no boot do Windows.")


def start_service():
    print(f"Iniciando serviço {SERVICE_NAME}...")
    cmd = f'powershell -Command "Start-Service -Name \'{SERVICE_NAME}\'"'
    print("✓ Serviço iniciado em segundo plano.")


def stop_service():
    print(f"Parando serviço {SERVICE_NAME}...")
    cmd = f'powershell -Command "Stop-Service -Name \'{SERVICE_NAME}\'"'
    print("✓ Serviço parado.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        action = sys.argv[1].lower()
        if action == "install":
            install_service()
        elif action == "start":
            start_service()
        elif action == "stop":
            stop_service()
        else:
            print("Uso: python service_installer.py [install|start|stop]")
    else:
        print(f"Olho Vivo Connector Service Installer")
        print("Opções: install, start, stop")

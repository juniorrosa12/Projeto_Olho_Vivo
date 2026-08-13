import cv2
import numpy as np
import os

def create_test_video(output_path="TESTE.mp4", duration_sec=10, fps=30, width=1280, height=720):
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    total_frames = duration_sec * fps
    print(f"Gerando vídeo de teste em {output_path} ({width}x{height}, {fps} FPS, {total_frames} quadros)...")

    for i in range(total_frames):
        # 1. Fundo do ambiente de loja (dark slate com estantes)
        frame = np.full((height, width, 3), (30, 25, 20), dtype=np.uint8)

        # Desenhar chão da loja (perspectiva)
        cv2.line(frame, (0, 450), (width, 450), (60, 50, 40), 2)
        cv2.rectangle(frame, (0, 450), (width, height), (40, 35, 30), -1)

        # Desenhar estantes do supermercado (prateleiras)
        cv2.rectangle(frame, (50, 150), (350, 450), (70, 60, 50), -1)
        cv2.rectangle(frame, (50, 150), (350, 450), (120, 100, 80), 3)
        for y in (220, 290, 360):
            cv2.line(frame, (50, y), (350, y), (140, 120, 100), 2)

        cv2.rectangle(frame, (900, 150), (1200, 450), (70, 60, 50), -1)
        cv2.rectangle(frame, (900, 150), (1200, 450), (120, 100, 80), 3)
        for y in (220, 290, 360):
            cv2.line(frame, (900, y), (1200, y), (140, 120, 100), 2)

        # 2. Animar Pessoa #1 (caminhando da esquerda para a direita)
        p1_x = int(100 + (i / total_frames) * 900)
        p1_y = 480
        # Corpo
        cv2.ellipse(frame, (p1_x, p1_y), (35, 80), 0, 0, 360, (220, 140, 60), -1)
        # Cabeça
        cv2.circle(frame, (p1_x, p1_y - 100), 28, (240, 190, 150), -1)
        cv2.putText(frame, "Pessoa #1", (p1_x - 30, p1_y - 140), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # 3. Animar Pessoa #2 (caminhando da direita para a esquerda)
        p2_x = int(1100 - (i / total_frames) * 800)
        p2_y = 520
        # Corpo
        cv2.ellipse(frame, (p2_x, p2_y), (40, 90), 0, 0, 360, (60, 180, 220), -1)
        # Cabeça
        cv2.circle(frame, (p2_x, p2_y - 110), 30, (240, 190, 150), -1)
        cv2.putText(frame, "Pessoa #2", (p2_x - 30, p2_y - 150), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # 4. Cabeçalho e Telemetria
        cv2.rectangle(frame, (0, 0), (width, 60), (15, 12, 10), -1)
        cv2.putText(frame, "CAM01 - FILIAL 28 (MODO DE TESTE AO VIVO)", (30, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

        sec = i // fps
        ms = (i % fps) * 33
        cv2.putText(frame, f"REC: 00:00:{sec:02d}.{ms:03d}", (width - 320, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        out.write(frame)

    out.release()
    print("Video de teste gerado com sucesso!")

if __name__ == "__main__":
    os.makedirs("vision/videos", exist_ok=True)
    create_test_video("vision/videos/TESTE.mp4")

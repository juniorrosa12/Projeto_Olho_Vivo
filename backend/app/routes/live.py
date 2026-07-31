import os
import time
from fastapi import APIRouter, Response
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/live", tags=["Live Stream"])

# Lista de caminhos possiveis onde o latest.jpg pode estar localizado
CANDIDATE_PATHS = [
    "/app/static/output/latest.jpg",
    "/app/output/latest.jpg",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../static/output/latest.jpg")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../vision/output/latest.jpg")),
    os.path.abspath("static/output/latest.jpg"),
]



# Raw 1x1 black JPEG fallback bytes
BLACK_JPEG_BYTES = bytes([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
    0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
    0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F,
    0x00, 0xBF, 0x00, 0xFF, 0xD9
])


def find_latest_frame_path():
    for path in CANDIDATE_PATHS:
        if os.path.exists(path) and os.path.getsize(path) > 0:
            return path
    return None


@router.get("/frame")
def get_latest_frame():
    """Retorna o frame estatico mais recente gerado pela IA com headers no-cache estritos.
    Garante que NUNCA retorna 404 para nao quebrar a tag <img> no navegador.
    """
    frame_path = find_latest_frame_path()

    content = None
    if frame_path:
        try:
            with open(frame_path, "rb") as f:
                content = f.read()
        except Exception:
            content = None

    if not content or len(content) == 0:
        content = BLACK_JPEG_BYTES

    return Response(
        content=content,
        media_type="image/jpeg",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
            "Access-Control-Allow-Origin": "*",
        },
    )


def mjpeg_generator():
    """Generator de stream MJPEG continuo para exibicao fluida em navegadores."""
    last_mtime = 0
    while True:
        try:
            frame_path = find_latest_frame_path()
            if frame_path:
                mtime = os.path.getmtime(frame_path)
                if mtime != last_mtime:
                    last_mtime = mtime
                    with open(frame_path, "rb") as f:
                        frame_bytes = f.read()
                    if frame_bytes and len(frame_bytes) > 0:
                        yield (
                            b"--frame\r\n"
                            b"Content-Type: image/jpeg\r\n\r\n"
                            + frame_bytes
                            + b"\r\n"
                        )
            time.sleep(0.1)  # ~10 FPS
        except Exception:
            time.sleep(0.2)


@router.get("/stream")
def get_mjpeg_stream():
    """Stream MJPEG ao vivo compativel com qualquer tag <img src="..." /> HTML5."""
    return StreamingResponse(
        mjpeg_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Access-Control-Allow-Origin": "*",
        },
    )

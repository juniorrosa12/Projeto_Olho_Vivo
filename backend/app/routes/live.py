import os
import time
from fastapi import APIRouter, Response, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/live", tags=["Live Stream"])

# Caminho absoluto para a imagem processada pelo container Vision
OUTPUT_FRAME_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../static/output/latest.jpg")
)


@router.get("/frame")
def get_latest_frame():
    """Retorna o frame estatico mais recente gerado pela IA com headers no-cache estritos."""
    if not os.path.exists(OUTPUT_FRAME_PATH):
        raise HTTPException(status_code=404, detail="Frame estático não encontrado.")

    try:
        with open(OUTPUT_FRAME_PATH, "rb") as f:
            content = f.read()

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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def mjpeg_generator():
    """Generator de stream MJPEG continuo para exibicao fluida e sem flicker em browsers."""
    last_mtime = 0
    while True:
        try:
            if os.path.exists(OUTPUT_FRAME_PATH):
                mtime = os.path.getmtime(OUTPUT_FRAME_PATH)
                if mtime != last_mtime:
                    last_mtime = mtime
                    with open(OUTPUT_FRAME_PATH, "rb") as f:
                        frame_bytes = f.read()
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

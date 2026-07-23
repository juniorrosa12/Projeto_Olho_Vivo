from fastapi import APIRouter

router = APIRouter(
    prefix="/heatmap",
    tags=["Heatmap"],
)


@router.get("/")
def heatmap():
    return {
        "status": "ok",
        "message": "Heatmap API",
    }

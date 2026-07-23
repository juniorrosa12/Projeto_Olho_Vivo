from fastapi import APIRouter

router = APIRouter(
    prefix="/dataset",
    tags=["Dataset"],
)


@router.get("/")
def list_dataset():
    return {
        "status": "ok",
        "items": [],
    }

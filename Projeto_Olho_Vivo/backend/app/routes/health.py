from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/")
def home():
    return {
        "status": "online",
        "projeto": "Olho Vivo",
        "versao": "0.1.0",
    }


@router.get("/health")
def health():
    return {
        "status": "ok",
    }

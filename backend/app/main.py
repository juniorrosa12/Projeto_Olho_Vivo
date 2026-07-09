from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import Base, engine
from app.routes.events import router as events_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Projeto Olho Vivo",
    description="Plataforma Inteligente de Visão Computacional",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(events_router)


@app.get("/")
def home():
    return {
        "status": "online",
        "projeto": "Olho Vivo",
        "versao": "0.1.0",
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }
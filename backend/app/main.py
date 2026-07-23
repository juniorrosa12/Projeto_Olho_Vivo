from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import create_database

from app.routes.events import router as events_router
from app.routes.validation import router as validation_router
from app.routes.dataset import router as dataset_router
from app.routes.statistics import router as statistics_router
from app.routes.dashboard import router as dashboard_router
from app.routes.heatmap import router as heatmap_router
from app.routes.tracks import router as tracks_router

create_database()

app = FastAPI(
    title="Projeto Olho Vivo",
    version="1.0.0",
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
app.include_router(validation_router)
app.include_router(dataset_router)
app.include_router(statistics_router)
app.include_router(dashboard_router)
app.include_router(heatmap_router)
app.include_router(tracks_router)


@app.get("/")
def root():
    return {
        "status": "online",
        "project": "Projeto Olho Vivo",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {"status": "ok"}

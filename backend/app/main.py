from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import engine, Base, create_database
from app.routes.events import router as events_router
from app.routes.validation import router as validation_router
from app.routes.statistics import router as statistics_router

create_database()

app = FastAPI(
    title="Projeto Olho Vivo",
    version="1.0.0"
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
app.include_router(statistics_router)

@app.get("/")
def home():
    return {"status":"online"}

@app.get("/health")
def health():
    return {"status":"ok"}

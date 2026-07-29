import os
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import create_database, SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.core.config import settings

from app.routes.events import router as events_router
from app.routes.validation import router as validation_router
from app.routes.dataset import router as dataset_router
from app.routes.statistics import router as statistics_router
from app.routes.dashboard import router as dashboard_router
from app.routes.heatmap import router as heatmap_router
from app.routes.tracks import router as tracks_router
from app.routes.annotations import router as annotations_router
from app.routes.auth import router as auth_router
from app.routes.roi import router as roi_router
from app.routes.connector import router as connector_router
from app.routes.live import router as live_router


def seed_admin_user():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@olhovivo.ai").first()
        if not admin:
            db.add(
                User(
                    name="Engenheiro Chefe (CTO)",
                    email="admin@olhovivo.ai",
                    hashed_password=hash_password("admin123"),
                    role="GLOBAL_ADMIN",
                    company_id="comp-riual",
                    branch_id="RIUAL_027",
                    is_active=True,
                )
            )
            db.commit()
            print("✓ Usuário admin semeado com sucesso (admin@olhovivo.ai).")
    except Exception as e:
        db.rollback()
        print(f"Aviso ao semear admin: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Inicializar banco de dados e seed de admin
    try:
        create_database()
        seed_admin_user()
    except Exception as e:
        print(f"Erro ao inicializar banco no startup: {e}")
    yield
    # Shutdown
    pass


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

rate_limit_records = defaultdict(list)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    rate_limit_records[client_ip] = [
        t for t in rate_limit_records[client_ip] if now - t < 60
    ]
    
    if not request.url.path.startswith("/static") and not request.url.path.startswith("/live") and not client_ip.startswith("172."):
        if len(rate_limit_records[client_ip]) >= 120:
            return Response(
                content='{"detail": "Limite de requisições excedido. Tente novamente em 1 minuto."}',
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                media_type="application/json",
            )
    
    rate_limit_records[client_ip].append(now)
    response = await call_next(request)
    return response


# CORS Seguro
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Arquivos Estáticos
os.makedirs("static/snapshots", exist_ok=True)
os.makedirs("static/videos", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Incluir Routers
app.include_router(auth_router)
app.include_router(connector_router)
app.include_router(live_router)
app.include_router(events_router)
app.include_router(validation_router)
app.include_router(dataset_router)
app.include_router(statistics_router)
app.include_router(dashboard_router)
app.include_router(heatmap_router)
app.include_router(tracks_router)
app.include_router(annotations_router)
app.include_router(roi_router)


@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


@app.get("/health")
def health():
    return {"status": "ok"}

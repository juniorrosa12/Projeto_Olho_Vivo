import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Projeto Olho Vivo"
    VERSION: str = "1.0.0"
    
    # Banco de Dados
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL", 
        "postgresql://olhovivo:olhovivo123@postgres:5432/olhovivo"
    )
    
    # JWT & Autenticação
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "olhovivo-enterprise-secret-key-2026-very-secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()

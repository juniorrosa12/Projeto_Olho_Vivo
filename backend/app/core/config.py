import json
from typing import List, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Projeto Olho Vivo"
    VERSION: str = "1.0.0"
    
    # Banco de Dados
    DATABASE_URL: str = "postgresql://olhovivo:olhovivo123@postgres:5432/olhovivo"
    
    # JWT & Autenticação
    SECRET_KEY: str = "olhovivo-enterprise-secret-key-2026-very-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas
    
    # CORS - Usamos Any para impedir que pydantic-settings force json.loads prévio na env var
    CORS_ORIGINS: Any = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if not v.strip():
                return ["*"]
            if v.startswith("[") and v.endswith("]"):
                try:
                    res = json.loads(v)
                    if isinstance(res, list):
                        return [str(i) for i in res]
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return [str(i) for i in v]
        return ["*"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()

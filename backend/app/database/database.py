import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# URL Padrão: PostgreSQL definitivo conforme instrução do usuário
DEFAULT_DB_URL = "postgresql://olhovivo:olhovivo123@postgres:5432/olhovivo"
DATABASE_URL = os.environ.get("DATABASE_URL", DEFAULT_DB_URL)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """Dependency Injection para sessões SQLAlchemy no FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_database():
    """Garante a criação de todas as tabelas mapeadas nos models com autorrecuperação."""
    from app.models.event import Event
    from app.models.track import Track
    from app.models.validation import Validation
    from app.models.annotation import Annotation
    from app.models.dataset import Dataset
    from app.models.roi import ROIModel
    from app.models.user import User
    from app.models.connector import Connector, ConnectorTelemetry, ConnectorCommand

    max_retries = 10
    for attempt in range(1, max_retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            print("✓ Tabelas do banco de dados criadas/verificadas com sucesso.")
            break
        except Exception as e:
            if attempt == max_retries:
                print(f"❌ Erro fatal ao conectar no banco de dados após {max_retries} tentativas: {e}")
                raise e
            print(f"⏳ Aguardando banco de dados PostgreSQL iniciar (tentativa {attempt}/{max_retries})...")
            time.sleep(2)
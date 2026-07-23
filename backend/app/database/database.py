from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+psycopg2://olhovivo:olhovivo123@postgres:5432/olhovivo"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


# IMPORTAR TODOS OS MODELOS AQUI
from app.models.event import Event
from app.models.track import Track
from app.models.annotation import Annotation
from app.models.validation import Validation
from app.models.dataset import Dataset


def create_database():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./olhovivo.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def create_database():

    from app.models.event import Event
    from app.models.track import Track
    from app.models.validation import Validation
    from app.models.annotation import Annotation
    from app.models.dataset import Dataset

    Base.metadata.create_all(bind=engine)
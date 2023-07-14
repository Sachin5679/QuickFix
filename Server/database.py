
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Server.config import settings

URL = f"postgresql://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOST}/{settings.DATABASE_DATABASE}"
engine = create_engine(URL)

sessionlocal = sessionmaker(autoflush=False , autocommit=False , bind=engine)

def getdb():
    db = sessionlocal()

    try:
        yield db
    finally:
        db.close()

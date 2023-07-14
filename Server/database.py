
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Server.config import settings

URL = settings.DATABASE_URL
engine = create_engine(URL)

sessionlocal = sessionmaker(autoflush=False , autocommit=False , bind=engine)

def getdb():
    db = sessionlocal()

    try:
        yield db
    finally:
        db.close()

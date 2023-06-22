
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_HOST : str
    DATABASE_DATABASE : str
    DATABASE_USER : str
    DATABASE_PASSWORD : str
    SECRET_KEY : str
    ALGORITHM : str
    ACCESS_TOKEN_EXPIRE_DAYS : int
    MAIL_USERNAME : str
    MAIL_PASSWORD : str
    MAIL_FROM : str
    CLOUD_NAME : str
    API_KEY : str
    API_SECRET : str
    
    class Config:
        env_file = ".env"

settings = Settings()
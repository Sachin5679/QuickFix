
from pydantic import BaseSettings

class Settings(BaseSettings):
    DOMAIN : str
    DATABASE_URL : str
    SECRET_KEY : str
    ALGORITHM : str
    ACCESS_TOKEN_EXPIRE_MINUTES : int
    DELETE_EXPIRED_TOKEN_EVERY_MINUTES : int
    MAIL_USERNAME : str
    MAIL_PASSWORD : str
    MAIL_FROM : str
    CLOUD_NAME : str
    API_KEY : str
    API_SECRET : str
    OTP_EXPIRE_MINUTES : int
    CHANGE_PASSWORD_TOKEN_EXPIRE_MINUTES : int
    
    class Config:
        env_file = ".env"

settings = Settings()
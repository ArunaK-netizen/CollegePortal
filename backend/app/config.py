from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: Optional[str] = "redis://localhost:6379"

    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: str = "noreply@college.edu"
    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587

    FRONTEND_URL: str = "http://localhost:3000"
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    ENVIRONMENT: str = "development"

    class Config:
        env_file = str(env_path)  # full path to .env

settings = Settings()

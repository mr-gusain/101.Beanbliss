from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    PORT: int = 8000
    MYSQL_URL: str
    JWT_SECRET: str
    NODE_ENV: str = "development"
    STRIPE_SECRET_KEY: str
    OPENAI_API_KEY: str
    
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

@lru_cache()
def get_settings():
    return Settings()

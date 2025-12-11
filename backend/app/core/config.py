import os

class Settings:
    PROJECT_NAME: str = "LiquidScan"
    PROJECT_VERSION: str = "2.0.0"
    API_PREFIX: str = ""
    ALLOWED_ORIGINS: list = ["*"]

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

settings = Settings()

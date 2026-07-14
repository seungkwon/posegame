from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Pose Memory Game API"
    database_url: str = "postgresql+psycopg://posegame:posegame@localhost:5432/posegame"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()

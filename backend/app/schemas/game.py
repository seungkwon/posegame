from datetime import datetime

from pydantic import BaseModel, Field


class GameResultCreate(BaseModel):
    user_id: str = Field(min_length=1, max_length=50)
    level: int = Field(ge=1, le=10)
    target_sequence: list[int]
    player_sequence: list[int]
    is_success: bool
    score: int = Field(ge=0)


class GameResultResponse(BaseModel):
    id: int
    user_id: str
    level: int
    target_sequence: list[int]
    player_sequence: list[int]
    is_success: bool
    score: int
    played_at: datetime


class GameResultListResponse(BaseModel):
    items: list[GameResultResponse]

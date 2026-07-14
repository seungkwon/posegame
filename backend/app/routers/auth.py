from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas.auth import LoginRequest, UserResponse
from ..services.game_results import get_or_create_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.user_id)
    return user

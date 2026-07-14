from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas.game import GameResultCreate, GameResultListResponse, GameResultResponse
from ..services.game_results import create_result, get_or_create_user, list_results

router = APIRouter(prefix="/games", tags=["games"])


@router.post("/results", response_model=GameResultResponse)
def save_result(payload: GameResultCreate, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.user_id)
    result = create_result(db, user, payload)
    return GameResultResponse(
        id=result.id,
        user_id=user.user_id,
        level=result.level,
        target_sequence=payload.target_sequence,
        player_sequence=payload.player_sequence,
        is_success=result.is_success,
        score=result.score,
        played_at=result.played_at,
    )


@router.get("/me/results", response_model=GameResultListResponse)
def get_my_results(user_id: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")

    user = get_or_create_user(db, user_id)
    return GameResultListResponse(items=list_results(db, user))

import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import GameResult, User
from ..schemas.game import GameResultResponse


def get_or_create_user(db: Session, raw_user_id: str) -> User:
    user_id = raw_user_id.strip()
    existing_user = db.scalar(select(User).where(User.user_id == user_id))
    if existing_user:
        return existing_user

    user = User(user_id=user_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_result(db: Session, user: User, payload) -> GameResult:
    result = GameResult(
        user_id=user.id,
        level=payload.level,
        target_sequence=json.dumps(payload.target_sequence),
        player_sequence=json.dumps(payload.player_sequence),
        is_success=payload.is_success,
        score=payload.score,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


def list_results(db: Session, user: User) -> list[GameResultResponse]:
    results = db.scalars(
        select(GameResult).where(GameResult.user_id == user.id).order_by(GameResult.played_at.desc())
    ).all()

    items = []
    for result in results:
        items.append(
            GameResultResponse(
                id=result.id,
                user_id=user.user_id,
                level=result.level,
                target_sequence=json.loads(result.target_sequence),
                player_sequence=json.loads(result.player_sequence),
                is_success=result.is_success,
                score=result.score,
                played_at=result.played_at,
            )
        )

    return items

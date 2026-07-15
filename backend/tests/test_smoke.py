import os
import tempfile
import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.main import app
import app.main as main_module
import app.routers.auth as auth_router
import app.routers.games as games_router


class ApiSmokeTest(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.database_path = os.path.join(self.tempdir.name, "smoke.db")
        self.database_url = f"sqlite+pysqlite:///{self.database_path}"
        self.engine = create_engine(
            self.database_url, connect_args={"check_same_thread": False}, future=True
        )
        self.SessionLocal = sessionmaker(
            bind=self.engine, autoflush=False, autocommit=False, future=True
        )

        Base.metadata.create_all(bind=self.engine)
        main_module.engine = self.engine

        def override_get_db():
            db = self.SessionLocal()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[auth_router.get_db] = override_get_db
        app.dependency_overrides[games_router.get_db] = override_get_db
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()
        self.tempdir.cleanup()

    def test_health_login_and_result_flow(self):
        health_response = self.client.get("/health")
        self.assertEqual(health_response.status_code, 200)
        self.assertEqual(health_response.json(), {"status": "ok"})

        login_response = self.client.post("/auth/login", json={"user_id": "smoke-player"})
        self.assertEqual(login_response.status_code, 200)
        login_payload = login_response.json()
        self.assertEqual(login_payload["user_id"], "smoke-player")

        save_response = self.client.post(
            "/games/results",
            json={
                "user_id": "smoke-player",
                "level": 3,
                "target_sequence": [1, 4, 2],
                "player_sequence": [1, 4, 2],
                "is_success": True,
                "score": 300,
            },
        )
        self.assertEqual(save_response.status_code, 200)
        save_payload = save_response.json()
        self.assertEqual(save_payload["level"], 3)
        self.assertTrue(save_payload["is_success"])

        history_response = self.client.get("/games/me/results", params={"user_id": "smoke-player"})
        self.assertEqual(history_response.status_code, 200)
        history_payload = history_response.json()
        self.assertEqual(len(history_payload["items"]), 1)
        self.assertEqual(history_payload["items"][0]["target_sequence"], [1, 4, 2])


if __name__ == "__main__":
    unittest.main()

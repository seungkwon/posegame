# Pose Memory Game

Browser-based pose sequence memory game.

Frontend uses React + Vite.
Backend uses FastAPI.
Persistence is PostgreSQL via Docker.

## Current scope

- ID-only login
- Level-based target sequence generation
- Target and player sequence comparison
- Result save API
- My page history view
- Webcam connection UI
- MediaPipe PoseLandmarker integration in browser
- Rule-based motion classification
- Canvas pose overlay
- Real-time FPS display

## Run

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Docker

```bash
docker compose up --build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Next steps

- Tune motion thresholds for real users
- Improve jump and squat stability
- Add richer stage presentation animations
- Add open resource attribution document

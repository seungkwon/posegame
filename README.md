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
- Open resource attribution document

## Run

### One-command verification

```powershell
./verify.ps1
```

Optional flags:

- `./verify.ps1 -FrontendOnly`
- `./verify.ps1 -BackendOnly`

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Backend smoke test

```bash
cd backend
py -3.9 -m unittest tests.test_smoke
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

### Frontend smoke test

```bash
cd frontend
npm run smoke
npm run build
```

## Next steps

- Tune motion thresholds for real users
- Improve jump and squat stability
- Add richer stage presentation animations

## Documents

- Open resource attribution: [`OPEN_SOURCE_ATTRIBUTION.md`](OPEN_SOURCE_ATTRIBUTION.md)
- Progress log: [`Progress.md`](Progress.md)

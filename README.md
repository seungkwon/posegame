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
py -3.9 -m venv .venv
.venv\Scripts\activate
py -3.9 -m pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Backend setup notes:

- `.env.example` is meant for direct local runs against `localhost:5432`
- `docker compose` overrides `DATABASE_URL` for the backend container and uses the `db` hostname instead
- Check [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md) if you want a step-by-step startup checklist

### Backend smoke test

```bash
cd backend
py -3.9 -m unittest tests.test_smoke
```

### Backend API quickstart

See [`API_QUICKSTART.md`](API_QUICKSTART.md) for the shortest local path to:

- start only the database
- launch the backend
- verify `/health`
- create a sample user
- save a sample result
- fetch history

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

### Frontend quickstart

See [`FRONTEND_QUICKSTART.md`](FRONTEND_QUICKSTART.md) for the fastest local path to:

- launch the UI
- connect the webcam
- confirm pose readiness
- run one sample round
- understand camera and input-gate status messages

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
- Developer bootstrap: [`BOOTSTRAP.md`](BOOTSTRAP.md)
- Setup checklist: [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md)
- API quickstart: [`API_QUICKSTART.md`](API_QUICKSTART.md)
- Frontend quickstart: [`FRONTEND_QUICKSTART.md`](FRONTEND_QUICKSTART.md)

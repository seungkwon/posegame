# Pose Memory Game

Browser-based pose sequence memory game.

Frontend uses React + Vite. Backend uses FastAPI. Persistence is PostgreSQL via Docker.

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

## Fast paths

### Full verification

```powershell
./verify.ps1
```

Optional flags:

- `./verify.ps1 -FrontendOnly`
- `./verify.ps1 -BackendOnly`

### Frontend dev server

```powershell
cd frontend
npm install
npm run dev
```

### Backend dev server

```powershell
cd backend
py -3.9 -m venv .venv
.venv\Scripts\activate
py -3.9 -m pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Backend smoke test

```powershell
cd backend
py -3.9 -m unittest tests.test_smoke
```

### Docker services

```powershell
docker compose up --build
```

## Doc map

- Start here for machine setup: [`BOOTSTRAP.md`](BOOTSTRAP.md)
- Use a step-by-step launch checklist: [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md)
- Validate backend manually: [`API_QUICKSTART.md`](API_QUICKSTART.md)
- Validate frontend and camera flow manually: [`FRONTEND_QUICKSTART.md`](FRONTEND_QUICKSTART.md)
- See attribution notes: [`OPEN_SOURCE_ATTRIBUTION.md`](OPEN_SOURCE_ATTRIBUTION.md)
- Track milestone history: [`Progress.md`](Progress.md)

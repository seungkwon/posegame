# Setup Checklist

Use this checklist when bringing up the project on a new machine or after resetting local tools.

## Backend API

- Confirm Python 3.9 is available with `py -3.9 --version`
- Create the backend virtual environment with `py -3.9 -m venv backend\.venv`
- Activate the virtual environment before installing backend packages
- Install backend dependencies with `py -3.9 -m pip install -r backend\requirements.txt`
- Copy `backend\.env.example` to `backend\.env`
- Confirm `DATABASE_URL` points to the intended PostgreSQL host
- If you run PostgreSQL locally, make sure port `5432` is available
- If you use Docker for the database only, start it with `docker compose up db -d`
- Start the backend from `backend` with `uvicorn app.main:app --reload`
- Confirm `http://localhost:8000/health` responds
- Optionally follow [`API_QUICKSTART.md`](API_QUICKSTART.md) for a full manual API flow

## Frontend

- Confirm Node.js is installed with `node --version`
- Install frontend dependencies with `npm install` inside `frontend`
- Start the frontend with `npm run dev`
- Confirm the app is reachable at `http://localhost:5173`
- Optionally follow [`FRONTEND_QUICKSTART.md`](FRONTEND_QUICKSTART.md) for webcam and sample-round checks

## Verification

- Run `powershell -ExecutionPolicy Bypass -File .\verify.ps1` from the repo root
- If only frontend changes were made, run `powershell -ExecutionPolicy Bypass -File .\verify.ps1 -FrontendOnly`
- If only backend changes were made, run `powershell -ExecutionPolicy Bypass -File .\verify.ps1 -BackendOnly`

## Notes

- Backend local verification is currently documented against Python 3.9
- The backend Docker image uses Python 3.13
- `backend\.env` is for direct local backend runs; the backend container gets its own `DATABASE_URL` from `docker-compose.yml`

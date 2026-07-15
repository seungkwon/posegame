# Setup Checklist

Use this checklist when bringing up the project on a new machine or after resetting your local tools.

## Backend API checklist

- Confirm Python 3.9 is available with `py -3.9 --version`
- Create the backend virtual environment with `py -3.9 -m venv backend\.venv`
- Activate the virtual environment before installing backend packages
- Install backend dependencies with `py -3.9 -m pip install -r backend\requirements.txt`
- Copy `backend\.env.example` to `backend\.env`
- Confirm `DATABASE_URL` points to your intended PostgreSQL host
- If you run PostgreSQL locally, make sure port `5432` is available
- If you use Docker for the database, start it with `docker compose up db -d`
- Start the backend with `uvicorn app.main:app --reload` from `backend`
- Confirm the API is reachable at `http://localhost:8000/health`

## Frontend checklist

- Confirm Node.js is installed with `node --version`
- Install frontend dependencies with `npm install` inside `frontend`
- Start the frontend with `npm run dev`
- Confirm the app is reachable at `http://localhost:5173`

## Verification checklist

- Run `powershell -ExecutionPolicy Bypass -File .\verify.ps1` from the repo root
- If only frontend changes were made, run `powershell -ExecutionPolicy Bypass -File .\verify.ps1 -FrontendOnly`
- If only backend changes were made, run `powershell -ExecutionPolicy Bypass -File .\verify.ps1 -BackendOnly`

## Notes

- Local backend verification is currently documented against Python 3.9 because that interpreter was used for smoke-test validation.
- The backend Docker image uses Python 3.13, so local interpreter choice and container runtime do not have to match exactly.
- `backend\.env` is for direct local backend runs. The `backend` service in `docker-compose.yml` injects its own `DATABASE_URL`.

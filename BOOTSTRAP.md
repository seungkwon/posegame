# Developer Bootstrap

Use this document to prepare a local machine before following the quickstarts.

## Document roles

- [`README.md`](README.md): shortest commands and doc map
- [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md): bring-up checklist
- [`API_QUICKSTART.md`](API_QUICKSTART.md): backend manual sanity check
- [`FRONTEND_QUICKSTART.md`](FRONTEND_QUICKSTART.md): frontend and camera sanity check
- [`DOCS_MAINTENANCE.md`](DOCS_MAINTENANCE.md): update boundaries for onboarding docs

## Recommended toolchain

- Windows PowerShell
- Node.js 22.x
- npm 10.x
- Python 3.9 for backend verification commands
- Python 3.13 may also be installed locally, but backend smoke-test commands were validated with Python 3.9

## Python note

Using `python` without a version selector may resolve to a different interpreter than the one where backend dependencies were installed. For consistent backend verification, prefer:

```powershell
py -3.9 -m unittest tests.test_smoke
```

## First-time setup

### Frontend

```powershell
cd frontend
npm install
```

### Backend

```powershell
cd backend
py -3.9 -m venv .venv
.venv\Scripts\activate
py -3.9 -m pip install -r requirements.txt
copy .env.example .env
```

After copying `.env`, verify that `DATABASE_URL` matches the PostgreSQL instance you intend to use for direct local backend runs.

## Common verification commands

### Full repo verification

```powershell
powershell -ExecutionPolicy Bypass -File .\verify.ps1
```

### Frontend only

```powershell
powershell -ExecutionPolicy Bypass -File .\verify.ps1 -FrontendOnly
```

### Backend only

```powershell
powershell -ExecutionPolicy Bypass -File .\verify.ps1 -BackendOnly
```

## Troubleshooting

- If backend imports fail with missing `fastapi` or `starlette`, reinstall requirements on the same Python version you use to run tests.
- If the backend cannot connect to PostgreSQL, compare `backend\.env` with `docker-compose.yml` and confirm the host matches your run mode.
- If `verify.ps1` is blocked by execution policy, run it with `powershell -ExecutionPolicy Bypass -File .\verify.ps1`.
- If the frontend loads but camera input never starts, re-check browser camera permission and confirm the full body is visible in frame.

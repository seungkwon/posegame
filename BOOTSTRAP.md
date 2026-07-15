# Developer Bootstrap

This document captures the local setup assumptions that were confirmed while adding smoke tests and verification scripts.

## Recommended toolchain

- Windows PowerShell
- Node.js 22.x
- npm 10.x
- Python 3.9 for backend verification commands
- Python 3.13 may also be installed on the machine, but the backend smoke test command is currently aligned to Python 3.9

## Why Python 3.9 is called out

The repository can coexist with multiple Python installations. During smoke-test setup, the backend verification flow was successfully validated with:

```powershell
py -3.9 -m unittest tests.test_smoke
```

Using `python` without a version selector may resolve to a different interpreter, which can make installed packages appear missing even when they exist for another Python version.

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
```

If you use a different interpreter for the virtual environment, keep the install and test commands on that same interpreter.

After creating the backend environment, copy `backend\.env.example` to `backend\.env` and verify that the local `DATABASE_URL` matches the PostgreSQL instance you intend to use.

## Common verification commands

### Full verification from repo root

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

### Direct backend smoke test

```powershell
cd backend
py -3.9 -m unittest tests.test_smoke
```

### Backend sanity check by hand

Follow [`API_QUICKSTART.md`](API_QUICKSTART.md) if you want to confirm the live API flow manually after the backend starts.

### Frontend sanity check by hand

Follow [`FRONTEND_QUICKSTART.md`](FRONTEND_QUICKSTART.md) if you want to confirm camera readiness and the first playable round manually.

## Troubleshooting

- If backend imports fail with missing `fastapi` or `starlette`, check that you installed requirements for the same Python version you are using to run tests.
- If the backend starts but cannot connect to PostgreSQL, compare `backend\.env` with `docker-compose.yml` and make sure you are using the correct host for your run mode.
- If `verify.ps1` is blocked by execution policy, run it with `powershell -ExecutionPolicy Bypass -File .\verify.ps1`.
- If frontend verification fails immediately, run `npm install` in `frontend` first.
- If the frontend loads but camera input never starts, re-check browser camera permission and confirm the full body is visible in frame.

# Repository Housekeeping

This note tracks small, low-risk cleanup work that improves maintainability without changing runtime behavior.

## Completed in this pass

- Simplified `.gitignore` to use generic Python cache rules instead of many path-specific entries.
- Added `backend/.env` to `.gitignore` so local backend secrets and machine-specific settings are less likely to be committed by accident.
- Added `frontend/.vite/` to `.gitignore` for local frontend cache cleanup.

## Low-risk future cleanup ideas

- If local setup stabilizes around a single Python version, align the backend Docker image and local quickstart notes to reduce version context switching.
- If the document set grows again, consider moving onboarding docs into a dedicated `docs/` directory while leaving `README.md` at the repo root.
- If frontend smoke coverage expands, consider adding a root wrapper command alias in addition to `verify.ps1` for non-PowerShell users.

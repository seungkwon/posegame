# Progress

## Milestone 5. UI copy cleanup and open resource attribution

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Replaced corrupted user-facing UI copy with stable English labels and status messages.
  - Added open resource policy data to the login screen.
  - Added `OPEN_SOURCE_ATTRIBUTION.md` and linked it from `README.md`.
  - Verified the frontend build with `npm run build`.

## Milestone 6. Improve jump and squat stability

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added short neutral-pose calibration before treating the baseline as ready.
  - Tightened jump detection to require straighter knees and coordinated shoulder, hip, and ankle lift.
  - Tightened squat detection to require deeper knee bend with less ankle drift.
  - Added a calibration status message in the game UI.
  - Verified the frontend build with `npm run build`.

## Milestone 7. Tune motion thresholds for real users

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Moved pose classification magic numbers into named per-motion threshold settings.
  - Slightly tightened lean confidence handling for left and right tilt detection.
  - Added live tuning diagnostics for baseline frames, knee angles, lean ratio, and confidence.
  - Exposed the threshold snapshot in the game UI to support playtest calibration.
  - Verified the frontend build with `npm run build`.

## Milestone 8. Improve consistency of neutral resets and repeated inputs

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added an explicit neutral-reset gate after accepted motions to reduce accidental duplicate inputs.
  - Required a short stable neutral hold before unlocking the next action.
  - Exposed the input-gate state in the gameplay status panel.
  - Verified the frontend build with `npm run build`.

## Milestone 9. Add backend and frontend smoke-test coverage

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added a backend API smoke test covering health, login, result save, and history fetch flow.
  - Added a frontend smoke script covering sequence helpers and a basic pose-classifier path.
  - Documented the smoke-test commands in `README.md`.
  - Verified `npm run smoke`, `npm run build`, and `py -3.9 -m unittest tests.test_smoke`.

## Milestone 10. Add a one-command verification workflow

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added a top-level `verify.ps1` script that runs frontend smoke checks, frontend build, and backend smoke tests.
  - Added `-FrontendOnly` and `-BackendOnly` options for narrower verification runs.
  - Updated `README.md` to document the one-command workflow and the Python 3.9 backend test command.
  - Verified the full root command with `powershell -ExecutionPolicy Bypass -File .\verify.ps1`.

## Milestone 11. Add developer environment bootstrap notes

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added `BOOTSTRAP.md` with recommended toolchain, first-time setup, verification commands, and troubleshooting notes.
  - Documented the Python 3.9 requirement for backend smoke-test consistency.
  - Updated `README.md` to link the bootstrap guide and align backend setup commands with the tested interpreter.

## Milestone 12. Add API environment example and setup checklist

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Expanded `backend/.env.example` with `APP_NAME` and clear notes about local versus Docker database usage.
  - Added `SETUP_CHECKLIST.md` covering backend, frontend, and verification startup steps.
  - Updated `README.md` and `BOOTSTRAP.md` to link the new checklist and clarify `.env` expectations.

## Milestone 13. Add backend health and local API quickstart notes

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added `API_QUICKSTART.md` with a short local backend sanity-check flow covering database startup, `/health`, login, result save, and history fetch.
  - Updated `README.md`, `SETUP_CHECKLIST.md`, and `BOOTSTRAP.md` to link the quickstart in the right onboarding spots.
  - Clarified the fastest manual path to confirm backend health after local startup.

## Milestone 14. Add frontend local quickstart and camera readiness notes

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added `FRONTEND_QUICKSTART.md` with a short flow for local UI startup, camera connection, pose readiness, and one sample round.
  - Documented camera permission expectations, localhost behavior, and input-gate status cues.
  - Updated `README.md`, `SETUP_CHECKLIST.md`, and `BOOTSTRAP.md` to link the frontend quickstart in onboarding paths.

## Milestone 15. Review and consolidate onboarding docs

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Simplified `README.md` into a short entrypoint with fast commands and a documentation map.
  - Refocused `BOOTSTRAP.md` on environment preparation and shared verification context.
  - Trimmed `SETUP_CHECKLIST.md` into a clearer launch checklist with fewer repeated explanations.

## Milestone 16. Add doc maintenance notes for future contributors

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Added `DOCS_MAINTENANCE.md` to define the role and boundaries of each onboarding document.
  - Linked the maintenance guide from `README.md` and `BOOTSTRAP.md`.
  - Documented simple update rules to reduce future duplication and drift.

## Milestone 17. Review remaining project docs for encoding and consistency

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Replaced the hard-to-read legacy `요구사항.md` with a clean UTF-8 requirements document aligned to the current implementation.
  - Replaced the unreadable legacy `계획.md` with a clearer project plan and implementation summary.
  - Preserved the same high-level intent while making both files maintainable for future updates.

## Milestone 18. Normalize revision and legacy note docs

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Rewrote `revision.md` into a cleaner phase-based summary that matches the current implementation history.
  - Made `Progress.md` the explicit detailed milestone source of truth and `revision.md` the compact companion log.
  - Reduced the remaining dependency on encoding-sensitive legacy note viewing.

## Milestone 19. Review repository housekeeping opportunities

- Status: Completed
- Date: 2026-07-15
- Summary:
  - Simplified `.gitignore` with broader cache and local-environment rules.
  - Added `backend/.env` and `frontend/.vite/` to ignored local artifacts.
  - Added `REPO_HOUSEKEEPING.md` to record the cleanup that landed and a short low-risk future backlog.

## Next milestone

- Milestone 20. Decide whether to stop or define a new product-facing milestone set
- Goal:
  - Confirm whether the remaining work should stay in repository-maintenance mode or return to gameplay/product improvements.
  - Leave a clean handoff point for the next development cycle.

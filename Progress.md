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

## Next milestone

- Milestone 9. Add backend and frontend smoke-test coverage
- Goal:
  - Add lightweight automated checks for game flow and API contract regressions.
  - Make milestone verification less dependent on manual browser checks.

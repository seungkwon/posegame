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

## Next milestone

- Milestone 7. Tune motion thresholds for real users
- Goal:
  - Adjust per-motion confidence and threshold values based on live play feedback.
  - Improve consistency across arm raises, leans, and neutral resets.

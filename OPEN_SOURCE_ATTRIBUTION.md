# Open Resource Attribution

This project currently ships with first-party application code and third-party runtime packages installed through `npm` and `pip`.

## Asset policy

- Only assets with a clear open license should be added to the game UI, audio, or stage art.
- Candidate sources tracked during development are listed below so future additions have a documented approval path.

## Candidate asset sources

| Resource | License | Planned use |
| --- | --- | --- |
| Lucide Icons | ISC | UI icons for navigation, status, and utility actions |
| Google Fonts | OFL or Apache-2.0 by family | Optional typography upgrades |
| OpenGameArt | Varies by asset | Optional sound effects, stage art, and decorative assets |

## Runtime libraries already in use

- Frontend: React, Vite, MediaPipe Tasks Vision
- Backend: FastAPI, SQLAlchemy, PostgreSQL driver stack

## Notes

- Before adding any external art, audio, font, or illustration, confirm the exact asset license and attribution requirement.
- If a resource requires attribution, update this document with the asset name, source URL, license, and where it is used in the app.

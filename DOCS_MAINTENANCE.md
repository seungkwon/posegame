# Documentation Maintenance Notes

Use this guide when adding or updating onboarding documentation so the docs stay compact and non-overlapping.

## Document ownership

- [`README.md`](README.md)
  Purpose: landing page, fastest commands, documentation map
  Avoid: long troubleshooting sections or detailed walkthroughs

- [`BOOTSTRAP.md`](BOOTSTRAP.md)
  Purpose: local machine preparation, toolchain assumptions, shared prerequisites
  Avoid: step-by-step app walkthroughs that belong in quickstarts

- [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md)
  Purpose: concise bring-up checklist for backend, frontend, and verification
  Avoid: repeating long explanations that are already covered elsewhere

- [`API_QUICKSTART.md`](API_QUICKSTART.md)
  Purpose: shortest manual backend sanity-check flow
  Avoid: full environment setup guidance

- [`FRONTEND_QUICKSTART.md`](FRONTEND_QUICKSTART.md)
  Purpose: shortest manual frontend and webcam sanity-check flow
  Avoid: generic Node setup notes already covered by bootstrap or checklist

- [`Progress.md`](Progress.md)
  Purpose: milestone log and next milestone handoff
  Avoid: general product documentation

## Update rules

- Prefer editing the single most appropriate document instead of copying the same note into multiple files.
- If a new topic needs both a short mention and a deep explanation, put the short mention in `README.md` and the details in the specialist document.
- Keep commands in `README.md` minimal and stable.
- Keep checklist bullets action-oriented.
- Keep quickstarts runnable from top to bottom without side commentary unless the note prevents a common failure.

## When to add a new document

Create a new onboarding doc only if all of these are true:

- The topic has a distinct user goal
- The steps are long enough to distract from the existing document
- Linking out is clearer than expanding an existing section

## When to update Progress

- Add one completed entry per milestone
- Keep the summary to the concrete work that landed
- Keep exactly one next milestone section at the bottom

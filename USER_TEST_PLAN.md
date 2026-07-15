# User Test Plan

This document is the handoff point for the next development cycle: real user testing.

## Goal

Validate whether first-time players can:

- understand the game flow without explanation
- connect the camera successfully
- recognize when pose detection is ready
- complete at least one round without confusion
- understand success or failure feedback

## Recommended test group

- 3 to 5 first-time users
- At least 1 user who is not familiar with pose or webcam-based games
- At least 1 user on a lower-confidence setup such as a laptop webcam or limited play space

## Test environment

- Frontend running locally or from a stable preview build
- Backend running with result save enabled
- Good lighting and enough distance for full-body framing
- A browser with camera permission available

## Moderator checklist

- Confirm the app is open and the backend is reachable
- Confirm the webcam works before the session starts
- Avoid explaining the UI unless the test script explicitly asks for help
- Record where the participant hesitates or asks questions
- Capture whether the issue is understanding, camera setup, or pose detection stability

## Test script

### Task 1. Start the game

Ask the participant to:

- log in with any player ID
- describe what they think the game is asking them to do

Observe:

- whether the login step feels obvious
- whether the landing copy explains the game clearly enough

### Task 2. Connect the camera

Ask the participant to:

- connect the camera
- tell you when they believe the app is ready

Observe:

- whether camera permission is understood
- whether readiness messages are clear
- whether the participant knows how to adjust their position in frame

### Task 3. Complete one round

Ask the participant to:

- watch the preview
- perform the sequence
- explain what they think went right or wrong

Observe:

- whether preview and countdown feel understandable
- whether pose feedback helps the participant recover from errors
- whether neutral reset behavior feels natural

### Task 4. View history

Ask the participant to:

- open the history screen
- explain what they think the saved data means

Observe:

- whether success/fail, level, and score are self-explanatory

## Metrics to capture

- Could the participant start without help?
- Could the participant connect the camera without help?
- Did the participant understand when the app was ready?
- Did the participant finish one round successfully?
- Number of times the participant became stuck
- Number of moderator interventions

## Suggested notes template

```text
Participant:
Device / Browser:
Lighting / Space:

Task 1 notes:
Task 2 notes:
Task 3 notes:
Task 4 notes:

Top confusion points:
Top pose-detection issues:
Suggested follow-up changes:
```

## Likely follow-up themes

- onboarding copy clarity
- camera readiness messaging
- motion threshold tuning
- stage pacing and feedback clarity
- history screen clarity

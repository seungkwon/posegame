# Frontend Quickstart

This quickstart is the shortest path to get the browser UI running and confirm that camera-based pose input is ready.

## 1. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

## 2. Log in with any player ID

Use a simple value such as:

```text
quickstart-player
```

Expected result:

- The game screen opens
- The top bar shows your player ID
- The main action button shows `Connect Camera`

## 3. Connect the camera

Click `Connect Camera` and allow browser camera access when prompted.

Expected result:

- The status message changes to `Camera connected. Stand in a neutral pose facing the camera.`
- The camera preview becomes live
- The status area starts updating pose state and confidence

## 4. Confirm pose readiness

Stand fully in frame facing the camera.

Healthy signs:

- `Pose state: Detected`
- `Neutral pose confirmed. You can enter the next move.`
- Baseline status in the tuning panel moves toward `ready`

If the app is still warming up, you may see:

- `Looking for a full body pose.`
- `Move fully into frame so the camera can see your body.`
- `Hold a neutral pose for a moment so jump and squat can calibrate.`

## 5. Start one round

Click `Start Round`.

Expected flow:

- The target sequence is previewed
- A short countdown appears
- The message switches to `Now perform the poses in order.`

## 6. Watch for input-gate readiness

During play, return to a neutral pose between actions.

Helpful status cues:

- `Input gate: Ready for next move`
- `Input gate: Return to neutral to unlock`

If the second message appears, pause briefly in a neutral standing pose before attempting the next motion.

## Camera readiness notes

- `localhost` is treated as a secure context in modern browsers, so camera access should work without HTTPS for local development.
- If the browser previously denied camera access, update site permissions and reload the page.
- Make sure no other app is exclusively locking the webcam.
- For best results, keep your full upper body and legs visible in frame.

## Manual fallback

If you only want to demo the flow without a camera, use the on-screen motion buttons under the camera panel.

## Troubleshooting

- If the preview stays blank, confirm camera permission was granted and reload the page.
- If MediaPipe does not seem to start, verify that the browser can access remote model assets and try again.
- If pose detection is unstable, step back so shoulders, hips, knees, and ankles all fit on screen.

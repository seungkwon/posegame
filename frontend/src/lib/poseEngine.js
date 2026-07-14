import { getMotionById, TARGET_FPS } from "./game";

const HOLD_TIME_MS = 350;

export function createPoseEngine(onStableMotion) {
  let activeMotionId = 0;
  let previousMotionId = 0;
  let stableSince = performance.now();
  let webcamStream = null;

  async function startCamera(videoElement) {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 960 },
        height: { ideal: 540 },
        frameRate: { ideal: TARGET_FPS, max: 15 }
      },
      audio: false
    });

    videoElement.srcObject = webcamStream;
    await videoElement.play();
  }

  function stopCamera() {
    webcamStream?.getTracks().forEach((track) => track.stop());
    webcamStream = null;
  }

  function pushDetectedMotion(motionId) {
    const now = performance.now();

    if (motionId !== previousMotionId) {
      previousMotionId = motionId;
      stableSince = now;
      return;
    }

    if (motionId === activeMotionId) {
      return;
    }

    if (now - stableSince >= HOLD_TIME_MS) {
      activeMotionId = motionId;
      onStableMotion({
        motionId,
        motion: getMotionById(motionId),
        detectedAt: now
      });
    }
  }

  return {
    startCamera,
    stopCamera,
    pushDetectedMotion
  };
}

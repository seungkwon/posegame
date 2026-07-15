import {
  DrawingUtils,
  FilesetResolver,
  PoseLandmarker
} from "@mediapipe/tasks-vision";
import { getMotionById, TARGET_FPS } from "./game";
import { createMotionClassifier } from "./poseClassifier";

const HOLD_TIME_MS = 350;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;
const LANDMARK_RADIUS = 4;
const MOTION_COOLDOWN_MS = 650;

const POSE_CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28]
];

let poseLandmarkerPromise = null;

async function getPoseLandmarker() {
  if (!poseLandmarkerPromise) {
    poseLandmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
      );

      return PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.6,
        minPosePresenceConfidence: 0.6,
        minTrackingConfidence: 0.6
      });
    })();
  }

  return poseLandmarkerPromise;
}

function clearCanvas(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas(canvas, videoElement) {
  if (!canvas || !videoElement?.videoWidth || !videoElement?.videoHeight) {
    return;
  }

  if (canvas.width !== videoElement.videoWidth || canvas.height !== videoElement.videoHeight) {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
  }
}

function drawPose(context, canvas, landmarks) {
  if (!landmarks?.length) {
    return;
  }

  const drawingUtils = new DrawingUtils(context);

  for (const [from, to] of POSE_CONNECTIONS) {
    const start = landmarks[from];
    const end = landmarks[to];

    if (!start || !end) {
      continue;
    }

    drawingUtils.drawLine(start, end, {
      color: "rgba(19, 138, 91, 0.9)",
      lineWidth: 3
    });
  }

  drawingUtils.drawLandmarks(landmarks, {
    color: "#ffce5d",
    fillColor: "#ffce5d",
    radius: LANDMARK_RADIUS
  });

  context.save();
  context.fillStyle = "rgba(19, 34, 56, 0.85)";
  context.fillRect(0, canvas.height - 40, 260, 40);
  context.restore();
}

export function createPoseEngine({ onStableMotion, onFrame }) {
  let activeMotionId = 0;
  let previousMotionId = 0;
  let stableSince = performance.now();
  let lastAcceptedAt = 0;
  let webcamStream = null;
  let animationFrameId = 0;
  let lastProcessedAt = 0;
  let lastFpsSampleAt = performance.now();
  let processedFrameCount = 0;
  let poseLandmarker = null;
  const classifier = createMotionClassifier();

  async function startCamera(videoElement, canvasElement) {
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
    poseLandmarker = await getPoseLandmarker();

    const context = canvasElement?.getContext("2d");

    const tick = () => {
      animationFrameId = window.requestAnimationFrame(tick);
      if (!poseLandmarker || videoElement.readyState < 2) {
        return;
      }

      const now = performance.now();
      if (now - lastProcessedAt < FRAME_INTERVAL_MS) {
        return;
      }

      lastProcessedAt = now;
      processedFrameCount += 1;

      if (context && canvasElement) {
        resizeCanvas(canvasElement, videoElement);
        clearCanvas(context, canvasElement);
      }

      const result = poseLandmarker.detectForVideo(videoElement, now);
      const landmarks = result.landmarks?.[0] ?? [];
      const classification = classifier.classify(landmarks);
      const requiredConfidence = classifier.motionConfidence[classification.motionId] ?? 0.7;
      const isConfident = classification.confidence >= requiredConfidence;

      if (context && canvasElement && classification.poseDetected) {
        drawPose(context, canvasElement, landmarks);
        context.save();
        context.fillStyle = "#ffffff";
        context.font = "600 16px Segoe UI";
        context.fillText(
          `Detected motion: ${getMotionById(classification.motionId).label}`,
          16,
          canvasElement.height - 14
        );
        context.restore();
      }

      if (classification.poseDetected && isConfident) {
        pushDetectedMotion(classification.motionId, now);
      }

      const elapsed = now - lastFpsSampleAt;
      let fps = TARGET_FPS;
      if (elapsed >= 1000) {
        fps = Math.round((processedFrameCount * 1000) / elapsed);
        processedFrameCount = 0;
        lastFpsSampleAt = now;
      }

      onFrame?.({
        fps,
        motionId: classification.motionId,
        poseDetected: classification.poseDetected,
        confidence: classification.confidence,
        requiredConfidence,
        status: classification.status,
        isConfident,
        diagnostics: classification.diagnostics
      });
    };

    tick();
  }

  function stopCamera() {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }

    webcamStream?.getTracks().forEach((track) => track.stop());
    webcamStream = null;
  }

  function pushDetectedMotion(motionId, now = performance.now()) {
    if (motionId !== 0 && now - lastAcceptedAt < MOTION_COOLDOWN_MS) {
      return;
    }

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
      if (motionId !== 0) {
        lastAcceptedAt = now;
      }
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

const LANDMARK = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
  nose: 0
};

const VISIBILITY_THRESHOLD = 0.55;
const BASELINE_NEUTRAL_FRAMES = 6;

export const MOTION_THRESHOLDS = {
  neutral: {
    kneeMinAngle: 145,
    leanLimitFactor: 0.12
  },
  arms: {
    wristLiftFactor: 0.16,
    elbowLiftFactor: 0.12
  },
  lean: {
    triggerFactor: 0.18,
    commitFactor: 0.2
  },
  jump: {
    kneeMinAngle: 150,
    leanLimitFactor: 0.18,
    shoulderLiftFactor: 0.1,
    hipLiftFactor: 0.16,
    ankleLiftFactor: 0.08
  },
  squat: {
    kneeMaxAngle: 118,
    hipDropFactor: 0.14,
    ankleDropFactor: 0.08,
    leanLimitFactor: 0.22
  }
};

const MOTION_CONFIDENCE = {
  0: 0.55,
  1: 0.78,
  2: 0.76,
  3: 0.76,
  4: 0.82,
  5: 0.7,
  6: 0.7,
  7: 0.88
};

function isVisible(point) {
  return point && (point.visibility ?? 1) >= VISIBILITY_THRESHOLD;
}

function angleDegrees(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAb = Math.hypot(ab.x, ab.y);
  const magCb = Math.hypot(cb.x, cb.y);

  if (magAb === 0 || magCb === 0) {
    return 180;
  }

  const cosine = Math.min(1, Math.max(-1, dot / (magAb * magCb)));
  return (Math.acos(cosine) * 180) / Math.PI;
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

function getCorePoints(landmarks) {
  const leftShoulder = landmarks[LANDMARK.leftShoulder];
  const rightShoulder = landmarks[LANDMARK.rightShoulder];
  const leftElbow = landmarks[LANDMARK.leftElbow];
  const rightElbow = landmarks[LANDMARK.rightElbow];
  const leftWrist = landmarks[LANDMARK.leftWrist];
  const rightWrist = landmarks[LANDMARK.rightWrist];
  const leftHip = landmarks[LANDMARK.leftHip];
  const rightHip = landmarks[LANDMARK.rightHip];
  const leftKnee = landmarks[LANDMARK.leftKnee];
  const rightKnee = landmarks[LANDMARK.rightKnee];
  const leftAnkle = landmarks[LANDMARK.leftAnkle];
  const rightAnkle = landmarks[LANDMARK.rightAnkle];
  const nose = landmarks[LANDMARK.nose];

  return {
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
    nose
  };
}

function allCoreVisible(points) {
  return Object.values(points).every(isVisible);
}

function updateBaseline(points, baselineState) {
  const shoulderCenter = midpoint(points.leftShoulder, points.rightShoulder);
  const hipCenter = midpoint(points.leftHip, points.rightHip);
  const ankleCenter = midpoint(points.leftAnkle, points.rightAnkle);
  const torsoHeight = Math.max(0.12, hipCenter.y - shoulderCenter.y);
  const alpha = baselineState.ready ? 0.1 : 0.2;

  baselineState.neutralFrames += 1;

  if (baselineState.neutralFrames === 1) {
    baselineState.hipY = hipCenter.y;
    baselineState.ankleY = ankleCenter.y;
    baselineState.shoulderY = shoulderCenter.y;
    baselineState.torsoHeight = torsoHeight;
  } else {
    baselineState.hipY = baselineState.hipY * (1 - alpha) + hipCenter.y * alpha;
    baselineState.ankleY = baselineState.ankleY * (1 - alpha) + ankleCenter.y * alpha;
    baselineState.shoulderY = baselineState.shoulderY * (1 - alpha) + shoulderCenter.y * alpha;
    baselineState.torsoHeight = baselineState.torsoHeight * (1 - alpha) + torsoHeight * alpha;
  }

  if (baselineState.neutralFrames >= BASELINE_NEUTRAL_FRAMES) {
    baselineState.ready = true;
  }
}

function resetNeutralFrames(baselineState) {
  baselineState.neutralFrames = 0;
}

function createDiagnostics({
  baselineState,
  leftKneeAngle,
  rightKneeAngle,
  leanOffset,
  shoulderWidth,
  confidence
}) {
  return {
    neutralFrames: baselineState.neutralFrames,
    baselineReady: baselineState.ready,
    leftKneeAngle,
    rightKneeAngle,
    leanRatio: shoulderWidth > 0 ? leanOffset / shoulderWidth : 0,
    confidence
  };
}

export function createMotionClassifier() {
  const baselineState = {
    ready: false,
    neutralFrames: 0,
    hipY: 0,
    ankleY: 0,
    shoulderY: 0,
    torsoHeight: 0
  };

  function classify(landmarks) {
    if (!landmarks?.length) {
      resetNeutralFrames(baselineState);
      return {
        motionId: 0,
        confidence: 0,
        landmarks: [],
        poseDetected: false,
        status: "no_pose",
        diagnostics: null
      };
    }

    const points = getCorePoints(landmarks);
    if (!allCoreVisible(points)) {
      resetNeutralFrames(baselineState);
      return {
        motionId: 0,
        confidence: 0.1,
        landmarks,
        poseDetected: false,
        status: "partial_pose",
        diagnostics: null
      };
    }

    const shoulderCenter = midpoint(points.leftShoulder, points.rightShoulder);
    const hipCenter = midpoint(points.leftHip, points.rightHip);
    const ankleCenter = midpoint(points.leftAnkle, points.rightAnkle);
    const shoulderWidth = Math.max(0.08, Math.abs(points.rightShoulder.x - points.leftShoulder.x));
    const torsoHeight = Math.max(0.12, hipCenter.y - shoulderCenter.y);
    const leftKneeAngle = angleDegrees(points.leftHip, points.leftKnee, points.leftAnkle);
    const rightKneeAngle = angleDegrees(points.rightHip, points.rightKnee, points.rightAnkle);
    const leftArmUp =
      points.leftWrist.y < points.leftShoulder.y - torsoHeight * MOTION_THRESHOLDS.arms.wristLiftFactor &&
      points.leftElbow.y < points.leftShoulder.y + torsoHeight * MOTION_THRESHOLDS.arms.elbowLiftFactor;
    const rightArmUp =
      points.rightWrist.y < points.rightShoulder.y - torsoHeight * MOTION_THRESHOLDS.arms.wristLiftFactor &&
      points.rightElbow.y < points.rightShoulder.y + torsoHeight * MOTION_THRESHOLDS.arms.elbowLiftFactor;
    const leanOffset = points.nose.x - hipCenter.x;
    const hipLift = baselineState.ready ? baselineState.hipY - hipCenter.y : 0;
    const ankleLift = baselineState.ready ? baselineState.ankleY - ankleCenter.y : 0;
    const shoulderLift = baselineState.ready ? baselineState.shoulderY - shoulderCenter.y : 0;
    const hipDrop = baselineState.ready ? hipCenter.y - baselineState.hipY : 0;
    const ankleDrop = baselineState.ready ? ankleCenter.y - baselineState.ankleY : 0;
    const likelyNeutral =
      !leftArmUp &&
      !rightArmUp &&
      leftKneeAngle > MOTION_THRESHOLDS.neutral.kneeMinAngle &&
      rightKneeAngle > MOTION_THRESHOLDS.neutral.kneeMinAngle &&
      Math.abs(leanOffset) < shoulderWidth * MOTION_THRESHOLDS.neutral.leanLimitFactor;

    if (likelyNeutral) {
      updateBaseline(points, baselineState);
    } else {
      resetNeutralFrames(baselineState);
    }

    const baselineCalibrated = baselineState.ready;
    const baselineProgress = baselineState.neutralFrames / BASELINE_NEUTRAL_FRAMES;
    const jumpReady =
      baselineCalibrated &&
      !leftArmUp &&
      !rightArmUp &&
      Math.abs(leanOffset) < shoulderWidth * MOTION_THRESHOLDS.jump.leanLimitFactor &&
      leftKneeAngle > MOTION_THRESHOLDS.jump.kneeMinAngle &&
      rightKneeAngle > MOTION_THRESHOLDS.jump.kneeMinAngle &&
      shoulderLift > baselineState.torsoHeight * MOTION_THRESHOLDS.jump.shoulderLiftFactor &&
      hipLift > baselineState.torsoHeight * MOTION_THRESHOLDS.jump.hipLiftFactor &&
      ankleLift > baselineState.torsoHeight * MOTION_THRESHOLDS.jump.ankleLiftFactor;
    const squatReady =
      !leftArmUp &&
      !rightArmUp &&
      leftKneeAngle < MOTION_THRESHOLDS.squat.kneeMaxAngle &&
      rightKneeAngle < MOTION_THRESHOLDS.squat.kneeMaxAngle &&
      (!baselineCalibrated ||
        (hipDrop > baselineState.torsoHeight * MOTION_THRESHOLDS.squat.hipDropFactor &&
          ankleDrop < baselineState.torsoHeight * MOTION_THRESHOLDS.squat.ankleDropFactor &&
          Math.abs(leanOffset) < shoulderWidth * MOTION_THRESHOLDS.squat.leanLimitFactor));
    const leanLeftReady = leanOffset < -shoulderWidth * MOTION_THRESHOLDS.lean.commitFactor;
    const leanRightReady = leanOffset > shoulderWidth * MOTION_THRESHOLDS.lean.commitFactor;

    if (jumpReady) {
      return {
        motionId: 7,
        confidence: 0.9,
        landmarks,
        poseDetected: true,
        status: "motion_ready",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence: 0.9
        })
      };
    }

    if (squatReady) {
      return {
        motionId: 4,
        confidence: 0.86,
        landmarks,
        poseDetected: true,
        status: "motion_ready",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence: 0.86
        })
      };
    }

    if (leftArmUp && rightArmUp) {
      return {
        motionId: 1,
        confidence: 0.88,
        landmarks,
        poseDetected: true,
        status: "motion_ready",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence: 0.88
        })
      };
    }

    if (leftArmUp && !rightArmUp) {
      return {
        motionId: 2,
        confidence: 0.82,
        landmarks,
        poseDetected: true,
        status: "motion_ready",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence: 0.82
        })
      };
    }

    if (rightArmUp && !leftArmUp) {
      return {
        motionId: 3,
        confidence: 0.82,
        landmarks,
        poseDetected: true,
        status: "motion_ready",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence: 0.82
        })
      };
    }

    if (leanLeftReady) {
      return {
        motionId: 5,
        confidence: 0.74,
        landmarks,
        poseDetected: true,
        status: "motion_ready",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence: 0.74
        })
      };
    }

    if (leanRightReady) {
      return {
        motionId: 6,
        confidence: 0.74,
        landmarks,
        poseDetected: true,
        status: "motion_ready",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence: 0.74
        })
      };
    }

    if (likelyNeutral && !baselineCalibrated) {
      const confidence = Math.max(0.45, baselineProgress);
      return {
        motionId: 0,
        confidence,
        landmarks,
        poseDetected: true,
        status: "calibrating",
        diagnostics: createDiagnostics({
          baselineState,
          leftKneeAngle,
          rightKneeAngle,
          leanOffset,
          shoulderWidth,
          confidence
        })
      };
    }

    const confidence = likelyNeutral ? 0.75 : 0.35;
    return {
      motionId: 0,
      confidence,
      landmarks,
      poseDetected: true,
      status: likelyNeutral ? "neutral_ready" : "holding",
      diagnostics: createDiagnostics({
        baselineState,
        leftKneeAngle,
        rightKneeAngle,
        leanOffset,
        shoulderWidth,
        confidence
      })
    };
  }

  return { classify, motionConfidence: MOTION_CONFIDENCE };
}

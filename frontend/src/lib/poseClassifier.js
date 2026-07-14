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
  const alpha = 0.1;

  if (!baselineState.ready) {
    baselineState.hipY = hipCenter.y;
    baselineState.ankleY = ankleCenter.y;
    baselineState.torsoHeight = torsoHeight;
    baselineState.ready = true;
    return;
  }

  baselineState.hipY = baselineState.hipY * (1 - alpha) + hipCenter.y * alpha;
  baselineState.ankleY = baselineState.ankleY * (1 - alpha) + ankleCenter.y * alpha;
  baselineState.torsoHeight = baselineState.torsoHeight * (1 - alpha) + torsoHeight * alpha;
}

export function createMotionClassifier() {
  const baselineState = {
    ready: false,
    hipY: 0,
    ankleY: 0,
    torsoHeight: 0
  };

  function classify(landmarks) {
    if (!landmarks?.length) {
      return {
        motionId: 0,
        confidence: 0,
        landmarks: [],
        poseDetected: false
      };
    }

    const points = getCorePoints(landmarks);
    if (!allCoreVisible(points)) {
      return {
        motionId: 0,
        confidence: 0.1,
        landmarks,
        poseDetected: false
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
      points.leftWrist.y < points.leftShoulder.y - torsoHeight * 0.18 &&
      points.leftElbow.y < points.leftShoulder.y + torsoHeight * 0.1;
    const rightArmUp =
      points.rightWrist.y < points.rightShoulder.y - torsoHeight * 0.18 &&
      points.rightElbow.y < points.rightShoulder.y + torsoHeight * 0.1;
    const leanOffset = points.nose.x - hipCenter.x;
    const hipLift = baselineState.ready ? baselineState.hipY - hipCenter.y : 0;
    const ankleLift = baselineState.ready ? baselineState.ankleY - ankleCenter.y : 0;
    const squatDepth = hipCenter.y - shoulderCenter.y;
    const likelyNeutral =
      !leftArmUp &&
      !rightArmUp &&
      leftKneeAngle > 145 &&
      rightKneeAngle > 145 &&
      Math.abs(leanOffset) < shoulderWidth * 0.12;

    if (likelyNeutral) {
      updateBaseline(points, baselineState);
    }

    if (
      baselineState.ready &&
      hipLift > baselineState.torsoHeight * 0.22 &&
      ankleLift > baselineState.torsoHeight * 0.12
    ) {
      return { motionId: 7, confidence: 0.9, landmarks, poseDetected: true };
    }

    if (
      leftKneeAngle < 125 &&
      rightKneeAngle < 125 &&
      squatDepth > torsoHeight * 0.95
    ) {
      return { motionId: 4, confidence: 0.85, landmarks, poseDetected: true };
    }

    if (leftArmUp && rightArmUp) {
      return { motionId: 1, confidence: 0.88, landmarks, poseDetected: true };
    }

    if (leftArmUp && !rightArmUp) {
      return { motionId: 2, confidence: 0.82, landmarks, poseDetected: true };
    }

    if (rightArmUp && !leftArmUp) {
      return { motionId: 3, confidence: 0.82, landmarks, poseDetected: true };
    }

    if (leanOffset < -shoulderWidth * 0.2) {
      return { motionId: 5, confidence: 0.72, landmarks, poseDetected: true };
    }

    if (leanOffset > shoulderWidth * 0.2) {
      return { motionId: 6, confidence: 0.72, landmarks, poseDetected: true };
    }

    return {
      motionId: 0,
      confidence: likelyNeutral ? 0.75 : 0.35,
      landmarks,
      poseDetected: true
    };
  }

  return { classify };
}

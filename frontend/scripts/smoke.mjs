import assert from "node:assert/strict";
import { buildScore, compareSequences, generateTargetSequence } from "../src/lib/game.js";
import { createMotionClassifier } from "../src/lib/poseClassifier.js";

function createLandmarks() {
  return Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    visibility: 1
  }));
}

function createNeutralPose() {
  const landmarks = createLandmarks();
  landmarks[0] = { x: 0.5, y: 0.16, visibility: 1 };
  landmarks[11] = { x: 0.44, y: 0.3, visibility: 1 };
  landmarks[12] = { x: 0.56, y: 0.3, visibility: 1 };
  landmarks[13] = { x: 0.43, y: 0.43, visibility: 1 };
  landmarks[14] = { x: 0.57, y: 0.43, visibility: 1 };
  landmarks[15] = { x: 0.42, y: 0.56, visibility: 1 };
  landmarks[16] = { x: 0.58, y: 0.56, visibility: 1 };
  landmarks[23] = { x: 0.46, y: 0.6, visibility: 1 };
  landmarks[24] = { x: 0.54, y: 0.6, visibility: 1 };
  landmarks[25] = { x: 0.46, y: 0.77, visibility: 1 };
  landmarks[26] = { x: 0.54, y: 0.77, visibility: 1 };
  landmarks[27] = { x: 0.46, y: 0.95, visibility: 1 };
  landmarks[28] = { x: 0.54, y: 0.95, visibility: 1 };
  return landmarks;
}

function createBothArmsUpPose() {
  const landmarks = createNeutralPose();
  landmarks[13] = { x: 0.43, y: 0.22, visibility: 1 };
  landmarks[14] = { x: 0.57, y: 0.22, visibility: 1 };
  landmarks[15] = { x: 0.42, y: 0.12, visibility: 1 };
  landmarks[16] = { x: 0.58, y: 0.12, visibility: 1 };
  return landmarks;
}

function runGameLogicChecks() {
  const sequence = generateTargetSequence(4);
  assert.equal(sequence.length, 5);
  assert.equal(compareSequences([1, 2, 3], [1, 2, 3]), true);
  assert.equal(compareSequences([1, 2, 3], [1, 3, 2]), false);
  assert.equal(buildScore(4, true), 400);
  assert.equal(buildScore(4, false), 60);
}

function runClassifierChecks() {
  const classifier = createMotionClassifier();
  let result = null;

  for (let index = 0; index < 6; index += 1) {
    result = classifier.classify(createNeutralPose());
  }

  assert.ok(result);
  assert.equal(result.motionId, 0);
  assert.equal(result.status, "neutral_ready");

  result = classifier.classify(createBothArmsUpPose());
  assert.equal(result.motionId, 1);
  assert.equal(result.poseDetected, true);
}

runGameLogicChecks();
runClassifierChecks();

console.log("frontend smoke checks passed");

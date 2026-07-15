export const MOTIONS = [
  { id: 0, key: "neutral", label: "Neutral", emoji: "N" },
  { id: 1, key: "both_arms_up", label: "Both Arms Up", emoji: "BA" },
  { id: 2, key: "left_arm_up", label: "Left Arm Up", emoji: "LA" },
  { id: 3, key: "right_arm_up", label: "Right Arm Up", emoji: "RA" },
  { id: 4, key: "squat", label: "Squat", emoji: "SQ" },
  { id: 5, key: "lean_left", label: "Lean Left", emoji: "LL" },
  { id: 6, key: "lean_right", label: "Lean Right", emoji: "LR" },
  { id: 7, key: "jump", label: "Jump", emoji: "JP" }
];

const PLAYABLE_MOTION_IDS = [1, 2, 3, 4, 5, 6, 7];

export const TARGET_FPS = 12;
export const MIN_FPS = 10;
export const CONFIRMATION_FRAMES = 4;

export function getLevelLength(level) {
  if (level <= 3) return level;
  if (level <= 6) return level + 1;
  return level + 2;
}

export function getMotionById(id) {
  return MOTIONS.find((motion) => motion.id === id) ?? MOTIONS[0];
}

export function generateTargetSequence(level) {
  const length = getLevelLength(level);
  const sequence = [];

  for (let index = 0; index < length; index += 1) {
    const motionId = PLAYABLE_MOTION_IDS[Math.floor(Math.random() * PLAYABLE_MOTION_IDS.length)];
    sequence.push(motionId);
  }

  return sequence;
}

export function compareSequences(targetSequence, playerSequence) {
  if (targetSequence.length !== playerSequence.length) {
    return false;
  }

  return targetSequence.every((motionId, index) => motionId === playerSequence[index]);
}

export function buildScore(level, success) {
  return success ? level * 100 : Math.max(10, level * 15);
}

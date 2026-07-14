export const MOTIONS = [
  { id: 0, key: "neutral", label: "기본 자세", emoji: "•" },
  { id: 1, key: "both_arms_up", label: "양팔 들기", emoji: "🙌" },
  { id: 2, key: "left_arm_up", label: "왼팔 들기", emoji: "🫲" },
  { id: 3, key: "right_arm_up", label: "오른팔 들기", emoji: "🫱" },
  { id: 4, key: "squat", label: "스쿼트", emoji: "⬇" },
  { id: 5, key: "lean_left", label: "왼쪽 기울기", emoji: "↙" },
  { id: 6, key: "lean_right", label: "오른쪽 기울기", emoji: "↘" },
  { id: 7, key: "jump", label: "점프", emoji: "⤴" }
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

import { useEffect, useRef, useState } from "react";
import {
  buildScore,
  compareSequences,
  CONFIRMATION_FRAMES,
  generateTargetSequence,
  getMotionById,
  MIN_FPS,
  MOTIONS,
  TARGET_FPS
} from "../lib/game";
import { createPoseEngine } from "../lib/poseEngine";

const PREVIEW_MOTION_MS = 1100;
const PREVIEW_GAP_MS = 250;
const COUNTDOWN_START = 3;

function SequenceChips({ title, sequence, activeIndex = -1, completedCount = 0 }) {
  return (
    <div className="sequence-block">
      <p className="sequence-title">{title}</p>
      <div className="sequence-list">
        {sequence.map((motionId, index) => {
          const motion = getMotionById(motionId);
          const classNames = [
            "sequence-chip",
            index === activeIndex ? "active" : "",
            index < completedCount ? "done" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <span className={classNames} key={`${title}-${index}-${motionId}`}>
              {motion.emoji} {motion.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function GameScreen({ user, onLogout, onSaveResult, onShowHistory }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const poseEngineRef = useRef(null);
  const phaseRef = useRef("ready");
  const targetLengthRef = useRef(0);
  const roundSequenceRef = useRef([]);
  const [level, setLevel] = useState(1);
  const [targetSequence, setTargetSequence] = useState(() => generateTargetSequence(1));
  const [playerSequence, setPlayerSequence] = useState([]);
  const [phase, setPhase] = useState("ready");
  const [detectedMotionId, setDetectedMotionId] = useState(0);
  const [message, setMessage] = useState("Connect the camera to begin.");
  const [fps, setFps] = useState(TARGET_FPS);
  const [cameraReady, setCameraReady] = useState(false);
  const [poseDetected, setPoseDetected] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [countdown, setCountdown] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState("no_pose");
  const [confidence, setConfidence] = useState(0);
  const [requiredConfidence, setRequiredConfidence] = useState(0);

  function describeDetectionStatus(status, isConfident) {
    if (status === "no_pose") return "Looking for a full body pose.";
    if (status === "partial_pose") return "Move fully into frame so the camera can see your body.";
    if (status === "neutral_ready") return "Neutral pose confirmed. You can enter the next move.";
    if (status === "holding") return "Hold the pose a little longer for a stable read.";
    if (status === "motion_ready" && !isConfident) return "Motion detected, but confidence is still building.";
    if (status === "motion_ready") return "Motion confirmed with stable confidence.";
    return "Checking pose status.";
  }

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    targetLengthRef.current = targetSequence.length;
  }, [targetSequence]);

  useEffect(() => {
    const engine = createPoseEngine({
      onStableMotion: ({ motionId }) => {
        setDetectedMotionId(motionId);
        if (phaseRef.current !== "playing") {
          return;
        }

        setPlayerSequence((current) => {
          if (motionId === 0) {
            return current;
          }

          if (current[current.length - 1] === motionId) {
            return current;
          }

          const next = [...current, motionId];
          return next.slice(0, targetLengthRef.current);
        });
      },
      onFrame: ({
        fps: nextFps,
        motionId,
        poseDetected: nextPoseDetected,
        confidence: nextConfidence,
        requiredConfidence: nextRequiredConfidence,
        status,
        isConfident
      }) => {
        setFps(nextFps);
        setPoseDetected(nextPoseDetected);
        setDetectedMotionId(motionId);
        setDetectionStatus(describeDetectionStatus(status, isConfident));
        setConfidence(nextConfidence);
        setRequiredConfidence(nextRequiredConfidence);
      }
    });

    poseEngineRef.current = engine;

    return () => {
      engine.stopCamera();
    };
  }, []);

  useEffect(() => {
    if (phase !== "preview") {
      return undefined;
    }

    const sequence = roundSequenceRef.current;
    setPreviewIndex(0);
    setMessage("Watch the target sequence and memorize it.");

    let currentIndex = 0;
    const intervalId = window.setInterval(() => {
      currentIndex += 1;
      if (currentIndex >= sequence.length) {
        window.clearInterval(intervalId);
        setPreviewIndex(-1);
        setCountdown(COUNTDOWN_START);
        setPhase("countdown");
        setMessage("Get ready. Input starts after the countdown.");
        return;
      }

      setPreviewIndex(currentIndex);
    }, PREVIEW_MOTION_MS + PREVIEW_GAP_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown") {
      return undefined;
    }

    if (countdown <= 0) {
      setPhase("playing");
      setMessage("Now perform the poses in order.");
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [countdown, phase]);

  useEffect(() => {
    if (playerSequence.length === 0 || playerSequence.length < targetSequence.length) {
      return;
    }

    const success = compareSequences(targetSequence, playerSequence);
    const score = buildScore(level, success);

    setPhase("result");
    setMessage(
      success
        ? "Correct sequence. You are ready for the next level."
        : "The sequence did not match. Try the round again."
    );

    onSaveResult({
      level,
      target_sequence: targetSequence,
      player_sequence: playerSequence,
      is_success: success,
      score
    });
  }, [level, onSaveResult, playerSequence, targetSequence]);

  async function handleCameraStart() {
    try {
      await poseEngineRef.current.startCamera(videoRef.current, overlayRef.current);
      setCameraReady(true);
      setMessage("Camera connected. Stand in a neutral pose facing the camera.");
    } catch (error) {
      setMessage("Check camera permission and MediaPipe loading state, then try again.");
    }
  }

  function startRound(nextLevel = level) {
    const nextSequence = generateTargetSequence(nextLevel);
    roundSequenceRef.current = nextSequence;
    setLevel(nextLevel);
    setTargetSequence(nextSequence);
    setPlayerSequence([]);
    setPreviewIndex(-1);
    setCountdown(0);
    setPhase("preview");
  }

  function goNextLevel() {
    startRound(Math.min(level + 1, 10));
  }

  function handleDemoMotionSelect(motionId) {
    poseEngineRef.current?.pushDetectedMotion(motionId);
  }

  return (
    <section className="game-layout">
      <div className="panel topbar">
        <div>
          <p className="eyebrow">Player</p>
          <h2>{user.user_id}</h2>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button" onClick={onShowHistory} type="button">
            History
          </button>
          <button className="ghost-button" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </div>

      <div className="game-grid">
        <section className="panel stage-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Stage</p>
              <h3>Level {level}</h3>
            </div>
            <div className={`fps-badge ${fps < MIN_FPS ? "warning" : ""}`}>Pose {fps} FPS</div>
          </div>

          <SequenceChips
            activeIndex={previewIndex}
            completedCount={phase === "playing" || phase === "result" ? playerSequence.length : 0}
            sequence={targetSequence}
            title="Target Sequence"
          />
          <SequenceChips
            completedCount={playerSequence.length}
            sequence={playerSequence}
            title="Player Sequence"
          />

          <div className="progress-row">
            <div className="progress-copy">
              <strong>
                Progress {playerSequence.length} / {targetSequence.length}
              </strong>
              <span>
                {phase === "preview"
                  ? "Preview"
                  : phase === "countdown"
                    ? "Countdown"
                    : phase === "result"
                      ? "Result"
                      : "Input"}
              </span>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${(playerSequence.length / Math.max(1, targetSequence.length)) * 100}%` }} />
            </div>
          </div>

          <div className={`status-banner phase-${phase}`}>
            <strong>{getMotionById(detectedMotionId).label}</strong>
            <span>{message}</span>
            <small>
              Confirmation target: {CONFIRMATION_FRAMES} stable frames / Pose state:{" "}
              {poseDetected ? "Detected" : "Waiting"}
            </small>
            <small>
              Status: {detectionStatus} / Confidence {confidence.toFixed(2)} / Threshold{" "}
              {requiredConfidence.toFixed(2)}
            </small>
          </div>

          {phase === "countdown" ? (
            <div className="countdown-card">
              <p>Ready</p>
              <strong>{countdown}</strong>
            </div>
          ) : null}

          <div className="action-row">
            {!cameraReady ? (
              <button onClick={handleCameraStart} type="button">
                Connect Camera
              </button>
            ) : (
              <button onClick={() => startRound(level)} type="button">
                Start Round
              </button>
            )}

            {phase === "result" ? (
              <button className="accent-button" onClick={goNextLevel} type="button">
                Next Level
              </button>
            ) : null}
          </div>
        </section>

        <section className="panel camera-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Camera</p>
              <h3>Live Pose Preview</h3>
            </div>
            <span className="tag">MediaPipe realtime tracking</span>
          </div>

          <div className="camera-stack">
            <video className="camera-view" muted playsInline ref={videoRef} />
            <canvas className="camera-overlay" ref={overlayRef} />
            {phase === "preview" && previewIndex >= 0 ? (
              <div className="preview-overlay">
                <span>Memorize</span>
                <strong>{getMotionById(targetSequence[previewIndex]).label}</strong>
              </div>
            ) : null}
          </div>

          <div className="demo-controls">
            <p>
              Detected motion is shown live. The buttons below are a manual fallback for quick tests
              or demos when you do not want to use the camera.
            </p>
            <div className="demo-grid">
              {MOTIONS.map((motion) => (
                <button key={motion.id} onClick={() => handleDemoMotionSelect(motion.id)} type="button">
                  {motion.emoji} {motion.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

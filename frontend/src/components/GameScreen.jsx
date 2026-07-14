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
  const [message, setMessage] = useState("카메라를 연결한 뒤 시작하세요.");
  const [fps, setFps] = useState(TARGET_FPS);
  const [cameraReady, setCameraReady] = useState(false);
  const [poseDetected, setPoseDetected] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [countdown, setCountdown] = useState(0);

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
      onFrame: ({ fps: nextFps, motionId, poseDetected: nextPoseDetected }) => {
        setFps(nextFps);
        setPoseDetected(nextPoseDetected);
        setDetectedMotionId(motionId);
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
    setMessage("목표 시퀀스를 잘 보고 기억하세요.");

    let currentIndex = 0;
    const intervalId = window.setInterval(() => {
      currentIndex += 1;
      if (currentIndex >= sequence.length) {
        window.clearInterval(intervalId);
        setPreviewIndex(-1);
        setCountdown(COUNTDOWN_START);
        setPhase("countdown");
        setMessage("곧 따라 하기 단계가 시작됩니다.");
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
      setMessage("이제 자세를 순서대로 따라 해보세요.");
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
    setMessage(success ? "정답입니다. 다음 레벨로 진행할 수 있어요." : "순서가 맞지 않았습니다. 다시 도전해보세요.");

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
      setMessage("카메라가 연결되었습니다. 정면에서 기본 자세를 먼저 잡아주세요.");
    } catch (error) {
      setMessage("카메라 권한 또는 MediaPipe 로딩 상태를 확인해주세요.");
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
            마이페이지
          </button>
          <button className="ghost-button" onClick={onLogout} type="button">
            로그아웃
          </button>
        </div>
      </div>

      <div className="game-grid">
        <section className="panel stage-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Stage</p>
              <h3>레벨 {level}</h3>
            </div>
            <div className={`fps-badge ${fps < MIN_FPS ? "warning" : ""}`}>Pose {fps} FPS</div>
          </div>

          <SequenceChips
            activeIndex={previewIndex}
            completedCount={phase === "playing" || phase === "result" ? playerSequence.length : 0}
            sequence={targetSequence}
            title="목표 시퀀스"
          />
          <SequenceChips completedCount={playerSequence.length} sequence={playerSequence} title="사용자 시퀀스" />

          <div className="progress-row">
            <div className="progress-copy">
              <strong>
                진행률 {playerSequence.length} / {targetSequence.length}
              </strong>
              <span>{phase === "preview" ? "보기 단계" : phase === "countdown" ? "준비 단계" : "입력 단계"}</span>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${(playerSequence.length / Math.max(1, targetSequence.length)) * 100}%` }} />
            </div>
          </div>

          <div className={`status-banner phase-${phase}`}>
            <strong>{getMotionById(detectedMotionId).label}</strong>
            <span>{message}</span>
            <small>
              동작 확정 기준: 약 {CONFIRMATION_FRAMES}프레임 유지 / 포즈 감지 상태:{" "}
              {poseDetected ? "정상" : "대기"}
            </small>
          </div>

          {phase === "countdown" ? (
            <div className="countdown-card">
              <p>준비</p>
              <strong>{countdown}</strong>
            </div>
          ) : null}

          <div className="action-row">
            {!cameraReady ? (
              <button onClick={handleCameraStart} type="button">
                카메라 연결
              </button>
            ) : (
              <button onClick={() => startRound(level)} type="button">
                라운드 시작
              </button>
            )}

            {phase === "result" ? (
              <button className="accent-button" onClick={goNextLevel} type="button">
                다음 레벨
              </button>
            ) : null}
          </div>
        </section>

        <section className="panel camera-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Camera</p>
              <h3>실시간 포즈 미리보기</h3>
            </div>
            <span className="tag">MediaPipe 실시간 추론</span>
          </div>

          <div className="camera-stack">
            <video className="camera-view" muted playsInline ref={videoRef} />
            <canvas className="camera-overlay" ref={overlayRef} />
            {phase === "preview" && previewIndex >= 0 ? (
              <div className="preview-overlay">
                <span>기억하기</span>
                <strong>{getMotionById(targetSequence[previewIndex]).label}</strong>
              </div>
            ) : null}
          </div>

          <div className="demo-controls">
            <p>
              MediaPipe 추론 결과를 화면에 바로 오버레이합니다. 아래 버튼은 테스트나 디버깅을 위한 수동 입력
              보조입니다.
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

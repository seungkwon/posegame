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

function SequenceChips({ title, sequence }) {
  return (
    <div className="sequence-block">
      <p className="sequence-title">{title}</p>
      <div className="sequence-list">
        {sequence.map((motionId, index) => {
          const motion = getMotionById(motionId);
          return (
            <span className="sequence-chip" key={`${title}-${index}-${motionId}`}>
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
  const poseEngineRef = useRef(null);
  const phaseRef = useRef("ready");
  const targetLengthRef = useRef(0);
  const [level, setLevel] = useState(1);
  const [targetSequence, setTargetSequence] = useState(() => generateTargetSequence(1));
  const [playerSequence, setPlayerSequence] = useState([]);
  const [phase, setPhase] = useState("ready");
  const [detectedMotionId, setDetectedMotionId] = useState(0);
  const [message, setMessage] = useState("카메라를 연결한 뒤 시작하세요.");
  const fps = TARGET_FPS;
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    targetLengthRef.current = targetSequence.length;
  }, [targetSequence]);

  useEffect(() => {
    const engine = createPoseEngine(({ motionId }) => {
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
    });

    poseEngineRef.current = engine;

    return () => {
      engine.stopCamera();
    };
  }, []);

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
      await poseEngineRef.current.startCamera(videoRef.current);
      setCameraReady(true);
      setMessage("카메라가 연결되었습니다. 시퀀스를 확인하고 플레이를 시작하세요.");
    } catch (error) {
      setMessage("카메라 권한을 확인해주세요.");
    }
  }

  function startRound(nextLevel = level) {
    setLevel(nextLevel);
    setTargetSequence(generateTargetSequence(nextLevel));
    setPlayerSequence([]);
    setPhase("playing");
    setMessage("자세를 차례대로 따라 해보세요.");
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

          <SequenceChips title="목표 시퀀스" sequence={targetSequence} />
          <SequenceChips title="사용자 시퀀스" sequence={playerSequence} />

          <div className={`status-banner phase-${phase}`}>
            <strong>{getMotionById(detectedMotionId).label}</strong>
            <span>{message}</span>
            <small>동작 확정 기준: 약 {CONFIRMATION_FRAMES}프레임 유지</small>
          </div>

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
            <span className="tag">MediaPipe 연결 지점</span>
          </div>

          <video className="camera-view" muted playsInline ref={videoRef} />

          <div className="demo-controls">
            <p>현재는 규칙 엔진과 화면을 먼저 구현했습니다. 아래 버튼으로 포즈 판정 흐름을 테스트할 수 있습니다.</p>
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

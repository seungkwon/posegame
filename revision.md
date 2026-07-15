# Revision Log

이 문서는 큰 구현 단계의 요약만 남기는 보조 로그입니다. 상세한 마일스톤 기록과 다음 작업 계획은 [`Progress.md`](Progress.md)를 기준으로 관리합니다.

## Phase 1. 기본 게임 골격

- 프론트엔드 React + Vite 구조 생성
- 백엔드 FastAPI 구조 생성
- PostgreSQL용 Docker Compose 추가
- ID 기반 로그인, 결과 저장, 기록 조회 기본 흐름 연결

## Phase 2. 포즈 추론과 판정

- 브라우저에서 MediaPipe PoseLandmarker 실시간 추론 연결
- 목표 FPS 12 기준의 추론 루프 구현
- 기본 자세, 팔 들기, 스쿼트, 좌우 기울기, 점프 규칙 기반 분류기 추가
- 포즈 랜드마크 오버레이와 실시간 FPS 표시 추가

## Phase 3. 플레이 경험 개선

- 목표 시퀀스 프리뷰 단계 추가
- 카운트다운 단계 추가
- 진행률 표시와 상태 메시지 개선
- 신뢰도, 기준값, 판정 상태 표시 추가

## Phase 4. 판정 안정화

- 동작별 최소 신뢰도 기준 추가
- 입력 쿨다운과 neutral reset gating 추가
- 점프/스쿼트 기준선 보정 강화
- threshold 설정 구조화와 실시간 tuning snapshot 추가

## Phase 5. 검증 체계와 문서화

- 프론트엔드 smoke test 추가
- 백엔드 API smoke test 추가
- 루트 검증 스크립트 `verify.ps1` 추가
- bootstrap, checklist, API quickstart, frontend quickstart 문서 추가
- onboarding 문서 역할 분리와 유지보수 가이드 추가
- 레거시 계획/요구사항 문서를 UTF-8 기준으로 재정리

## 운영 원칙

- 구현 단계의 상세 이력은 [`Progress.md`](Progress.md)에 누적한다.
- 온보딩 문서 수정 전에는 [`DOCS_MAINTENANCE.md`](DOCS_MAINTENANCE.md)를 확인한다.

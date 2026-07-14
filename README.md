# Pose Memory Game

브라우저에서 포즈 시퀀스를 기억하고 따라 하는 작업기억 게임입니다.  
프론트엔드는 React + Vite, 백엔드는 FastAPI, 저장소는 PostgreSQL(Docker) 기준으로 구성했습니다.

## 현재 구현 범위

- 아이디만으로 로그인
- 단계별 시퀀스 생성
- 목표 시퀀스와 사용자 시퀀스 비교
- 결과 저장 API
- 마이페이지 기록 조회
- 웹캠 연결 UI
- 포즈 엔진 연결 지점과 데모 입력 버튼

## 실행 방법

### 백엔드

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Docker DB 포함 실행

```bash
docker compose up --build
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

## 다음 구현 포인트

- MediaPipe 실제 추론 연결
- 관절 좌표 기반 동작 분류기 구현
- FPS 측정 및 저사양 대응
- 오픈 리소스 라이선스 문서 작성

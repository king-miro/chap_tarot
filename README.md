# 🔮 CHAP Tarot (챕 타로) - 개발자 인수인계 문서

> **기획/디자인:** [User Name]  
> **개발:** AI Assistant (Antigravity)  
> **최종 업데이트:** 2026-01-30

## 1. 프로젝트 개요
**CHAP Tarot**은 귀여운 픽셀 아트 스타일의 고양이 페르소나('타로미')가 진행하는 웹 기반 AI 타로 서비스입니다.
사용자는 고민을 선택하고 카드를 뽑아 타로 리딩을 받을 수 있으며, **몰입감 있는 오디오 경험(TTS)**을 제공하는 것이 핵심 기능입니다.

---

## 2. 기술 스택 (Tech Stack)

### Frontend
- **Framework:** React 19 + Vite
- **Language:** JavaScript (ES6+)
- **Styling:** CSS Modules (Pixel Art, Retro Style)
- **Deployment:** GitHub Pages (Static Hosting)

### Backend (Local Dev & Asset Generation)
- **Language:** Python 3.9+
- **Framework:** Flask (API Server)
- **AI Model:** Qwen2.5-TTS (Voice Design) - `Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign`
- **TTS Engine:** PyTorch (CPU Optimized for Mac)

---

## 3. 핵심 아키텍처 및 구현 로직

이 프로젝트는 **하이브리드 방식**으로 설계되었습니다.

### A. 배포 환경 (GitHub Pages - Static)
- **서버리스(Serverless):** GitHub Pages는 정적 호스팅만 가능하므로 Python 백엔드가 없습니다.
- **오디오 재생:** 미리 생성된 **정적 오디오 파일(167개)**을 사용합니다.
    - 위치: `public/audio/cards/` (카드 해석), `public/audio/ui/` (효과음)
    - 로직: `ResultView.jsx`와 `ChatInterface.jsx`에서 상황에 맞는 오디오 파일을 로드합니다.
- **카드 선택:** `App.jsx`에서 `import.meta.env.PROD` 환경 변수를 체크하여 **완전 랜덤** 카드를 뽑습니다.

### B. 로컬 개발 환경 (Localhost - Dynamic)
- **Frontend + Backend:** `npm run dev`와 `python server/app.py`를 동시에 실행합니다.
- **Dynamic TTS:** 사용자 이름(닉네임) 등 고정되지 않은 텍스트를 실시간으로 생성할 수 있습니다.
- **디버깅 모드:** 개발 편의를 위해 **컵(Cups) 카드 1~4번**만 고정적으로 나오도록 설정되어 있습니다 (`App.jsx`).

---

## 4. 폴더 구조 (Directory Structure)

```
chap_tarot/
├── .github/workflows/   # GitHub Actions 배포 스크립트 (deploy.yml)
├── public/              # 정적 파일 (배포 시 root로 복사됨)
│   └── audio/           # [중요] 생성된 오디오 에셋 (167개 파일)
│       ├── cards/       # 정방향/역방향 카드 해석 (major_0.wav, major_0_reversed.wav 등)
│       └── ui/          # 인트로, 셔플, 채팅 반응음
├── src/
│   ├── components/      # React 컴포넌트 (features/ layout/ common/)
│   │   ├── features/    # 핵심 기능 (TarotTable, ResultView, ChatInterface 등)
│   ├── hooks/           # 커스텀 훅 (useTTS.js - 오디오 재생 로직)
│   ├── utils/           # 유틸리티 (cardUtils.js, tarotScripts.js)
│   └── App.jsx          # 메인 로직 및 상태 관리
├── server/              # Python 백엔드 관련
│   ├── app.py           # Flask 서버 진입점
│   ├── tarot_data.py    # 타로 카드 해석 스크립트 데이터 (정방향/역방향)
│   └── generate_static_assets.py # [중요] 오디오 일괄 생성 스크립트
└── vite.config.js       # Vite 설정 (Proxy 설정 포함)
```

---

## 5. 실행 방법 (How to Run)

### Frontend (UI 개발)
```bash
npm install
npm run dev
# 접속: http://localhost:5173
```
> **참고:** 로컬 실행 시, 백엔드 서버가 없으면 TTS 기능(닉네임 부르기)만 제외하고 나머지는 정적 오디오로 정상 작동합니다.

### Backend (TTS 서버 & 오디오 생성)
```bash
# Python 가상환경 권장
pip install -r server/requirements.txt
python server/app.py
# 접속: http://localhost:5001
```

---

## 6. 유지보수 가이드 (Maintenance)

### Q. 타로 해석 대사나 텍스트를 바꾸고 싶어요.
1.  **데이터 수정:** `server/tarot_data.py` 파일에서 해당 카드의 텍스트를 수정합니다.
2.  **오디오 재생성:**
    - 백엔드 서버(`app.py`)가 실행 중이라면 끕니다.
    - 생성 스크립트를 실행합니다:
      ```bash
      cd server
      python generate_static_assets.py
      ```
    - 스크립트가 변경된 텍스트를 감지하여 새로운 `.wav` 파일을 `public/audio/`에 덮어씁니다.
3.  **배포:** 변경된 오디오 파일을 Git에 커밋하고 푸시하면 자동으로 배포됩니다.

### Q. 카드 선택 확률을 조작하고 싶어요.
- **로컬 디버그:** `src/App.jsx` 내 `onCardSelect` 함수에서 `debugCupIds` 배열을 수정하세요.
- **실제 배포:** `import.meta.env.DEV` 조건문 밖의 로직은 건드리지 않도록 주의하세요.

---

## 7. 배포 (Deployment)
- **GitHub Actions:** `main` 브랜치에 푸시(`push`)되면 `.github/workflows/deploy.yml`이 자동으로 실행됩니다.
- **빌드 과정:** `npm run build` -> `dist/` 폴더 생성 -> `gh-pages` 브랜치로 배포.
- **URL:** [https://king-miro.github.io/chap_tarot/](https://king-miro.github.io/chap_tarot/)

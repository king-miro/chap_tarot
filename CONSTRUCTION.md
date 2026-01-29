# CHAP Tarot 프로젝트 구성 및 개발 내역

## 1. 프로젝트 개요
**CHAP Tarot**은 픽셀 아트 스타일의 검은 고양이 캐릭터가 진행하는 AI 타로 점술 서비스입니다. 사용자는 고양이와 대화하며 타로 카드를 뽑고, AI가 해석해주는 운세를 확인할 수 있습니다.

## 2. 기술 스택 (Tech Stack)
### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: JavaScript (ES modules)
- **Styling**: Vanilla CSS (Global styles + Component-level scoped styles)

### Libraries
- `react`, `react-dom`: UI 라이브러리

## 3. 디자인 시스템 (Design System)
### 3.1 Color Palette
앱 전반에 걸쳐 신비로운 타로 분위기와 레트로한 감성을 전달하기 위해 다음 컬러 셋을 정의하여 사용합니다 (`src/styles/index.css`):
- **Deep Purple (`#2A0E3D`)**: 메인 배경색. 밤하늘과 우주를 상징하며 신비로운 분위기 조성.
- **Mystic Purple (`#9C27B0`)**: 주요 UI 요소 및 강조색 (Primary).
- **Golden Glow (`#FFD700`)**: 보조색 (Secondary). 타로 카드의 신성함과 중요 텍스트 강조.
- **Pale White (`#F8F8F8`)**: 기본 텍스트 색상. 가독성을 높임.
- **Lavender Mist (`#E6E6FA`)**: 은은한 발광 효과(Glow) 및 보조 텍스트.

### 3.2 Typography
픽셀 아트 테마에 맞춰 레트로한 비트맵 폰트를 사용합니다.
- **Main Font**: 'DungGeunMo' (한글/영문 지원 픽셀 폰트)
- **Fallback**: 'Press Start 2P', cursive

## 4. 프로젝트 구조 (Directory Structure)
주요 코드는 `src` 디렉토리 내에 기능별로 모듈화되어 있습니다.

```
src/
├── components/
│   ├── layout/          # 공통 레이아웃 컴포넌트
│   │   ├── MainLayout.jsx  # 전체 화면 래퍼
│   │   └── CatScene.jsx    # 고양이 캐릭터 및 말풍선 표시 영역
│   │   
│   └── features/        # 기능별 페이지/화면 단위 컴포넌트
│       ├── Onboarding.jsx    # 시작 화면 (사용자 이름 입력)
│       ├── CategorySelect.jsx # 고민 카테고리 선택
│       ├── TarotTable.jsx    # 카드 셔플 및 선택 인터랙션
│       ├── ResultView.jsx    # 타로 리딩 결과 화면
│       └── ChatInterface.jsx # 결과 후속 채팅 기능
│
├── styles/              # 추가 스타일 리소스
├── App.jsx              # 메인 상태 관리 및 라우팅 로직
├── main.jsx             # 앱 진입점 (Entry Point)
└── index.css            # 글로벌 스타일 정의
```

## 5. 핵심 개발 내용 및 아키텍처

### 5.1 상태 관리 (State Management)
별도의 전역 상태 관리 라이브러리(Redux, Recoil 등) 없이 `App.jsx`에서 `useState`를 사용하여 전체 애플리케이션의 상태를 관리하는 **Centralized State Machine** 패턴을 사용합니다.

- **gameState**: 앱의 현재 단계를 추적합니다.
  - `intro`: 시작 화면
  - `category`: 카테고리 선택
  - `shuffle`: 카드 섞기 연출
  - `select`: 카드 4장 선택
  - `reading`: 결과 분석 및 표시
  - `chat`: 챗봇과의 대화

### 5.2 컴포넌트 설계 (Component Design)
- **제어 역전 (Inversion of Control)**: 하위 컴포넌트(`Onboarding`, `CategorySelect` 등)는 UI 렌더링에 집중하며, 상태 변경이 필요할 때 상위 컴포넌트(`App.jsx`)로 이벤트를 전달(`onStart`, `onSelect` 등)합니다.
- **레이아웃 분리**: `CatScene`을 레이아웃 레벨에 배치하여 페이지가 전환되어도 고양이 캐릭터가 항상 유지되도록 설계되었습니다.

### 5.3 구현된 주요 기능
1. **온보딩 Process**: 사용자 이름을 입력받고 개인화된 경험 시작.
2. **타로 인터랙션**: 
   - 덱 셔플 애니메이션 및 카드 선택 UI 구현.
   - 최대 4장의 카드를 선택하는 로직 제어.
3. **결과 및 채팅**: 
   - 선택된 카드를 기반으로 결과 화면 표시.
   - AI와의 후속 대화를 위한 채팅 인터페이스 뼈대 구현 (콘솔 로그로 연결 확인).

## 6. 향후 개발/개선 포인트
- **AI API 연동**: 현재 더미 데이터 또는 콘솔 출력으로 되어 있는 부분을 실제 LLM API와 연동 필요.
- **반응형 디자인**: 모바일/데스크탑 뷰 최적화 (현재는 `MainLayout` 중심).
- **애니메이션 강화**: 픽셀 아트 감성을 살린 추가적인 CSS 애니메이션 적용.

# CLAUDE.md

이지스트렝스(근력학교) 운영용 비즈니스 대시보드. 콘텐츠 캘린더, 채널 분석, 구매 전환, 성과 랭킹, 회원 퍼널을 한 화면에서 관리하는 React SPA. 백엔드 없이 동작한다.

## 기술 스택

- React 19 + React Router 7 (`BrowserRouter`)
- Vite 8, `@vitejs/plugin-react`
- Tailwind CSS 4 (`@tailwindcss/vite` 플러그인 방식, PostCSS 설정 파일 없음)
- Recharts 3 (차트), Lucide React (아이콘), date-fns 4 (날짜)
- ESLint 9 (flat config)
- 백엔드/DB 없음. 데이터는 mock + localStorage.

## 자주 쓰는 명령어

```bash
npm run dev      # 개발 서버 (Vite)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint
```

테스트 프레임워크는 없다.

## 아키텍처 / 디렉터리

- `src/main.jsx` — 진입점. `StrictMode` + `BrowserRouter`로 `App` 렌더.
- `src/App.jsx` — 레이아웃(사이드바 + 모바일 토글) 및 라우트 정의. 네비게이션 항목은 상단 `navItems` 배열에서 관리. 페이지를 추가하려면 여기에 라우트 + nav 항목을 함께 등록한다. `/`는 `/dashboard`로 리다이렉트.
- `src/pages/` — 라우트별 페이지 (Dashboard, ContentCalendar, Analytics, Conversions, ContentRanking, MemberFunnel).
- `src/components/` — 공유 UI: `KpiCard`, `ChannelBadge`, `StatusBadge`.
- `src/data/` — mock 데이터 모듈. `mockData.js`가 핵심(채널 정의, KPI, 캘린더, 전환 퍼널 등). `contentRankingData.js`, `memberFunnelData.js`는 각 페이지 전용.
- `src/hooks/useLocalStorage.js` — `[value, setValue]` 반환. mock 데이터를 초기 시드로, 이후 변경분을 localStorage에 영속화하는 패턴.
- `docs/superpowers/plans/` — 기능 확장 구현 계획 문서.

### 데이터 / 상태 관리

- 전역 상태 라이브러리 없음. 상태는 컴포넌트 로컬 `useState` 또는 `useLocalStorage`.
- mock 데이터는 `src/data/*`에 있으며 대부분 모듈 로드 시점의 `new Date()` 기준으로 날짜를 동적 생성한다(`viewsTrend`, `scheduledContents` 등). 값 일부는 `Math.random()`으로 생성되어 새로고침마다 달라진다.
- localStorage 키는 페이지 간 공유되므로 변경 시 양쪽을 함께 확인:
  - `dashboard-contents` — Dashboard(읽기)와 ContentCalendar(읽기/쓰기, CRUD)가 공유.
  - `utm-links` — Conversions.
  - `revenue-goals` — Dashboard.

## 컨벤션 / 스타일

- 본문/라벨은 한국어, 식별자·키는 영어.
- 컴포넌트는 default export 함수 컴포넌트, 파일명 PascalCase.
- 스타일은 Tailwind 유틸리티 클래스 중심. 커스텀 토큰은 `src/index.css`의 `@theme`에 정의(`primary`, `border`, 채널 색상 `youtube/threads/instagram` 등) — 색상 추가 시 여기에 넣는다.
- 채널/상태 같은 enum류는 객체 맵으로 관리: `mockData.js`의 `CHANNELS`, `StatusBadge.jsx`의 `STATUS_MAP`. 새 채널/상태 추가 시 해당 맵을 갱신.
- ESLint: `no-unused-vars`가 error지만 대문자/언더스코어로 시작하는 식별자(`^[A-Z_]`)는 예외.

## 주의사항

- `vite.config.js`의 `base: '/businessdashboard_for_baek/'` — GitHub Pages 서브경로용. 다른 호스팅/경로로 배포하면 이 값을 반드시 수정해야 자원 로딩이 깨지지 않는다.
- 배포: `main` 브랜치 push 시 `.github/workflows/deploy.yml`이 `npm ci && npm run build` 후 `dist/`를 GitHub Pages로 배포.
- `README.md`는 Vite 기본 템플릿 내용이라 프로젝트 정보가 없다(참고하지 말 것).
- 시크릿/API 키 없음. mock 데이터의 URL·매출·UTM 값은 모두 가짜다. 실제 키를 추가하게 되면 절대 코드/데이터 파일에 하드코딩하지 말 것.
- `package.json`의 `name`은 `"10-----"`로 자동 생성된 값(의미 없음).
- 루트에 `package-lock 2.json` 중복 파일이 있다(불필요, `package-lock.json`이 정본).

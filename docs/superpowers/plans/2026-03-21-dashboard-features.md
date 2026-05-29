# 비즈니스 대시보드 기능 확장 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이지스트렝스 비즈니스 대시보드에 8개 기능을 추가하여 실제 사용 가능한 수준으로 만든다.

**Architecture:** localStorage 기반 데이터 영속화, 기존 mockData를 초기 시드 데이터로 활용하는 useLocalStorage 커스텀 훅 패턴. 새 페이지 2개 추가 (성과 랭킹, 회원 전환 퍼널), 기존 페이지 4개 수정.

**Tech Stack:** React 19, React Router 7, Recharts, Tailwind CSS 4, date-fns, Lucide React

---

## 파일 구조

### 새로 생성할 파일
- `src/hooks/useLocalStorage.js` — localStorage 읽기/쓰기 커스텀 훅
- `src/pages/ContentRanking.jsx` — 콘텐츠 성과 랭킹 페이지
- `src/pages/MemberFunnel.jsx` — 회원 전환 퍼널 페이지
- `src/data/memberFunnelData.js` — 회원 전환 퍼널 목업 데이터
- `src/data/contentRankingData.js` — 콘텐츠 성과 랭킹 목업 데이터

### 수정할 파일
- `src/App.jsx` — 새 라우트 2개 + 네비게이션 항목 추가
- `src/pages/ContentCalendar.jsx` — CRUD 기능 + 드래그앤드롭
- `src/pages/Dashboard.jsx` — 기간 필터 + 매출 목표 추적 위젯
- `src/pages/Analytics.jsx` — CSV 내보내기 버튼
- `src/pages/Conversions.jsx` — UTM 링크 localStorage 저장 + 클릭 추적 데이터
- `src/data/mockData.js` — 매출 목표 데이터 추가

---

### Task 1: useLocalStorage 커스텀 훅

**Files:**
- Create: `src/hooks/useLocalStorage.js`

- [ ] **Step 1: useLocalStorage 훅 작성**

```js
import { useState, useEffect } from 'react'

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* quota exceeded 등 무시 */ }
  }, [key, value])

  return [value, setValue]
}
```

- [ ] **Step 2: 브라우저에서 훅이 정상 동작하는지 확인**

`npm run dev`로 개발 서버 실행 후 콘솔에서 localStorage 확인

- [ ] **Step 3: 커밋**

```bash
git add src/hooks/useLocalStorage.js
git commit -m "feat: useLocalStorage 커스텀 훅 추가"
```

---

### Task 2: 콘텐츠 캘린더 CRUD (추가/수정/삭제)

**Files:**
- Modify: `src/pages/ContentCalendar.jsx`

현재 상태: 모달에서 "추가" 버튼 클릭 시 모달만 닫히고 데이터가 저장되지 않음.

- [ ] **Step 1: useLocalStorage로 콘텐츠 목록 상태 관리**

`scheduledContents`를 초기값으로 하는 localStorage 상태로 교체:
```js
const [contents, setContents] = useLocalStorage('dashboard-contents', scheduledContents)
```

- [ ] **Step 2: 콘텐츠 추가 기능 구현**

모달의 "추가" 버튼 onClick에서 새 콘텐츠를 contents에 추가:
```js
const handleAddContent = () => {
  if (!newContent.title.trim()) return
  const content = {
    ...newContent,
    id: Date.now(),
  }
  setContents(prev => [...prev, content])
  setNewContent({ title: '', channel: 'youtube', date: format(selectedDate, 'yyyy-MM-dd'), time: '12:00', type: '스레드', status: 'draft' })
  setShowModal(false)
}
```

- [ ] **Step 3: 콘텐츠 삭제 기능 추가**

각 콘텐츠 카드에 삭제 버튼 추가:
```js
const handleDelete = (id) => {
  setContents(prev => prev.filter(c => c.id !== id))
}
```

- [ ] **Step 4: 콘텐츠 수정 기능 추가**

콘텐츠 카드 클릭 시 편집 모달 열기. 기존 모달을 재활용하되 editingId 상태로 추가/수정 모드 구분:
```js
const [editingId, setEditingId] = useState(null)

const handleEdit = (content) => {
  setEditingId(content.id)
  setNewContent({ title: content.title, channel: content.channel, date: content.date, time: content.time, type: content.type, status: content.status })
  setShowModal(true)
}

const handleSave = () => {
  if (!newContent.title.trim()) return
  if (editingId) {
    setContents(prev => prev.map(c => c.id === editingId ? { ...c, ...newContent } : c))
  } else {
    setContents(prev => [...prev, { ...newContent, id: Date.now() }])
  }
  setEditingId(null)
  setNewContent({ title: '', channel: 'youtube', date: format(selectedDate, 'yyyy-MM-dd'), time: '12:00', type: '스레드', status: 'draft' })
  setShowModal(false)
}
```

- [ ] **Step 5: 상태 변경 셀렉트 추가**

모달에 status 셀렉트 필드 추가 (draft/scheduled/review/published)

- [ ] **Step 6: getContentsForDay가 localStorage 데이터를 사용하도록 변경**

기존 `scheduledContents` 직접 참조를 `contents` 상태로 교체

- [ ] **Step 7: 동작 확인 후 커밋**

```bash
git add src/pages/ContentCalendar.jsx
git commit -m "feat: 콘텐츠 캘린더 CRUD 기능 구현 (localStorage 저장)"
```

---

### Task 3: 드래그앤드롭 일정 변경

**Files:**
- Modify: `src/pages/ContentCalendar.jsx`

HTML5 드래그앤드롭 API 사용 (외부 라이브러리 없이 구현)

- [ ] **Step 1: 콘텐츠 항목에 draggable 속성 추가**

캘린더 그리드 내 콘텐츠 div에 `draggable`, `onDragStart` 추가:
```jsx
<div
  draggable
  onDragStart={(e) => {
    e.dataTransfer.setData('contentId', String(c.id))
    e.dataTransfer.effectAllowed = 'move'
  }}
  // ... 기존 스타일
>
```

- [ ] **Step 2: 날짜 셀에 드롭 핸들러 추가**

각 날짜 셀에 `onDragOver`, `onDrop` 이벤트:
```jsx
<div
  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
  onDrop={(e) => {
    e.preventDefault()
    const contentId = Number(e.dataTransfer.getData('contentId'))
    setContents(prev => prev.map(c =>
      c.id === contentId ? { ...c, date: format(day, 'yyyy-MM-dd') } : c
    ))
  }}
>
```

- [ ] **Step 3: 드래그 중 시각적 피드백 추가**

dragOver 상태를 관리하여 드래그 중인 셀 하이라이트:
```js
const [dragOverDate, setDragOverDate] = useState(null)
```

- [ ] **Step 4: 동작 확인 후 커밋**

```bash
git add src/pages/ContentCalendar.jsx
git commit -m "feat: 캘린더 드래그앤드롭 일정 변경 구현"
```

---

### Task 4: 대시보드 기간 필터

**Files:**
- Modify: `src/pages/Dashboard.jsx`
- Modify: `src/data/mockData.js`

현재 대시보드는 30일 고정. 7/14/30일 필터 추가.

- [ ] **Step 1: 기간 필터 UI 추가**

Analytics 페이지와 동일한 패턴의 기간 선택 버튼:
```jsx
const [period, setPeriod] = useState(30)
const PERIOD_OPTIONS = [
  { label: '7일', value: 7 },
  { label: '14일', value: 14 },
  { label: '30일', value: 30 },
]
```

- [ ] **Step 2: KPI 데이터를 기간별로 계산**

viewsTrend에서 선택된 기간만큼 slice하여 합산:
```js
const filteredTrend = viewsTrend.slice(-period)
const periodKpi = {
  totalViews: filteredTrend.reduce((s, d) => s + d.youtube + d.threads + d.instagram, 0),
  totalEngagement: Math.floor(filteredTrend.reduce((s, d) => s + d.youtube + d.threads + d.instagram, 0) * 0.069),
  conversionRate: 3.2 + (period === 7 ? 0.5 : period === 14 ? 0.2 : 0),
  revenue: Math.floor(filteredTrend.reduce((s, d) => s + d.youtube + d.threads + d.instagram, 0) * 22.1),
}
```

- [ ] **Step 3: 차트 제목을 기간에 따라 동적 표시**

```jsx
<h3>채널별 조회수 추이 ({period}일)</h3>
```

- [ ] **Step 4: 동작 확인 후 커밋**

```bash
git add src/pages/Dashboard.jsx
git commit -m "feat: 대시보드 기간 필터 (7/14/30일) 추가"
```

---

### Task 5: CSV 내보내기

**Files:**
- Modify: `src/pages/Analytics.jsx`
- Modify: `src/pages/Conversions.jsx`

- [ ] **Step 1: CSV 변환 유틸 함수 작성**

Analytics.jsx 내부에 인라인으로:
```js
const exportToCsv = (filename, headers, rows) => {
  const bom = '\uFEFF'
  const csv = bom + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

- [ ] **Step 2: Analytics 페이지에 내보내기 버튼 추가**

상단 헤더 영역에 "CSV 내보내기" 버튼. 클릭 시 viewsTrend 데이터 다운로드:
```js
const handleExportViews = () => {
  const headers = ['날짜', 'YouTube', 'Threads', 'Instagram']
  const rows = filteredTrend.map(d => [d.date, d.youtube, d.threads, d.instagram])
  exportToCsv(`채널분석_${period}일.csv`, headers, rows)
}
```

- [ ] **Step 3: Conversions 페이지에 상품별 전환 CSV 내보내기 추가**

```js
const handleExportProducts = () => {
  const headers = ['상품', '클릭', '구매', '전환율(%)', '매출(원)']
  const rows = productConversions.map(p => [p.name, p.clicks, p.conversions, p.rate, p.revenue])
  exportToCsv('상품별_전환.csv', headers, rows)
}
```

- [ ] **Step 4: 동작 확인 후 커밋**

```bash
git add src/pages/Analytics.jsx src/pages/Conversions.jsx
git commit -m "feat: 채널 분석/구매 전환 CSV 내보내기 기능 추가"
```

---

### Task 6: 매출 목표 추적

**Files:**
- Modify: `src/pages/Dashboard.jsx`
- Modify: `src/data/mockData.js`

대시보드에 월별 매출 목표 대비 달성률 위젯 추가.

- [ ] **Step 1: mockData에 매출 목표 데이터 추가**

```js
export const revenueGoals = [
  { month: '2026-01', goal: 3000000, actual: 2640000 },
  { month: '2026-02', goal: 3500000, actual: 3180000 },
  { month: '2026-03', goal: 4000000, actual: 2840000 },
]
```

- [ ] **Step 2: 대시보드에 목표 달성률 위젯 추가**

프로그레스 바와 목표/실적 수치를 표시하는 카드:
```jsx
const currentGoal = revenueGoals[revenueGoals.length - 1]
const achievementRate = ((currentGoal.actual / currentGoal.goal) * 100).toFixed(1)
```

프로그레스 바 UI + 월별 추이 미니 바 차트

- [ ] **Step 3: 목표 금액 수정 기능**

localStorage에 목표 금액 저장, 수정 가능한 인풋:
```js
const [goals, setGoals] = useLocalStorage('revenue-goals', revenueGoals)
```

- [ ] **Step 4: 동작 확인 후 커밋**

```bash
git add src/pages/Dashboard.jsx src/data/mockData.js
git commit -m "feat: 대시보드 매출 목표 추적 위젯 추가"
```

---

### Task 7: 콘텐츠 성과 랭킹 페이지

**Files:**
- Create: `src/data/contentRankingData.js`
- Create: `src/pages/ContentRanking.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: 콘텐츠 성과 목업 데이터 생성**

```js
// src/data/contentRankingData.js
export const contentPerformance = [
  { id: 1, title: '케틀벨 스윙 완벽 가이드', channel: 'youtube', type: '롱폼', views: 24500, likes: 1820, comments: 342, shares: 156, conversionRate: 4.2, date: '2026-03-01' },
  // ... 15~20개 콘텐츠
]
```

- [ ] **Step 2: ContentRanking 페이지 구현**

정렬 기준 선택 (조회수/참여율/전환율), 채널 필터, 테이블 + 바 차트:
- 상단: 필터 (채널, 정렬 기준)
- 중간: TOP 5 베스트/워스트 콘텐츠 카드
- 하단: 전체 콘텐츠 성과 테이블

- [ ] **Step 3: App.jsx에 라우트 및 네비게이션 추가**

```jsx
{ path: '/ranking', label: '성과 랭킹', icon: Trophy }
```

- [ ] **Step 4: 동작 확인 후 커밋**

```bash
git add src/data/contentRankingData.js src/pages/ContentRanking.jsx src/App.jsx
git commit -m "feat: 콘텐츠 성과 랭킹 페이지 추가"
```

---

### Task 8: UTM 링크 클릭 추적 (localStorage)

**Files:**
- Modify: `src/pages/Conversions.jsx`

현재 UTM 링크가 mockData에 하드코딩. localStorage로 관리하고 생성한 링크도 저장.

- [ ] **Step 1: UTM 링크를 localStorage로 관리**

```js
const [links, setLinks] = useLocalStorage('utm-links', utmLinks)
```

- [ ] **Step 2: UTM 생성기에서 생성한 링크를 저장**

생성 버튼 추가, 클릭 시 links에 추가:
```js
const handleCreateLink = () => {
  const newLink = {
    id: Date.now(),
    name: `${form.campaign} - ${form.source}`,
    url: form.url,
    utm_source: form.source,
    utm_medium: form.medium,
    utm_campaign: form.campaign,
    clicks: 0,
    conversions: 0,
    created: format(new Date(), 'yyyy-MM-dd'),
  }
  setLinks(prev => [...prev, newLink])
}
```

- [ ] **Step 3: UTM 링크 삭제 기능**

각 링크에 삭제 버튼 추가

- [ ] **Step 4: 동작 확인 후 커밋**

```bash
git add src/pages/Conversions.jsx
git commit -m "feat: UTM 링크 생성/삭제 및 localStorage 저장"
```

---

### Task 9: 회원 전환 퍼널 페이지

**Files:**
- Create: `src/data/memberFunnelData.js`
- Create: `src/pages/MemberFunnel.jsx`
- Modify: `src/App.jsx`

콘텐츠 조회 → 문의 → 체험 → 등록 단계별 추적 페이지.

- [ ] **Step 1: 회원 전환 퍼널 목업 데이터 생성**

```js
// src/data/memberFunnelData.js
export const memberFunnel = [
  { stage: '콘텐츠 조회', count: 128430 },
  { stage: 'DM/문의', count: 342 },
  { stage: '체험 예약', count: 156 },
  { stage: '체험 완료', count: 128 },
  { stage: '회원 등록', count: 89 },
]

export const monthlyRegistrations = [
  { month: '2025-10', inquiries: 28, trials: 12, registrations: 8 },
  { month: '2025-11', inquiries: 35, trials: 18, registrations: 12 },
  // ... 6개월
]

export const channelAttribution = [
  { channel: 'youtube', inquiries: 156, registrations: 42 },
  { channel: 'threads', inquiries: 98, registrations: 24 },
  { channel: 'instagram', inquiries: 88, registrations: 23 },
]
```

- [ ] **Step 2: MemberFunnel 페이지 구현**

3개 섹션:
- 퍼널 시각화 (Conversions 페이지와 유사한 스타일)
- 월별 등록 추이 차트 (BarChart)
- 채널별 기여도 (어떤 채널에서 회원이 가장 많이 오는지)

- [ ] **Step 3: App.jsx에 라우트 및 네비게이션 추가**

```jsx
{ path: '/funnel', label: '회원 전환', icon: Users }
```

- [ ] **Step 4: 동작 확인 후 커밋**

```bash
git add src/data/memberFunnelData.js src/pages/MemberFunnel.jsx src/App.jsx
git commit -m "feat: 회원 전환 퍼널 페이지 추가"
```

---

### Task 10: 최종 통합 및 정리

- [ ] **Step 1: 전체 페이지 동작 확인**

모든 페이지 간 네비게이션, localStorage 데이터 영속성, 차트 렌더링 확인

- [ ] **Step 2: Dashboard에서 캘린더 데이터 연동**

Dashboard의 "예정된 콘텐츠"가 localStorage의 콘텐츠를 참조하도록 수정

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

- [ ] **Step 4: 최종 커밋 및 푸시**

```bash
git add -A
git commit -m "feat: 비즈니스 대시보드 8개 기능 통합 완료"
git push origin main
```

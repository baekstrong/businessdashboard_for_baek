import { subDays, addDays, format } from 'date-fns'

const today = new Date()

// 채널별 색상
export const CHANNELS = {
  youtube: { name: 'YouTube', color: '#ff0000', bg: '#fef2f2' },
  threads: { name: 'Threads', color: '#000000', bg: '#f8fafc' },
  instagram: { name: 'Instagram', color: '#e1306c', bg: '#fdf2f8' },
}

// 최근 30일 조회수 트렌드
export const viewsTrend = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(today, 29 - i)
  return {
    date: format(date, 'MM/dd'),
    youtube: Math.floor(800 + Math.random() * 2200 + i * 30),
    threads: Math.floor(200 + Math.random() * 800 + i * 15),
    instagram: Math.floor(300 + Math.random() * 1200 + i * 20),
  }
})

// KPI 요약
export const kpiData = {
  totalViews: 128430,
  viewsChange: 12.5,
  totalEngagement: 8920,
  engagementChange: 8.3,
  conversionRate: 3.2,
  conversionChange: 0.8,
  revenue: 2840000,
  revenueChange: 15.2,
}

// 채널별 성과
export const channelStats = [
  {
    channel: 'youtube',
    followers: 12400,
    views: 78200,
    engagement: 5.2,
    posts: 8,
    topContent: '케틀벨 스윙 완벽 가이드',
  },
  {
    channel: 'threads',
    followers: 3200,
    views: 24800,
    engagement: 7.8,
    posts: 24,
    topContent: '머신 운동이 체력 향상에 별 효과가 없는 이유',
  },
  {
    channel: 'instagram',
    followers: 5800,
    views: 25430,
    engagement: 6.1,
    posts: 12,
    topContent: '3-5 운동법 인포그래픽',
  },
]

// 콘텐츠 캘린더 데이터
export const scheduledContents = [
  {
    id: 1,
    title: '터키쉬 겟업 초보자 가이드',
    channel: 'youtube',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    time: '18:00',
    status: 'scheduled',
    type: '롱폼',
  },
  {
    id: 2,
    title: '데드리프트 vs 스쿼트, 뭘 먼저 해야 할까?',
    channel: 'threads',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    time: '12:00',
    status: 'scheduled',
    type: '스레드',
  },
  {
    id: 3,
    title: '운동 전 스트레칭이 오히려 해로운 이유',
    channel: 'threads',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '09:00',
    status: 'draft',
    type: '스레드',
  },
  {
    id: 4,
    title: '케틀벨 클린 앤 프레스 시범 영상',
    channel: 'instagram',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '19:00',
    status: 'scheduled',
    type: '릴스',
  },
  {
    id: 5,
    title: '주 3회 vs 주 5회 운동, 근성장 차이는?',
    channel: 'youtube',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    time: '18:00',
    status: 'draft',
    type: '롱폼',
  },
  {
    id: 6,
    title: '그립 스트렝스가 전체 근력에 미치는 영향',
    channel: 'threads',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    time: '12:00',
    status: 'scheduled',
    type: '스레드',
  },
  {
    id: 7,
    title: '바벨 로우 자세 교정 3가지',
    channel: 'instagram',
    date: format(addDays(today, 4), 'yyyy-MM-dd'),
    time: '19:00',
    status: 'review',
    type: '릴스',
  },
  {
    id: 8,
    title: '초보자가 가장 많이 하는 스쿼트 실수',
    channel: 'youtube',
    date: format(today, 'yyyy-MM-dd'),
    time: '18:00',
    status: 'published',
    type: '롱폼',
  },
  {
    id: 9,
    title: '운동 후 단백질 섭취 타이밍의 진실',
    channel: 'threads',
    date: format(today, 'yyyy-MM-dd'),
    time: '12:00',
    status: 'published',
    type: '스레드',
  },
  {
    id: 10,
    title: '풀업 못하는 사람을 위한 단계별 프로그램',
    channel: 'instagram',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    time: '19:00',
    status: 'published',
    type: '카드뉴스',
  },
]

// 구매 전환 퍼널 데이터
export const conversionFunnel = [
  { stage: '콘텐츠 조회', count: 128430, rate: 100 },
  { stage: '링크 클릭', count: 8960, rate: 6.98 },
  { stage: '상품 페이지', count: 4230, rate: 3.29 },
  { stage: '장바구니', count: 1280, rate: 1.0 },
  { stage: '구매 완료', count: 412, rate: 0.32 },
]

// 구매 전환 추이 (주간)
export const conversionTrend = Array.from({ length: 12 }, (_, i) => {
  const weekStart = subDays(today, (11 - i) * 7)
  return {
    week: format(weekStart, 'MM/dd'),
    clicks: Math.floor(600 + Math.random() * 400 + i * 30),
    conversions: Math.floor(25 + Math.random() * 20 + i * 3),
    revenue: Math.floor(180000 + Math.random() * 120000 + i * 15000),
  }
})

// 상품별 전환 데이터
export const productConversions = [
  { name: '케틀벨 입문 프로그램', clicks: 2340, conversions: 156, revenue: 1248000, rate: 6.67 },
  { name: '온라인 PT 1:1', clicks: 1820, conversions: 89, revenue: 890000, rate: 4.89 },
  { name: '근력학교 멤버십', clicks: 1560, conversions: 78, revenue: 468000, rate: 5.0 },
  { name: '운동 프로그램 PDF', clicks: 3240, conversions: 89, revenue: 234000, rate: 2.75 },
]

// 매출 목표 데이터
export const revenueGoals = [
  { month: '2026-01', goal: 3000000, actual: 2640000 },
  { month: '2026-02', goal: 3500000, actual: 3180000 },
  { month: '2026-03', goal: 4000000, actual: 2840000 },
]

// UTM 링크 데이터
export const utmLinks = [
  {
    id: 1,
    name: '케틀벨 프로그램 - 유튜브',
    url: 'https://school.strength.kr/kettlebell',
    utm_source: 'youtube',
    utm_medium: 'video',
    utm_campaign: 'kettlebell_guide',
    clicks: 1240,
    conversions: 82,
    created: format(subDays(today, 14), 'yyyy-MM-dd'),
  },
  {
    id: 2,
    name: '멤버십 - 스레드',
    url: 'https://school.strength.kr/membership',
    utm_source: 'threads',
    utm_medium: 'post',
    utm_campaign: 'membership_promo',
    clicks: 860,
    conversions: 45,
    created: format(subDays(today, 7), 'yyyy-MM-dd'),
  },
  {
    id: 3,
    name: 'PT 상담 - 인스타',
    url: 'https://school.strength.kr/pt',
    utm_source: 'instagram',
    utm_medium: 'story',
    utm_campaign: 'pt_consult',
    clicks: 620,
    conversions: 31,
    created: format(subDays(today, 3), 'yyyy-MM-dd'),
  },
]

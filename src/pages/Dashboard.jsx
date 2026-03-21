import { useState } from 'react'
import { Eye, Heart, Target, Wallet } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import KpiCard from '../components/KpiCard'
import ChannelBadge from '../components/ChannelBadge'
import StatusBadge from '../components/StatusBadge'
import useLocalStorage from '../hooks/useLocalStorage'
import {
  viewsTrend, channelStats, scheduledContents, CHANNELS, revenueGoals,
} from '../data/mockData'

const kpis = [
  { key: 'totalViews', title: '총 조회수', icon: Eye, format: 'number' },
  { key: 'totalEngagement', title: '참여 (좋아요+댓글)', icon: Heart, format: 'number' },
  { key: 'conversionRate', title: '전환율', icon: Target, format: 'percent' },
  { key: 'revenue', title: '매출', icon: Wallet, format: 'currency' },
]

const PERIOD_OPTIONS = [
  { label: '7일', value: 7 },
  { label: '14일', value: 14 },
  { label: '30일', value: 30 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState(30)
  const [goals, setGoals] = useLocalStorage('revenue-goals', revenueGoals)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  const filteredTrend = viewsTrend.slice(-period)
  const prevTrend = viewsTrend.slice(-period * 2, -period)

  const sumViews = (data) => data.reduce((s, d) => s + d.youtube + d.threads + d.instagram, 0)
  const totalViews = sumViews(filteredTrend)
  const prevViews = prevTrend.length > 0 ? sumViews(prevTrend) : totalViews
  const totalEngagement = Math.round(totalViews * 0.069)
  const prevEngagement = Math.round(prevViews * 0.069)
  const conversionRate = +(totalViews / sumViews(viewsTrend) * 100).toFixed(1) || 3.2
  const prevConversionRate = prevTrend.length > 0 ? +(prevViews / sumViews(viewsTrend) * 100).toFixed(1) : conversionRate
  const revenue = Math.round(totalViews * 22.1)
  const prevRevenue = Math.round(prevViews * 22.1)

  const pctChange = (curr, prev) => prev > 0 ? +((curr - prev) / prev * 100).toFixed(1) : 0

  const computedKpi = {
    totalViews,
    viewsChange: pctChange(totalViews, prevViews),
    totalEngagement,
    engagementChange: pctChange(totalEngagement, prevEngagement),
    conversionRate,
    conversionChange: +(conversionRate - prevConversionRate).toFixed(1),
    revenue,
    revenueChange: pctChange(revenue, prevRevenue),
  }

  const upcoming = scheduledContents
    .filter((c) => c.status !== 'published')
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">대시보드</h2>
          <p className="text-sm text-slate-500 mt-1">이지스트렝스 채널 성과 한눈에 보기</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${period === opt.value ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ key, title, icon, format }) => (
          <KpiCard
            key={key}
            title={title}
            value={computedKpi[key]}
            change={computedKpi[`${key.replace('total', '').replace('Rate', '').toLowerCase()}Change`] || computedKpi[`${key}Change`]}
            icon={icon}
            format={format}
          />
        ))}
      </div>

      {/* Revenue Goal Tracking */}
      {(() => {
        const currentMonth = new Date().toISOString().slice(0, 7)
        const currentGoal = goals.find((g) => g.month === currentMonth) || goals[goals.length - 1]
        const achievementRate = Math.round((currentGoal.actual / currentGoal.goal) * 100)
        const progressWidth = Math.min(achievementRate, 100)

        const chartData = goals.map((g) => ({
          month: g.month.slice(5) + '월',
          목표: g.goal,
          실제: g.actual,
        }))

        const handleGoalEdit = () => {
          setEditingGoal(true)
          setGoalInput(String(currentGoal.goal))
        }

        const handleGoalSave = () => {
          const newGoal = parseInt(goalInput, 10)
          if (!isNaN(newGoal) && newGoal > 0) {
            setGoals(goals.map((g) =>
              g.month === currentGoal.month ? { ...g, goal: newGoal } : g
            ))
          }
          setEditingGoal(false)
        }

        const handleGoalKeyDown = (e) => {
          if (e.key === 'Enter') handleGoalSave()
          if (e.key === 'Escape') setEditingGoal(false)
        }

        return (
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">이번 달 매출 목표</h3>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">목표 금액</span>
                    {editingGoal ? (
                      <input
                        type="number"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        onBlur={handleGoalSave}
                        onKeyDown={handleGoalKeyDown}
                        autoFocus
                        className="w-36 px-2 py-1 text-right text-sm font-semibold border border-primary rounded-md outline-none"
                      />
                    ) : (
                      <button
                        onClick={handleGoalEdit}
                        className="font-semibold text-slate-800 hover:text-primary transition-colors cursor-pointer"
                      >
                        {currentGoal.goal.toLocaleString()}원
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">현재 매출</span>
                    <span className="font-semibold text-slate-800">{currentGoal.actual.toLocaleString()}원</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">달성률</span>
                    <span className={`text-sm font-bold ${achievementRate >= 100 ? 'text-green-600' : achievementRate >= 70 ? 'text-amber-600' : 'text-red-500'}`}>
                      {achievementRate}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${achievementRate >= 100 ? 'bg-green-500' : achievementRate >= 70 ? 'bg-amber-500' : 'bg-red-400'}`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  {achievementRate >= 100
                    ? '목표를 달성했습니다!'
                    : `목표까지 ${(currentGoal.goal - currentGoal.actual).toLocaleString()}원 남았습니다.`}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">월별 목표 vs 실제</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                    <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="목표" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="실제" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Views Trend Chart */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">채널별 조회수 추이 ({period}일)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredTrend}>
            <defs>
              <linearGradient id="youtube" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff0000" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#ff0000" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="threads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="instagram" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e1306c" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#e1306c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Area type="monotone" dataKey="youtube" name="YouTube" stroke="#ff0000" fill="url(#youtube)" strokeWidth={2} />
            <Area type="monotone" dataKey="threads" name="Threads" stroke="#000000" fill="url(#threads)" strokeWidth={2} />
            <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#e1306c" fill="url(#instagram)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Channel Performance */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">채널별 성과</h3>
          <div className="space-y-4">
            {channelStats.map((stat) => (
              <div key={stat.channel} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: CHANNELS[stat.channel].color }}
                >
                  {CHANNELS[stat.channel].name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">{CHANNELS[stat.channel].name}</p>
                    <p className="text-xs text-slate-500">팔로워 {stat.followers.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-500">조회 {stat.views.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">참여율 {stat.engagement}%</span>
                    <span className="text-xs text-slate-500">게시물 {stat.posts}개</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">인기: {stat.topContent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Content */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">예정된 콘텐츠</h3>
          <div className="space-y-3">
            {upcoming.map((content) => (
              <div key={content.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{content.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{content.date} {content.time}</span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs text-slate-500">{content.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ChannelBadge channel={content.channel} />
                  <StatusBadge status={content.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'
import { Download } from 'lucide-react'
import { channelStats, viewsTrend, CHANNELS } from '../data/mockData'
import ChannelBadge from '../components/ChannelBadge'

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

const PERIOD_OPTIONS = [
  { label: '7일', value: 7 },
  { label: '14일', value: 14 },
  { label: '30일', value: 30 },
]

const pieData = channelStats.map((s) => ({
  name: CHANNELS[s.channel].name,
  value: s.views,
  color: CHANNELS[s.channel].color,
}))

const engagementData = channelStats.map((s) => ({
  name: CHANNELS[s.channel].name,
  engagement: s.engagement,
  posts: s.posts,
  followers: s.followers,
  color: CHANNELS[s.channel].color,
}))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color || entry.fill }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          {entry.name === '참여율' ? '%' : ''}
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState(30)
  const filteredTrend = viewsTrend.slice(-period)

  const handleExportViews = () => {
    const headers = ['날짜', 'YouTube', 'Threads', 'Instagram']
    const rows = filteredTrend.map(d => [d.date, d.youtube, d.threads, d.instagram])
    exportToCsv(`채널분석_${period}일.csv`, headers, rows)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">채널 분석</h2>
          <p className="text-sm text-slate-500 mt-1">유튜브 / 스레드 / 인스타그램 성과 분석</p>
        </div>
        <div className="flex items-center gap-2">
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
          <button
            onClick={handleExportViews}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download size={14} />
            CSV 내보내기
          </button>
        </div>
      </div>

      {/* Channel Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channelStats.map((stat) => {
          const info = CHANNELS[stat.channel]
          return (
            <div key={stat.channel} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <ChannelBadge channel={stat.channel} size="md" />
                <span className="text-xs text-slate-500">{stat.posts}개 게시물</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">{(stat.followers / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-slate-500">팔로워</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{(stat.views / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-slate-500">조회수</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stat.engagement}%</p>
                  <p className="text-xs text-slate-500">참여율</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-slate-500">인기 콘텐츠</p>
                <p className="text-sm font-medium text-slate-700 truncate mt-0.5">{stat.topContent}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Views Bar Chart */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">일별 조회수</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredTrend} barGap={1}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="youtube" name="YouTube" fill="#ff0000" radius={[2, 2, 0, 0]} />
              <Bar dataKey="threads" name="Threads" fill="#000000" radius={[2, 2, 0, 0]} />
              <Bar dataKey="instagram" name="Instagram" fill="#e1306c" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Views Distribution Pie */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">조회수 비율</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Comparison */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">참여율 비교</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={engagementData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="engagement" name="참여율" radius={[0, 4, 4, 0]}>
              {engagementData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

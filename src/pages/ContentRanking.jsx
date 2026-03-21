import { useState, useMemo } from 'react'
import { Trophy, TrendingDown, Filter } from 'lucide-react'
import { CHANNELS } from '../data/mockData'
import { contentPerformance } from '../data/contentRankingData'
import ChannelBadge from '../components/ChannelBadge'

const SORT_OPTIONS = [
  { value: 'views', label: '조회수' },
  { value: 'engagement', label: '참여율' },
  { value: 'conversionRate', label: '전환율' },
]

const CHANNEL_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'threads', label: 'Threads' },
  { value: 'instagram', label: 'Instagram' },
]

function getEngagementRate(item) {
  return ((item.likes + item.comments + item.shares) / item.views * 100)
}

function getMetricValue(item, sortBy) {
  if (sortBy === 'views') return item.views
  if (sortBy === 'engagement') return getEngagementRate(item)
  return item.conversionRate
}

function formatMetric(value, sortBy) {
  if (sortBy === 'views') return value.toLocaleString()
  return value.toFixed(1) + '%'
}

function getMetricLabel(sortBy) {
  if (sortBy === 'views') return '조회수'
  if (sortBy === 'engagement') return '참여율'
  return '전환율'
}

export default function ContentRanking() {
  const [channelFilter, setChannelFilter] = useState('all')
  const [sortBy, setSortBy] = useState('views')

  const filteredAndSorted = useMemo(() => {
    let data = contentPerformance
    if (channelFilter !== 'all') {
      data = data.filter(item => item.channel === channelFilter)
    }
    return [...data].sort((a, b) => getMetricValue(b, sortBy) - getMetricValue(a, sortBy))
  }, [channelFilter, sortBy])

  const top5 = filteredAndSorted.slice(0, 5)
  const worst5 = [...filteredAndSorted].reverse().slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">콘텐츠 성과 랭킹</h2>
        <p className="text-sm text-slate-500 mt-1">콘텐츠별 성과를 비교하고 인사이트를 확인하세요</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <div className="flex rounded-lg border border-border overflow-hidden">
            {CHANNEL_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setChannelFilter(value)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors
                  ${channelFilter === value
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                  }
                  ${value !== 'all' ? 'border-l border-border' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>정렬: {label}</option>
          ))}
        </select>
      </div>

      {/* TOP 5 Best / Worst */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best 5 */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            TOP 5 베스트
          </h3>
          <div className="space-y-3">
            {top5.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${i === 0 ? 'bg-amber-100 text-amber-700'
                    : i === 1 ? 'bg-slate-200 text-slate-600'
                    : i === 2 ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-100 text-slate-500'}`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                  <ChannelBadge channel={item.channel} />
                </div>
                <span className="text-sm font-bold text-primary shrink-0">
                  {formatMetric(getMetricValue(item, sortBy), sortBy)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst 5 */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-red-500" />
            TOP 5 워스트
          </h3>
          <div className="space-y-3">
            {worst5.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-red-50 text-red-500">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                  <ChannelBadge channel={item.channel} />
                </div>
                <span className="text-sm font-bold text-red-500 shrink-0">
                  {formatMetric(getMetricValue(item, sortBy), sortBy)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          전체 콘텐츠 ({filteredAndSorted.length}개)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-medium text-slate-500 text-xs">#</th>
                <th className="text-left py-3 px-3 font-medium text-slate-500 text-xs">제목</th>
                <th className="text-left py-3 px-3 font-medium text-slate-500 text-xs">채널</th>
                <th className="text-left py-3 px-3 font-medium text-slate-500 text-xs">유형</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">조회수</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">좋아요</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">댓글</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">공유</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">참여율</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">전환율</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">날짜</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((item, i) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-400 text-xs">{i + 1}</td>
                  <td className="py-3 px-3 font-medium text-slate-800 max-w-[200px] truncate">{item.title}</td>
                  <td className="py-3 px-3"><ChannelBadge channel={item.channel} /></td>
                  <td className="py-3 px-3 text-slate-600">{item.type}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{item.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{item.likes.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{item.comments.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{item.shares.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {getEngagementRate(item).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {item.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500 text-xs">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

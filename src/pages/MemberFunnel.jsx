import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import { Users, UserPlus, MessageCircle } from 'lucide-react'
import { memberFunnel, monthlyRegistrations, channelAttribution } from '../data/memberFunnelData'
import { CHANNELS } from '../data/mockData'
import ChannelBadge from '../components/ChannelBadge'

const FUNNEL_COLORS = ['#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color || entry.fill }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function MemberFunnel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">회원 전환 퍼널</h2>
        <p className="text-sm text-slate-500 mt-1">콘텐츠 조회 → 문의 → 체험 → 회원 등록 전환 추적</p>
      </div>

      {/* Section 1 - 회원 전환 퍼널 */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Users size={16} className="text-indigo-600" />
          회원 전환 퍼널
        </h3>
        <div className="flex flex-col gap-2">
          {memberFunnel.map((step, i) => {
            const widthPercent = 40 + (60 * (memberFunnel.length - i)) / memberFunnel.length
            const dropOff = i > 0
              ? ((1 - step.count / memberFunnel[i - 1].count) * 100).toFixed(1)
              : null
            return (
              <div key={step.stage} className="flex items-center gap-4">
                <div className="w-24 text-right">
                  <p className="text-sm font-medium text-slate-700">{step.stage}</p>
                </div>
                <div className="flex-1 relative">
                  <div
                    className="h-10 rounded-lg flex items-center justify-between px-4 transition-all"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: FUNNEL_COLORS[i],
                    }}
                  >
                    <span className="text-white text-sm font-bold">{step.count.toLocaleString()}</span>
                  </div>
                </div>
                {i > 0 && (
                  <div className="w-20 text-right">
                    <span className="text-xs text-slate-500">
                      전환 {((step.count / memberFunnel[i - 1].count) * 100).toFixed(1)}%
                    </span>
                    <br />
                    <span className="text-xs text-red-400">
                      이탈 {dropOff}%
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 2 - 월별 등록 추이 */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MessageCircle size={16} className="text-indigo-600" />
          월별 등록 추이
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRegistrations} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="inquiries" name="문의" fill="#a5b4fc" radius={[2, 2, 0, 0]} />
            <Bar dataKey="trials" name="체험" fill="#6366f1" radius={[2, 2, 0, 0]} />
            <Bar dataKey="registrations" name="등록" fill="#4338ca" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section 3 - 채널별 기여도 */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <UserPlus size={16} className="text-indigo-600" />
          채널별 기여도
        </h3>
        <div className="space-y-4">
          {channelAttribution.map((ch) => {
            const conversionRate = ((ch.registrations / ch.inquiries) * 100).toFixed(1)
            const maxInquiries = Math.max(...channelAttribution.map(c => c.inquiries))
            return (
              <div key={ch.channel} className="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <ChannelBadge channel={ch.channel} size="md" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                    전환율 {conversionRate}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-500">문의</p>
                    <p className="text-lg font-bold text-slate-900">{ch.inquiries.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">등록</p>
                    <p className="text-lg font-bold text-indigo-600">{ch.registrations.toLocaleString()}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(ch.inquiries / maxInquiries) * 100}%`,
                      backgroundColor: CHANNELS[ch.channel]?.color || '#6366f1',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

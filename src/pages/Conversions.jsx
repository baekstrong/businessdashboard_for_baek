import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, ComposedChart, Area,
} from 'recharts'
import { Link2, Copy, Check, ExternalLink, ShoppingCart, MousePointerClick, Eye, CreditCard, Download } from 'lucide-react'
import { conversionFunnel, conversionTrend, productConversions, utmLinks } from '../data/mockData'

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

const FUNNEL_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color || entry.stroke }}>
          {entry.name}: {typeof entry.value === 'number'
            ? entry.name === '매출' ? `₩${entry.value.toLocaleString()}` : entry.value.toLocaleString()
            : entry.value}
        </p>
      ))}
    </div>
  )
}

function UTMGenerator() {
  const [form, setForm] = useState({ url: '', source: 'youtube', medium: 'video', campaign: '' })
  const [copied, setCopied] = useState(false)

  const generatedUrl = form.url && form.campaign
    ? `${form.url}?utm_source=${form.source}&utm_medium=${form.medium}&utm_campaign=${form.campaign}`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Link2 size={16} className="text-primary" />
        UTM 링크 생성기
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">URL</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="https://school.strength.kr/product"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">캠페인명</label>
          <input
            type="text"
            value={form.campaign}
            onChange={(e) => setForm({ ...form, campaign: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="spring_promotion"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">소스</label>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="youtube">YouTube</option>
            <option value="threads">Threads</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">매체</label>
          <select
            value={form.medium}
            onChange={(e) => setForm({ ...form, medium: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="video">동영상</option>
            <option value="post">게시물</option>
            <option value="story">스토리</option>
            <option value="reel">릴스</option>
          </select>
        </div>
      </div>
      {generatedUrl && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-slate-50 rounded-lg">
          <code className="flex-1 text-xs text-slate-700 break-all">{generatedUrl}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 p-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-500" />}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Conversions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">구매 전환</h2>
        <p className="text-sm text-slate-500 mt-1">콘텐츠 → 클릭 → 구매 전환 추적</p>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">전환 퍼널</h3>
        <div className="flex flex-col gap-2">
          {conversionFunnel.map((step, i) => {
            const widthPercent = 40 + (60 * (conversionFunnel.length - i)) / conversionFunnel.length
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
                    <span className="text-white/80 text-xs">{step.rate}%</span>
                  </div>
                </div>
                {i > 0 && (
                  <div className="w-16 text-right">
                    <span className="text-xs text-slate-500">
                      {((conversionFunnel[i].count / conversionFunnel[i - 1].count) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversion Trend */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">주간 전환 추이</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={conversionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="clicks" name="클릭" fill="#c7d2fe" radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="conversions" name="전환" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">주간 매출 추이</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={conversionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="매출" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Conversions Table */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">상품별 전환</h3>
          <button
            onClick={() => {
              const headers = ['상품', '클릭', '구매', '전환율(%)', '매출(원)']
              const rows = productConversions.map(p => [p.name, p.clicks, p.conversions, p.rate, p.revenue])
              exportToCsv('상품별_전환.csv', headers, rows)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download size={14} />
            CSV 내보내기
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-medium text-slate-500 text-xs">상품</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">클릭</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">구매</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">전환율</th>
                <th className="text-right py-3 px-3 font-medium text-slate-500 text-xs">매출</th>
              </tr>
            </thead>
            <tbody>
              {productConversions.map((product) => (
                <tr key={product.name} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-800">{product.name}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{product.clicks.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{product.conversions}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {product.rate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-800">₩{product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td className="py-3 px-3 font-semibold text-slate-900">합계</td>
                <td className="py-3 px-3 text-right font-semibold text-slate-900">
                  {productConversions.reduce((s, p) => s + p.clicks, 0).toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right font-semibold text-slate-900">
                  {productConversions.reduce((s, p) => s + p.conversions, 0)}
                </td>
                <td className="py-3 px-3 text-right font-semibold text-primary">
                  {(productConversions.reduce((s, p) => s + p.conversions, 0) / productConversions.reduce((s, p) => s + p.clicks, 0) * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-right font-semibold text-slate-900">
                  ₩{productConversions.reduce((s, p) => s + p.revenue, 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* UTM Link Generator */}
      <UTMGenerator />

      {/* Active UTM Links */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">활성 UTM 링크</h3>
        <div className="space-y-3">
          {utmLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{link.name}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{link.url}?utm_source={link.utm_source}&...</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">{link.clicks.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">클릭</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-primary">{link.conversions}</p>
                  <p className="text-[10px] text-slate-500">전환</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-600">
                    {((link.conversions / link.clicks) * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-slate-500">전환율</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

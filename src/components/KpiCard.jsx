import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KpiCard({ title, value, change, icon: Icon, format = 'number' }) {
  const isPositive = change >= 0
  const formattedValue =
    format === 'currency'
      ? `₩${value.toLocaleString()}`
      : format === 'percent'
        ? `${value}%`
        : value.toLocaleString()

  return (
    <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
          ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{formattedValue}</p>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
    </div>
  )
}

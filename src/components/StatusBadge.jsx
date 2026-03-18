const STATUS_MAP = {
  published: { label: '발행됨', className: 'bg-emerald-50 text-emerald-700' },
  scheduled: { label: '예약됨', className: 'bg-blue-50 text-blue-700' },
  draft: { label: '초안', className: 'bg-slate-100 text-slate-600' },
  review: { label: '검토 중', className: 'bg-amber-50 text-amber-700' },
}

export default function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || STATUS_MAP.draft
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${info.className}`}>
      {info.label}
    </span>
  )
}

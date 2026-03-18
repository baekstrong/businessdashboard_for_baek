import { CHANNELS } from '../data/mockData'

export default function ChannelBadge({ channel, size = 'sm' }) {
  const info = CHANNELS[channel]
  if (!info) return null

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: info.bg, color: info.color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: info.color }}
      />
      {info.name}
    </span>
  )
}

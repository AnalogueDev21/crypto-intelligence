import { useId } from 'react'

export default function PriceChart({ data, color, compact = false }) {
  const gradientId = useId().replace(/:/g, '')
  const width = compact ? 150 : 640
  const height = compact ? 54 : 260
  const padding = compact ? 2 : 14
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2)
    const y = padding + ((max - value) / range) * (height - padding * 2)
    return [x, y]
  })
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `${points[0][0]},${height} ${line} ${points.at(-1)[0]},${height}`

  return <svg className={`price-chart ${compact ? 'compact-chart' : ''}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="กราฟราคา">
    <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".28" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
    {!compact && [0.25, 0.5, 0.75].map((ratio) => <line key={ratio} x1="0" x2={width} y1={height * ratio} y2={height * ratio} className="chart-grid-line" />)}
    <polygon points={area} fill={`url(#${gradientId})`} />
    <polyline points={line} fill="none" stroke={color} strokeWidth={compact ? 2.2 : 2.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    {!compact && <circle cx={points.at(-1)[0]} cy={points.at(-1)[1]} r="4" fill={color} />}
  </svg>
}

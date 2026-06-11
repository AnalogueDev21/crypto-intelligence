import { useMemo } from 'react'
import { makeCandles } from '../data/marketUniverse'

export default function CandlestickChart({ asset }) {
  const candles = useMemo(() => makeCandles(asset), [asset])
  const width = 900
  const height = 360
  const chartHeight = 285
  const max = Math.max(...candles.map((item) => item.high))
  const min = Math.min(...candles.map((item) => item.low))
  const range = max - min || 1
  const slot = width / candles.length
  const y = (value) => 12 + ((max - value) / range) * (chartHeight - 24)
  const maxVolume = Math.max(...candles.map((item) => item.volume))

  return <svg className="candle-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${asset.symbol} candlestick chart`}>
    {[0.2, 0.4, 0.6, 0.8].map((ratio) => <line key={ratio} x1="0" x2={width} y1={chartHeight * ratio} y2={chartHeight * ratio} className="chart-grid-line" />)}
    {candles.map((item, index) => {
      const x = index * slot + slot / 2
      const positive = item.close >= item.open
      const color = positive ? '#83d95b' : '#ff6575'
      const bodyTop = Math.min(y(item.open), y(item.close))
      const bodyHeight = Math.max(2, Math.abs(y(item.open) - y(item.close)))
      const volumeHeight = (item.volume / maxVolume) * 52
      return <g key={index}>
        <line x1={x} x2={x} y1={y(item.high)} y2={y(item.low)} stroke={color} strokeWidth="1.3" />
        <rect x={x - Math.max(2.5, slot * .28)} y={bodyTop} width={Math.max(5, slot * .56)} height={bodyHeight} rx="1" fill={color} />
        <rect x={x - Math.max(2.5, slot * .28)} y={height - volumeHeight} width={Math.max(5, slot * .56)} height={volumeHeight} fill={color} opacity=".24" />
      </g>
    })}
  </svg>
}

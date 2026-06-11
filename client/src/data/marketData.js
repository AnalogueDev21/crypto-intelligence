const MARKET = {
  BTC: { price: 104820.42, change: 2.84, volume: '48.2B', seed: 2, trend: 1.25 },
  ETH: { price: 3842.18, change: -1.37, volume: '22.6B', seed: 5, trend: -0.45 },
  SOL: { price: 176.54, change: 4.92, volume: '6.8B', seed: 8, trend: 1.7 },
  'XAU/USD': { price: 3378.2, change: 0.74, volume: '191B', seed: 4, trend: 0.55 },
  'EUR/USD': { price: 1.0864, change: -0.18, volume: '82B', seed: 9, trend: -0.2 },
  'USD/JPY': { price: 156.72, change: 0.31, volume: '74B', seed: 7, trend: 0.35 },
  NASDAQ: { price: 19482.9, change: 1.05, volume: '253B', seed: 3, trend: 0.8 },
  'S&P 500': { price: 5486.1, change: 0.62, volume: '298B', seed: 6, trend: 0.5 },
  TSLA: { price: 184.22, change: -2.12, volume: '18.4B', seed: 11, trend: -0.85 },
  AAPL: { price: 213.68, change: 0.44, volume: '12.8B', seed: 13, trend: 0.3 },
}

const PERIODS = {
  '24H': { points: 30, spread: 0.016, trendScale: 0.35, volumeScale: 1 },
  '7D': { points: 42, spread: 0.035, trendScale: 0.85, volumeScale: 6.7 },
  '30D': { points: 50, spread: 0.075, trendScale: 1.5, volumeScale: 28.4 },
}

export function getMarketSnapshot(symbol, period = '24H') {
  const market = MARKET[symbol] || { price: 1, change: 0, volume: '0', seed: 1, trend: 0 }
  const config = PERIODS[period]
  const data = Array.from({ length: config.points }, (_, index) => {
    const progress = index / (config.points - 1)
    const wave = Math.sin((index + market.seed) * 0.72) * 0.45 + Math.sin((index + market.seed * 2) * 0.23) * 0.3
    const micro = Math.cos((index + 2) * (market.seed + 3) * 0.11) * 0.12
    const direction = market.trend * config.trendScale * (progress - 0.5)
    return market.price * (1 + config.spread * (wave + micro + direction))
  })

  const high = Math.max(...data)
  const low = Math.min(...data)
  const periodChange = ((data.at(-1) - data[0]) / data[0]) * 100

  return {
    ...market,
    data,
    high,
    low,
    periodChange,
    volumeLabel: `${market.volume} x ${config.volumeScale}`,
  }
}

export function formatPrice(value, symbol = '') {
  const currencyPair = symbol.includes('/')
  const digits = currencyPair ? 4 : value < 1 ? 4 : value < 100 ? 2 : 2
  return new Intl.NumberFormat('en-US', {
    style: currencyPair ? 'decimal' : 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

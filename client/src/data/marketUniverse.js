export const MARKET_ASSETS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', market: 'Crypto', price: 104820.42, change: 2.84, volume: 48.2, marketCap: 2080, volatility: 64, risk: 58, rsi: 61, macd: 'Bullish', trend: 'Uptrend', sentiment: 72, support: 101200, resistance: 108500 },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', market: 'Crypto', price: 3842.18, change: -1.37, volume: 22.6, marketCap: 463, volatility: 71, risk: 68, rsi: 47, macd: 'Bearish', trend: 'Sideways', sentiment: 54, support: 3690, resistance: 4020 },
  { id: 'sol', symbol: 'SOL', name: 'Solana', market: 'Crypto', price: 176.54, change: 4.92, volume: 6.8, marketCap: 84, volatility: 82, risk: 74, rsi: 69, macd: 'Bullish', trend: 'Uptrend', sentiment: 78, support: 164, resistance: 188 },
  { id: 'xauusd', symbol: 'XAU/USD', name: 'Gold Spot', market: 'Forex', price: 3378.2, change: 0.74, volume: 191, marketCap: null, volatility: 43, risk: 62, rsi: 58, macd: 'Bullish', trend: 'Uptrend', sentiment: 67, support: 3328, resistance: 3420 },
  { id: 'eurusd', symbol: 'EUR/USD', name: 'Euro / US Dollar', market: 'Forex', price: 1.0864, change: -0.18, volume: 82, marketCap: null, volatility: 31, risk: 49, rsi: 44, macd: 'Bearish', trend: 'Sideways', sentiment: 46, support: 1.078, resistance: 1.094 },
  { id: 'usdjpy', symbol: 'USD/JPY', name: 'US Dollar / Yen', market: 'Forex', price: 156.72, change: 0.31, volume: 74, marketCap: null, volatility: 47, risk: 66, rsi: 64, macd: 'Bullish', trend: 'Uptrend', sentiment: 61, support: 154.8, resistance: 158.2 },
  { id: 'nasdaq', symbol: 'NASDAQ', name: 'Nasdaq 100', market: 'Index', price: 19482.9, change: 1.05, volume: 253, marketCap: null, volatility: 52, risk: 64, rsi: 66, macd: 'Bullish', trend: 'Uptrend', sentiment: 73, support: 19040, resistance: 19760 },
  { id: 'spx', symbol: 'S&P 500', name: 'S&P 500 Index', market: 'Index', price: 5486.1, change: 0.62, volume: 298, marketCap: null, volatility: 38, risk: 46, rsi: 59, macd: 'Bullish', trend: 'Uptrend', sentiment: 69, support: 5390, resistance: 5540 },
  { id: 'tsla', symbol: 'TSLA', name: 'Tesla', market: 'Stock', price: 184.22, change: -2.12, volume: 18.4, marketCap: 587, volatility: 79, risk: 81, rsi: 39, macd: 'Bearish', trend: 'Downtrend', sentiment: 41, support: 176, resistance: 196 },
  { id: 'aapl', symbol: 'AAPL', name: 'Apple', market: 'Stock', price: 213.68, change: 0.44, volume: 12.8, marketCap: 3270, volatility: 35, risk: 39, rsi: 57, macd: 'Bullish', trend: 'Uptrend', sentiment: 71, support: 207, resistance: 219 },
]

export const ECONOMIC_EVENTS = [
  { id: 1, date: '2026-06-11', time: '19:30', country: 'US', market: 'Forex', impact: 'High', event: 'US CPI (YoY)', actual: '3.1%', forecast: '3.0%', previous: '3.2%', assets: ['XAU/USD', 'EUR/USD', 'NASDAQ'] },
  { id: 2, date: '2026-06-11', time: '21:00', country: 'US', market: 'Macro', impact: 'Medium', event: 'Consumer Sentiment', actual: '-', forecast: '66.4', previous: '65.8', assets: ['S&P 500', 'NASDAQ'] },
  { id: 3, date: '2026-06-12', time: '01:00', country: 'US', market: 'Macro', impact: 'High', event: 'FOMC Statement', actual: '-', forecast: 'Hold', previous: 'Hold', assets: ['BTC', 'XAU/USD', 'USD/JPY'] },
  { id: 4, date: '2026-06-12', time: '15:00', country: 'EU', market: 'Forex', impact: 'Medium', event: 'ECB President Speech', actual: '-', forecast: '-', previous: '-', assets: ['EUR/USD'] },
  { id: 5, date: '2026-06-13', time: '08:00', country: 'CRYPTO', market: 'Crypto', impact: 'High', event: 'SOL Token Unlock', actual: '2.1M SOL', forecast: '2.1M SOL', previous: '1.8M SOL', assets: ['SOL'] },
  { id: 6, date: '2026-06-13', time: '20:30', country: 'US', market: 'Stock', impact: 'Medium', event: 'Tech Earnings Batch', actual: '-', forecast: 'Mixed', previous: 'Beat', assets: ['NASDAQ', 'AAPL', 'TSLA'] },
]

export const STARTING_PORTFOLIO = [
  { assetId: 'btc', quantity: 0.08, averagePrice: 93500 },
  { assetId: 'eth', quantity: 1.4, averagePrice: 3520 },
  { assetId: 'xauusd', quantity: 0.7, averagePrice: 3290 },
  { assetId: 'aapl', quantity: 12, averagePrice: 198 },
]

export function getAsset(idOrSymbol) {
  return MARKET_ASSETS.find((asset) => asset.id === idOrSymbol || asset.symbol === idOrSymbol)
}

export function makeCandles(asset, count = 48) {
  const seed = asset.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  let previous = asset.price * (1 - asset.change / 100)
  return Array.from({ length: count }, (_, index) => {
    const wave = Math.sin((index + seed) * 0.58) * 0.006 + Math.cos((index + seed) * 0.21) * 0.004
    const drift = (asset.change / 100) / count
    const open = previous
    const close = open * (1 + drift + wave)
    const high = Math.max(open, close) * (1 + 0.0025 + ((index + seed) % 4) * 0.0007)
    const low = Math.min(open, close) * (1 - 0.0025 - ((index + seed) % 3) * 0.0008)
    const volume = asset.volume * (0.65 + ((index * seed) % 13) / 15)
    previous = close
    return { open, high, low, close, volume }
  })
}

export function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value < 10 ? 4 : 2 }).format(value)
}

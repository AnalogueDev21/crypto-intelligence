export const DEMO_ASSETS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', type: 'crypto', color: '#f7931a' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', type: 'crypto', color: '#8c8cda' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', type: 'crypto', color: '#75f3c8' },
  { id: 'xauusd', symbol: 'XAU/USD', name: 'Gold Spot', type: 'forex', color: '#f0c85a' },
  { id: 'eurusd', symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex', color: '#63a9ff' },
  { id: 'usdjpy', symbol: 'USD/JPY', name: 'US Dollar / Yen', type: 'forex', color: '#ff9f43' },
  { id: 'nasdaq', symbol: 'NASDAQ', name: 'Nasdaq 100', type: 'stock', color: '#7cc7ff' },
  { id: 'spx', symbol: 'S&P 500', name: 'S&P 500 Index', type: 'stock', color: '#8ee6a8' },
  { id: 'tsla', symbol: 'TSLA', name: 'Tesla', type: 'stock', color: '#ff6575' },
  { id: 'aapl', symbol: 'AAPL', name: 'Apple', type: 'stock', color: '#d7d7e2' },
]

export const DEMO_COINS = DEMO_ASSETS
export const WATCHLIST_KEY = 'crypto-intel-watchlist'
export const PREMIUM_KEY = 'crypto-intel-premium'
export const LANGUAGE_KEY = 'crypto-intel-language'

export function getLocalWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '["btc","eth","xauusd","nasdaq"]')
  } catch {
    return ['btc', 'eth', 'xauusd', 'nasdaq']
  }
}

export function getStoredPremium() {
  return localStorage.getItem(PREMIUM_KEY) === 'true'
}

export function setStoredPremium(value) {
  localStorage.setItem(PREMIUM_KEY, value ? 'true' : 'false')
}

export function getStoredLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || 'th'
}

export function setStoredLanguage(value) {
  localStorage.setItem(LANGUAGE_KEY, value)
}

export default function CoinLogo({ symbol, color = '#c8ff57', size = 36 }) {
  const clean = symbol?.replace(/[^A-Z]/g, '') || '?'
  const label = clean.slice(0, symbol?.includes('/') ? 2 : 1)

  if (symbol === 'BTC') return <span className="coin-logo" style={{ width: size, height: size, background: color }}>B</span>
  if (symbol === 'ETH') return <span className="coin-logo eth-logo" style={{ width: size, height: size, background: color }}>E</span>
  if (symbol === 'SOL') return <span className="coin-logo sol-logo" style={{ width: size, height: size }}>S</span>

  return <span className="coin-logo" style={{ width: size, height: size, background: color }}>{label}</span>
}

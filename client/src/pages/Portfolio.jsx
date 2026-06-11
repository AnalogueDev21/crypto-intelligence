import { useMemo, useState } from 'react'
import { AlertTriangle, Plus, ShieldCheck, Trash2, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import ProductNav from '../components/ProductNav'
import CoinLogo from '../components/CoinLogo'
import { MARKET_ASSETS, STARTING_PORTFOLIO, getAsset, money } from '../data/marketUniverse'

export default function Portfolio() {
  const [positions, setPositions] = useState(STARTING_PORTFOLIO)
  const [assetId, setAssetId] = useState('sol')
  const [quantity, setQuantity] = useState('1')
  const [averagePrice, setAveragePrice] = useState('160')
  const rows = useMemo(() => positions.map((position) => { const asset = getAsset(position.assetId); const value = asset.price * position.quantity; const cost = position.averagePrice * position.quantity; return { ...position, asset, value, cost, pnl: value - cost, pnlPercent: ((value - cost) / cost) * 100 } }), [positions])
  const totals = useMemo(() => rows.reduce((sum, row) => ({ value: sum.value + row.value, cost: sum.cost + row.cost, weightedRisk: sum.weightedRisk + row.asset.risk * row.value }), { value: 0, cost: 0, weightedRisk: 0 }), [rows])
  const pnl = totals.value - totals.cost
  const risk = totals.value ? Math.round(totals.weightedRisk / totals.value) : 0
  function addPosition(event) { event.preventDefault(); const qty = Number(quantity); const avg = Number(averagePrice); if (!qty || !avg) return; setPositions((current) => [...current.filter((item) => item.assetId !== assetId), { assetId, quantity: qty, averagePrice: avg }]) }
  function removePosition(id) { setPositions((current) => current.filter((item) => item.assetId !== id)) }
  return <div className="app-shell workspace-page"><ProductNav /><main className="workspace-main">
    <div className="workspace-title"><div><span className="section-kicker"><Wallet size={14} /> PORTFOLIO SIMULATOR</span><h1>วัดผลตอบแทนและความเสี่ยงรวม</h1><p>จำลองสถานะ, ต้นทุนเฉลี่ย, P&L, concentration และ stress scenario</p></div></div>
    <section className="portfolio-summary"><div className="summary-tile"><span>Portfolio value</span><strong>{money(totals.value)}</strong><small>Mock live valuation</small></div><div className="summary-tile"><span>Total P&L</span><strong className={pnl >= 0 ? 'positive' : 'negative'}>{pnl >= 0 ? '+' : ''}{money(pnl)}</strong><small>{totals.cost ? ((pnl / totals.cost) * 100).toFixed(2) : 0}% return</small></div><div className="summary-tile"><span>AI portfolio risk</span><strong>{risk}/100</strong><small>{risk >= 65 ? 'High concentration risk' : 'Moderate risk'}</small></div><div className="summary-tile"><span>Positions</span><strong>{rows.length}</strong><small>{new Set(rows.map((row) => row.asset.market)).size} markets</small></div></section>
    <div className="portfolio-layout"><section className="positions-panel panel"><div className="panel-title"><h2>Open positions</h2><span>{rows.length} assets</span></div>{rows.map((row) => <div className="position-row" key={row.assetId}><div className="asset-cell"><CoinLogo symbol={row.asset.symbol} size={36} /><span><b>{row.asset.symbol}</b><small>{row.quantity} units · avg {money(row.averagePrice)}</small></span></div><div><span>Value</span><strong>{money(row.value)}</strong></div><div><span>P&L</span><strong className={row.pnl >= 0 ? 'positive' : 'negative'}>{row.pnl >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{row.pnl >= 0 ? '+' : ''}{money(row.pnl)} ({row.pnlPercent.toFixed(1)}%)</strong></div><div><span>Risk</span><strong>{row.asset.risk}</strong></div><button onClick={() => removePosition(row.assetId)} aria-label={`Remove ${row.asset.symbol}`}><Trash2 size={16} /></button></div>)}</section>
      <aside><form className="add-position panel" onSubmit={addPosition}><span className="section-kicker"><Plus size={14} /> ADD / UPDATE POSITION</span><label>Asset<select value={assetId} onChange={(event) => { setAssetId(event.target.value); setAveragePrice(String(getAsset(event.target.value).price)) }}>{MARKET_ASSETS.map((asset) => <option value={asset.id} key={asset.id}>{asset.symbol} · {asset.name}</option>)}</select></label><label>Quantity<input type="number" min="0" step="any" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><label>Average price<input type="number" min="0" step="any" value={averagePrice} onChange={(event) => setAveragePrice(event.target.value)} /></label><button className="primary-btn">Add position</button></form></aside>
    </div>
    <section className="risk-insights"><div className="panel"><ShieldCheck size={20} /><div><b>Diversification</b><p>พอร์ตกระจายอยู่ใน {new Set(rows.map((row) => row.asset.market)).size} ตลาด แต่ crypto ยังขับเคลื่อน volatility หลัก</p></div></div><div className="panel"><AlertTriangle size={20} /><div><b>Stress test: BTC -10%</b><p>มูลค่าพอร์ตโดยประมาณจะลดลง {money((rows.find((row) => row.assetId === 'btc')?.value || 0) * .1)} จากสถานะ BTC โดยตรง</p></div></div></section>
  </main></div>
}

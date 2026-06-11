import { useMemo, useState } from 'react'
import { ArrowDownUp, Filter, Search, SlidersHorizontal, TrendingDown, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductNav from '../components/ProductNav'
import CoinLogo from '../components/CoinLogo'
import { MARKET_ASSETS, money } from '../data/marketUniverse'

export default function Screener() {
  const navigate = useNavigate()
  const [market, setMarket] = useState('All')
  const [query, setQuery] = useState('')
  const [signal, setSignal] = useState('All')
  const [maxRisk, setMaxRisk] = useState(100)
  const [sort, setSort] = useState('risk')
  const rows = useMemo(() => MARKET_ASSETS
    .filter((asset) => market === 'All' || asset.market === market)
    .filter((asset) => signal === 'All' || asset.macd === signal)
    .filter((asset) => asset.risk <= maxRisk)
    .filter((asset) => `${asset.symbol} ${asset.name}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'change' ? b.change - a.change : sort === 'volume' ? b.volume - a.volume : b.risk - a.risk), [market, query, signal, maxRisk, sort])

  return <div className="app-shell workspace-page"><ProductNav /><main className="workspace-main">
    <div className="workspace-title"><div><span className="section-kicker"><Filter size={14} /> MULTI-MARKET SCREENER</span><h1>ค้นหาโอกาสและกรองความเสี่ยง</h1><p>กรองสินทรัพย์ด้วยตลาด, technical signal, volatility และ AI risk score</p></div><div className="result-count"><strong>{rows.length}</strong><span>results</span></div></div>
    <section className="screener-controls panel">
      <label className="search-box large"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search BTC, gold, Apple..." /></label>
      <div className="control-group"><span>Market</span><div className="segmented">{['All', 'Crypto', 'Forex', 'Stock', 'Index'].map((item) => <button className={market === item ? 'active' : ''} onClick={() => setMarket(item)} key={item}>{item}</button>)}</div></div>
      <div className="control-group"><span>MACD</span><div className="segmented">{['All', 'Bullish', 'Bearish'].map((item) => <button className={signal === item ? 'active' : ''} onClick={() => setSignal(item)} key={item}>{item}</button>)}</div></div>
      <label className="risk-slider"><span><SlidersHorizontal size={14} /> Max risk <b>{maxRisk}</b></span><input type="range" min="30" max="100" value={maxRisk} onChange={(event) => setMaxRisk(Number(event.target.value))} /></label>
      <label className="sort-select"><ArrowDownUp size={14} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="risk">Risk</option><option value="change">Change</option><option value="volume">Volume</option></select></label>
    </section>
    <section className="screener-table panel">
      <div className="table-head"><span>Asset</span><span>Price</span><span>24H</span><span>Volume</span><span>RSI</span><span>MACD</span><span>Trend</span><span>AI Risk</span></div>
      {rows.map((asset) => <button className="table-row" key={asset.id} onClick={() => navigate(`/asset/${asset.id}`)}>
        <span className="asset-cell"><CoinLogo symbol={asset.symbol} size={34} /><span><b>{asset.symbol}</b><small>{asset.name} · {asset.market}</small></span></span>
        <strong>{money(asset.price)}</strong><span className={asset.change >= 0 ? 'positive' : 'negative'}>{asset.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}%</span>
        <span>${asset.volume}B</span><span>{asset.rsi}</span><span className={asset.macd === 'Bullish' ? 'positive' : 'negative'}>{asset.macd}</span><span>{asset.trend}</span><span><b className={`risk-chip risk-${asset.risk >= 70 ? 'high' : asset.risk >= 50 ? 'medium' : 'low'}`}>{asset.risk}</b></span>
      </button>)}
    </section>
  </main></div>
}

import { useState } from 'react'
import { ArrowLeft, Bell, BrainCircuit, Check, Gauge, ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductNav from '../components/ProductNav'
import CoinLogo from '../components/CoinLogo'
import CandlestickChart from '../components/CandlestickChart'
import { getAsset, money } from '../data/marketUniverse'

export default function AssetDetail() {
  const { assetId } = useParams()
  const navigate = useNavigate()
  const asset = getAsset(assetId)
  const [timeframe, setTimeframe] = useState('4H')
  const [alert, setAlert] = useState(false)
  if (!asset) return <div className="app-shell loading-screen">Asset not found</div>
  const positive = asset.change >= 0
  return <div className="app-shell workspace-page"><ProductNav /><main className="workspace-main">
    <button className="back-button" onClick={() => navigate('/screener')}><ArrowLeft size={16} /> Back to Screener</button>
    <section className="asset-hero"><div className="asset-identity"><CoinLogo symbol={asset.symbol} size={48} /><div><span>{asset.market}</span><h1>{asset.name} <small>{asset.symbol}</small></h1></div></div><div className="asset-quote"><strong>{money(asset.price)}</strong><span className={positive ? 'positive' : 'negative'}>{positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}{positive ? '+' : ''}{asset.change}%</span></div><button className={`alert-button ${alert ? 'active' : ''}`} onClick={() => setAlert(!alert)}>{alert ? <Check size={16} /> : <Bell size={16} />}{alert ? 'Alert active' : 'Set alert'}</button></section>
    <div className="detail-grid"><section className="chart-panel panel"><div className="chart-toolbar"><div><span className="section-kicker">PRICE ACTION</span><h2>Candlestick & volume</h2></div><div className="period-tabs">{['1H', '4H', '1D', '1W'].map((item) => <button className={timeframe === item ? 'active' : ''} onClick={() => setTimeframe(item)} key={item}>{item}</button>)}</div></div><CandlestickChart asset={{ ...asset, id: `${asset.id}-${timeframe}` }} /></section>
      <aside className="analysis-panel panel"><span className="section-kicker"><BrainCircuit size={14} /> AI ANALYSIS</span><h2>{asset.risk >= 70 ? 'ความเสี่ยงสูง ต้องจำกัดขนาดสถานะ' : asset.risk >= 50 ? 'โมเมนตัมมี แต่ยังต้องเฝ้าความผันผวน' : 'โครงสร้างความเสี่ยงอยู่ในระดับควบคุมได้'}</h2><p>AI mock ประเมินจาก technical momentum, volatility, sentiment และ event risk โดยคะแนนนี้ไม่ใช่สัญญาณซื้อขาย</p><div className="analysis-score"><Gauge size={20} /><div><span>Risk score</span><strong>{asset.risk}/100</strong></div></div><div className="scenario bull"><b>Bull case</b><span>ยืนเหนือ {money(asset.resistance)} พร้อม volume เพิ่ม</span></div><div className="scenario bear"><b>Bear case</b><span>หลุด {money(asset.support)} และ MACD อ่อนตัว</span></div></aside></div>
    <section className="indicator-grid">{[['RSI (14)', asset.rsi, asset.rsi > 65 ? 'Overbought zone' : asset.rsi < 40 ? 'Weak momentum' : 'Neutral momentum'], ['MACD', asset.macd, asset.macd === 'Bullish' ? 'Momentum expanding' : 'Momentum contracting'], ['Volatility', `${asset.volatility}/100`, asset.volatility > 70 ? 'Position size caution' : 'Normal range'], ['Sentiment', `${asset.sentiment}%`, asset.sentiment > 65 ? 'Positive bias' : 'Mixed bias']].map(([label, value, note]) => <div className="indicator-card panel" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</section>
    <section className="levels-panel panel"><div><ShieldAlert size={17} /><span>AI levels</span></div><div><span>Support</span><strong>{money(asset.support)}</strong></div><div><span>Resistance</span><strong>{money(asset.resistance)}</strong></div><div><span>Risk/Reward setup</span><strong>1 : 2.1</strong></div></section>
  </main></div>
}

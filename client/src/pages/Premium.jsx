import { useMemo, useState } from 'react'
import {
  AlertTriangle, BarChart3, BellRing, BrainCircuit, Check, Crown,
  Download, Gauge, Lock, Plus, ShieldCheck, Sparkles, Trash2, Unlock,
} from 'lucide-react'
import ProductNav from '../components/ProductNav'
import CoinLogo from '../components/CoinLogo'
import { getStoredPremium, setStoredPremium } from '../data/demoData'
import { MARKET_ASSETS, getAsset, money } from '../data/marketUniverse'

const TABS = [
  ['deep', 'Deep Scan', BrainCircuit],
  ['compare', 'Compare', BarChart3],
  ['alerts', 'Smart Alerts', BellRing],
  ['stress', 'Stress Lab', Gauge],
  ['report', 'AI Report', Download],
]

const INITIAL_ALERTS = [
  { id: 1, asset: 'BTC', rule: 'Risk above', value: 70 },
  { id: 2, asset: 'XAU/USD', rule: 'Price above', value: 3420 },
]

export default function Premium() {
  const [premium, setPremium] = useState(getStoredPremium)
  const [tool, setTool] = useState('deep')
  const [scanId, setScanId] = useState('btc')
  const [leftId, setLeftId] = useState('btc')
  const [rightId, setRightId] = useState('xauusd')
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [alertAsset, setAlertAsset] = useState('SOL')
  const [alertRule, setAlertRule] = useState('Risk above')
  const [alertValue, setAlertValue] = useState('75')
  const [cryptoShock, setCryptoShock] = useState(-12)
  const [stockShock, setStockShock] = useState(-7)
  const [fxShock, setFxShock] = useState(3)

  const asset = getAsset(scanId)
  const left = getAsset(leftId)
  const right = getAsset(rightId)
  const stressLoss = useMemo(() => Math.round(
    Math.abs(cryptoShock) * 218 + Math.abs(stockShock) * 126 + Math.abs(fxShock) * 58,
  ), [cryptoShock, stockShock, fxShock])

  function changePlan(next) {
    setStoredPremium(next)
    setPremium(next)
  }

  function addAlert(event) {
    event.preventDefault()
    setAlerts((items) => [...items, {
      id: Date.now(), asset: alertAsset, rule: alertRule, value: Number(alertValue),
    }])
  }

  function exportReport() {
    const report = `MarketIntel AI Premium Report\n\nPortfolio risk: 64/100\nWatch: BTC, XAU/USD, NASDAQ\nStress estimate: -${money(stressLoss)}\n\nMock demo only. Not financial advice.`
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'marketintel-premium-report.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const options = MARKET_ASSETS.map((item) => <option value={item.id} key={item.id}>{item.symbol} · {item.name}</option>)

  return <div className="app-shell workspace-page"><ProductNav /><main className="workspace-main premium-workspace">
    <section className="premium-hero-panel">
      <div><span className="section-kicker"><Crown size={15} /> MARKETINTEL PREMIUM</span><h1>เครื่องมือวิเคราะห์ลึกที่ใช้งานได้จริง</h1><p>Deep AI scan, เปรียบเทียบสินทรัพย์, smart alerts, portfolio stress test และรายงานส่งออก</p><div className="premium-price"><strong>฿35</strong><span>/ เดือน<br />Mock subscription</span></div></div>
      <div className={`membership-card ${premium ? 'active' : ''}`}><div>{premium ? <Unlock size={22} /> : <Lock size={22} />}<span>Current plan</span><strong>{premium ? 'PREMIUM ACTIVE' : 'FREE PLAN'}</strong></div><button onClick={() => changePlan(!premium)}>{premium ? 'กลับเป็น Free เพื่อดูสถานะล็อก' : 'เปิด Premium Demo'}</button><small>ไม่มีการเรียกเก็บเงินจริง</small></div>
    </section>

    <section className="premium-benefits">{[
      ['Unlimited AI scans', 'วิเคราะห์ได้ไม่จำกัด'],
      ['20 Smart alerts', 'ราคา ข่าว Risk และ event'],
      ['Portfolio stress lab', 'จำลองหลายตลาดพร้อมกัน'],
      ['Export reports', 'ดาวน์โหลดสรุปได้'],
    ].map(([title, note]) => <div key={title}><Check size={16} /><span><b>{title}</b><small>{note}</small></span></div>)}</section>

    <div className="premium-tool-tabs">{TABS.map(([id, label, Icon]) => <button className={tool === id ? 'active' : ''} onClick={() => setTool(id)} key={id}><Icon size={17} /><span>{label}</span>{!premium && <Lock size={11} />}</button>)}</div>

    <section className="premium-tool-shell panel">
      {!premium && <div className="premium-lock"><Crown size={30} /><h2>ฟีเจอร์นี้สำหรับ Premium</h2><p>เปิด Premium Demo เพื่อทดลองเครื่องมือทั้งหมดทันที</p><button className="primary-btn" onClick={() => changePlan(true)}>เปิด Premium Demo ฿35/เดือน</button></div>}
      <div className={`premium-content ${!premium ? 'locked' : ''}`}>
        {tool === 'deep' && <DeepScan asset={asset} scanId={scanId} setScanId={setScanId} options={options} />}
        {tool === 'compare' && <CompareTool left={left} right={right} leftId={leftId} rightId={rightId} setLeftId={setLeftId} setRightId={setRightId} options={options} />}
        {tool === 'alerts' && <AlertsTool alerts={alerts} setAlerts={setAlerts} alertAsset={alertAsset} setAlertAsset={setAlertAsset} alertRule={alertRule} setAlertRule={setAlertRule} alertValue={alertValue} setAlertValue={setAlertValue} addAlert={addAlert} />}
        {tool === 'stress' && <StressTool cryptoShock={cryptoShock} setCryptoShock={setCryptoShock} stockShock={stockShock} setStockShock={setStockShock} fxShock={fxShock} setFxShock={setFxShock} stressLoss={stressLoss} />}
        {tool === 'report' && <ReportTool stressLoss={stressLoss} exportReport={exportReport} />}
      </div>
    </section>
  </main></div>
}

function DeepScan({ asset, scanId, setScanId, options }) {
  const factors = [
    ['Volatility', asset.volatility], ['Technical', asset.rsi],
    ['Sentiment risk', 100 - asset.sentiment], ['Event exposure', asset.market === 'Forex' ? 82 : 61],
  ]
  return <div className="deep-scan-layout">
    <div className="deep-scan-control"><span className="section-kicker"><Sparkles size={14} /> DEEP AI SCAN</span><h2>เหตุผลเบื้องหลัง Risk Score</h2><label>Asset<select value={scanId} onChange={(event) => setScanId(event.target.value)}>{options}</select></label><div className="scan-asset"><CoinLogo symbol={asset.symbol} size={42} /><div><b>{asset.symbol}</b><span>{money(asset.price)} · {asset.change}%</span></div></div></div>
    <div className="deep-score"><span>Composite risk</span><strong>{asset.risk}</strong><small>/100</small><i style={{ '--score': `${asset.risk}%` }} /></div>
    <div className="risk-breakdown">{factors.map(([label, value]) => <div key={label}><span>{label}<b>{value}</b></span><i><em style={{ width: `${value}%` }} /></i></div>)}</div>
    <div className="deep-conclusion"><ShieldCheck size={20} /><div><b>AI conclusion</b><p>{asset.risk >= 70 ? 'ความเสี่ยงสูง ควรลดขนาดสถานะและตั้ง stop ชัดเจน' : 'โครงสร้างยังสมดุล แต่ควรติดตาม event risk และแนวรับสำคัญ'}</p></div></div>
  </div>
}

function CompareTool({ left, right, leftId, rightId, setLeftId, setRightId, options }) {
  const rows = [
    ['Price', money(left.price), money(right.price)], ['24H change', `${left.change}%`, `${right.change}%`],
    ['AI risk', left.risk, right.risk], ['Volatility', left.volatility, right.volatility],
    ['RSI', left.rsi, right.rsi], ['Sentiment', `${left.sentiment}%`, `${right.sentiment}%`],
  ]
  return <div className="compare-tool"><div className="compare-selectors"><label>Asset A<select value={leftId} onChange={(event) => setLeftId(event.target.value)}>{options}</select></label><span>VS</span><label>Asset B<select value={rightId} onChange={(event) => setRightId(event.target.value)}>{options}</select></label></div><div className="compare-head"><div><CoinLogo symbol={left.symbol} size={44} /><b>{left.symbol}</b><span>{left.name}</span></div><div><CoinLogo symbol={right.symbol} size={44} /><b>{right.symbol}</b><span>{right.name}</span></div></div>{rows.map(([label, a, b]) => <div className="compare-row" key={label}><strong>{a}</strong><span>{label}</span><strong>{b}</strong></div>)}<div className="compare-verdict"><BrainCircuit size={19} /><p><b>AI verdict:</b> {left.risk < right.risk ? left.symbol : right.symbol} มี risk profile ต่ำกว่าในข้อมูล mock ปัจจุบัน</p></div></div>
}

function AlertsTool(props) {
  const { alerts, setAlerts, alertAsset, setAlertAsset, alertRule, setAlertRule, alertValue, setAlertValue, addAlert } = props
  return <div className="alerts-tool"><form onSubmit={addAlert}><span className="section-kicker"><Plus size={14} /> CREATE SMART ALERT</span><label>Asset<select value={alertAsset} onChange={(event) => setAlertAsset(event.target.value)}>{MARKET_ASSETS.map((item) => <option key={item.id}>{item.symbol}</option>)}</select></label><label>Condition<select value={alertRule} onChange={(event) => setAlertRule(event.target.value)}><option>Risk above</option><option>Price above</option><option>Price below</option><option>RSI above</option></select></label><label>Value<input type="number" value={alertValue} onChange={(event) => setAlertValue(event.target.value)} /></label><button className="primary-btn">Create alert</button></form><div className="premium-alert-list"><div className="panel-title"><h2>Active alerts</h2><span>{alerts.length}/20</span></div>{alerts.map((item) => <div className="premium-alert-row" key={item.id}><BellRing size={17} /><div><b>{item.asset}</b><span>{item.rule} {item.value}</span></div><i>ACTIVE</i><button onClick={() => setAlerts((items) => items.filter((alert) => alert.id !== item.id))}><Trash2 size={15} /></button></div>)}</div></div>
}

function StressTool({ cryptoShock, setCryptoShock, stockShock, setStockShock, fxShock, setFxShock, stressLoss }) {
  const controls = [
    ['Crypto shock', cryptoShock, setCryptoShock, -30, 10],
    ['Stocks shock', stockShock, setStockShock, -25, 10],
    ['USD move', fxShock, setFxShock, -10, 10],
  ]
  return <div className="stress-tool"><div><span className="section-kicker"><Gauge size={14} /> PORTFOLIO STRESS LAB</span><h2>จำลองหลายตลาดเคลื่อนไหวพร้อมกัน</h2><p>ปรับ scenario แล้วระบบจะประเมิน drawdown จากพอร์ต mock</p><div className="stress-sliders">{controls.map(([label, value, setter, min, max]) => <label key={label}><span>{label}<b>{value > 0 ? '+' : ''}{value}%</b></span><input type="range" min={min} max={max} value={value} onChange={(event) => setter(Number(event.target.value))} /></label>)}</div></div><div className="stress-result"><AlertTriangle size={24} /><span>Estimated impact</span><strong>-{money(stressLoss)}</strong><b>-{(stressLoss / 18693 * 100).toFixed(2)}%</b><small>{stressLoss > 3000 ? 'Severe · ลด leverage' : 'Manageable · ตั้ง risk limit'}</small></div></div>
}

function ReportTool({ exportReport }) {
  return <div className="report-tool"><div className="report-preview"><div><Crown size={18} /><span>MARKETINTEL PREMIUM REPORT</span><small>Generated mock report</small></div><h2>Portfolio risk elevated around macro events</h2><p>พอร์ตมี AI risk score 64/100 โดย crypto volatility และ US CPI/FOMC เป็นปัจจัยเสี่ยงหลัก</p><div className="report-kpis"><span><b>64</b>Risk score</span><span><b>3</b>High impact events</span><span><b>2</b>Assets to watch</span></div><h3>Recommended checklist</h3><ul><li>จำกัดสินทรัพย์ risk สูงไม่เกิน 25%</li><li>ตั้ง alert ก่อน CPI และ FOMC</li><li>ทบทวน stop loss ของ BTC และ NASDAQ</li></ul><small>Mock demo · ไม่ใช่คำแนะนำทางการเงิน</small></div><button className="primary-btn report-download" onClick={exportReport}><Download size={17} /> Download report</button></div>
}

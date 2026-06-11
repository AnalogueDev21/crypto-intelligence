import { useMemo, useState } from 'react'
import {
  AlertTriangle, BarChart3, BellRing, BookOpen, BrainCircuit, Calculator,
  Check, Crown, Download, Gauge, Lock, MessageSquare, Network, Plus,
  Send, ShieldCheck, Sparkles, Trash2, Unlock,
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
  ['chat', 'AI Chat', MessageSquare],
  ['calculator', 'Calculators', Calculator],
  ['journal', 'Journal', BookOpen],
  ['analytics', 'Analytics', Network],
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
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'สวัสดีครับ ผมช่วยสรุปความเสี่ยง เปรียบเทียบสินทรัพย์ และอธิบายผลกระทบจากข่าวในข้อมูล mock นี้ได้' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [journal, setJournal] = useState([
    { id: 1, asset: 'BTC', side: 'Long', entry: 101200, exit: 104800, result: 288, note: 'รอ breakout ยืนยันและลดขนาดก่อน CPI' },
    { id: 2, asset: 'TSLA', side: 'Long', entry: 191, exit: 184.2, result: -136, note: 'เข้าเร็วเกินไปก่อน trend กลับตัว' },
  ])

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

  function sendChat(question = chatInput) {
    const clean = question.trim()
    if (!clean) return
    const lower = clean.toLowerCase()
    let answer = 'จากข้อมูล mock ตอนนี้ ควรเน้นจำกัด position size, ตรวจ event risk และใช้แนวรับเป็นจุดยกเลิกสมมติฐาน'
    if (lower.includes('btc') || clean.includes('บิต')) answer = 'BTC มีโมเมนตัมบวกและ sentiment 72% แต่ยังมี risk 58/100 แนวรับ mock อยู่ที่ $101,200 และแนวต้าน $108,500 ควรระวัง volatility ช่วง CPI/FOMC'
    else if (lower.includes('gold') || lower.includes('xau') || clean.includes('ทอง')) answer = 'XAU/USD มี risk 62/100 และไวต่อทิศทางดอลลาร์ หาก CPI สูงกว่าคาด ทองอาจผันผวนแรง ควรลด leverage ก่อนประกาศข่าว'
    else if (lower.includes('compare') || clean.includes('เทียบ')) answer = 'หากเน้นความเสี่ยงต่ำกว่า AAPL และ S&P 500 ดูสมดุลกว่า SOL/TSLA แต่ผลตอบแทนคาดหวังและ volatility ก็ต่ำลงตามกัน'
    else if (lower.includes('portfolio') || clean.includes('พอร์ต')) answer = 'พอร์ต mock มี risk ราว 64/100 จุดเสี่ยงหลักคือ crypto concentration และ macro correlation ระหว่าง BTC, NASDAQ และดอลลาร์'
    setChatMessages((items) => [...items, { role: 'user', text: clean }, { role: 'assistant', text: answer }])
    setChatInput('')
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
        {tool === 'chat' && <ChatTool messages={chatMessages} input={chatInput} setInput={setChatInput} sendChat={sendChat} />}
        {tool === 'calculator' && <CalculatorTool />}
        {tool === 'journal' && <JournalTool journal={journal} setJournal={setJournal} />}
        {tool === 'analytics' && <AnalyticsTool />}
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

function ChatTool({ messages, input, setInput, sendChat }) {
  const prompts = ['BTC เสี่ยงอะไรตอนนี้?', 'เทียบทองกับ BTC', 'พอร์ตมีจุดอ่อนอะไร?', 'ควรระวังข่าวไหน?']
  return <div className="ai-chat-tool">
    <aside><span className="section-kicker"><MessageSquare size={14} /> AI MARKET COPILOT</span><h2>ถามข้อมูลตลาดแบบมีบริบท</h2><p>คำตอบอ้างอิงข้อมูล mock ในระบบและเน้นการอธิบายความเสี่ยง ไม่ออกคำสั่งซื้อขาย</p><div className="prompt-list">{prompts.map((prompt) => <button key={prompt} onClick={() => sendChat(prompt)}>{prompt}</button>)}</div></aside>
    <section className="chat-window"><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === 'assistant' ? 'AI' : 'YOU'}</span><p>{message.text}</p></div>)}</div><form onSubmit={(event) => { event.preventDefault(); sendChat() }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="ถามเกี่ยวกับ BTC, ทอง, พอร์ต หรือความเสี่ยง..." /><button aria-label="Send question"><Send size={17} /></button></form></section>
  </div>
}

function CalculatorTool() {
  const [capital, setCapital] = useState(100000)
  const [riskPercent, setRiskPercent] = useState(1)
  const [entry, setEntry] = useState(100)
  const [stop, setStop] = useState(95)
  const [target, setTarget] = useState(112)
  const [leverage, setLeverage] = useState(5)
  const riskAmount = capital * (riskPercent / 100)
  const stopDistance = Math.abs(entry - stop) || 1
  const quantity = riskAmount / stopDistance
  const reward = Math.abs(target - entry) * quantity
  const rr = reward / riskAmount
  const liquidation = entry * (1 - (1 / leverage) * .9)
  return <div className="calculator-tool">
    <div className="calculator-form"><span className="section-kicker"><Calculator size={14} /> POSITION SIZE CALCULATOR</span><h2>กำหนดความเสี่ยงก่อนเปิดสถานะ</h2><div className="calculator-inputs"><label>Capital<input type="number" value={capital} onChange={(event) => setCapital(Number(event.target.value))} /></label><label>Risk per trade (%)<input type="number" step=".1" value={riskPercent} onChange={(event) => setRiskPercent(Number(event.target.value))} /></label><label>Entry<input type="number" value={entry} onChange={(event) => setEntry(Number(event.target.value))} /></label><label>Stop loss<input type="number" value={stop} onChange={(event) => setStop(Number(event.target.value))} /></label><label>Target<input type="number" value={target} onChange={(event) => setTarget(Number(event.target.value))} /></label><label>Leverage<input type="number" min="1" value={leverage} onChange={(event) => setLeverage(Math.max(1, Number(event.target.value)))} /></label></div></div>
    <div className="calculator-results"><div><span>Risk amount</span><strong>{money(riskAmount)}</strong><small>ขาดทุนสูงสุดตามแผน</small></div><div><span>Position quantity</span><strong>{quantity.toFixed(4)}</strong><small>จากระยะ entry ถึง stop</small></div><div><span>Risk / Reward</span><strong>1 : {rr.toFixed(2)}</strong><small>{rr >= 2 ? 'ผ่านเกณฑ์ mock' : 'ผลตอบแทนยังไม่คุ้มความเสี่ยง'}</small></div><div><span>Est. liquidation</span><strong>{money(liquidation)}</strong><small>ค่าประมาณแบบ simplified</small></div></div>
  </div>
}

function JournalTool({ journal, setJournal }) {
  const [asset, setAsset] = useState('ETH')
  const [side, setSide] = useState('Long')
  const [entry, setEntry] = useState('3800')
  const [exit, setExit] = useState('3900')
  const [note, setNote] = useState('')
  const wins = journal.filter((item) => item.result > 0).length
  const net = journal.reduce((sum, item) => sum + item.result, 0)
  function addTrade(event) {
    event.preventDefault()
    const entryValue = Number(entry)
    const exitValue = Number(exit)
    const direction = side === 'Long' ? 1 : -1
    const result = Math.round((exitValue - entryValue) * direction)
    setJournal((items) => [{ id: Date.now(), asset, side, entry: entryValue, exit: exitValue, result, note: note || 'ไม่มีบันทึกเพิ่มเติม' }, ...items])
    setNote('')
  }
  return <div className="journal-tool"><form onSubmit={addTrade}><span className="section-kicker"><BookOpen size={14} /> TRADING JOURNAL</span><h2>บันทึกเหตุผล ไม่ใช่แค่กำไรขาดทุน</h2><div className="journal-form-grid"><label>Asset<select value={asset} onChange={(event) => setAsset(event.target.value)}>{MARKET_ASSETS.map((item) => <option key={item.id}>{item.symbol}</option>)}</select></label><label>Side<select value={side} onChange={(event) => setSide(event.target.value)}><option>Long</option><option>Short</option></select></label><label>Entry<input type="number" value={entry} onChange={(event) => setEntry(event.target.value)} /></label><label>Exit<input type="number" value={exit} onChange={(event) => setExit(event.target.value)} /></label></div><label>Trade note<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="เหตุผลเข้า, ความรู้สึก, สิ่งที่ควรปรับ..." /></label><button className="primary-btn">Add journal entry</button></form><section className="journal-history"><div className="journal-kpis"><span><b>{journal.length}</b>Trades</span><span><b>{journal.length ? Math.round((wins / journal.length) * 100) : 0}%</b>Win rate</span><span><b className={net >= 0 ? 'positive' : 'negative'}>{net >= 0 ? '+' : ''}{money(net)}</b>Net result</span></div>{journal.map((item) => <article className="journal-row" key={item.id}><div><b>{item.asset}</b><span>{item.side} · {money(item.entry)} → {money(item.exit)}</span></div><strong className={item.result >= 0 ? 'positive' : 'negative'}>{item.result >= 0 ? '+' : ''}{money(item.result)}</strong><p>{item.note}</p><button onClick={() => setJournal((items) => items.filter((trade) => trade.id !== item.id))}><Trash2 size={15} /></button></article>)}</section></div>
}

function AnalyticsTool() {
  const allocation = [['BTC', 45, '#f7931a'], ['ETH', 28, '#8c8cda'], ['Gold', 14, '#f0c85a'], ['AAPL', 13, '#d7d7e2']]
  const matrix = [
    ['BTC', 1, .78, -.12, .42], ['ETH', .78, 1, -.08, .48],
    ['Gold', -.12, -.08, 1, -.18], ['NASDAQ', .42, .48, -.18, 1],
  ]
  return <div className="analytics-tool"><div className="analytics-overview"><span className="section-kicker"><Network size={14} /> PORTFOLIO ANALYTICS</span><h2>เห็นความเสี่ยงที่ซ่อนอยู่ระหว่างสินทรัพย์</h2><div className="allocation-bar">{allocation.map(([name, value, color]) => <i key={name} style={{ width: `${value}%`, background: color }} title={`${name} ${value}%`} />)}</div><div className="allocation-legend">{allocation.map(([name, value, color]) => <span key={name}><i style={{ background: color }} />{name}<b>{value}%</b></span>)}</div><div className="concentration-warning"><AlertTriangle size={18} /><p><b>Concentration warning:</b> Crypto รวม 73% ของพอร์ต และ BTC/ETH มี correlation สูง อาจทำให้ drawdown เกิดพร้อมกัน</p></div></div><div className="correlation-panel"><h3>Correlation heatmap</h3><div className="correlation-grid"><span />{matrix.map(([name]) => <b key={`h-${name}`}>{name}</b>)}{matrix.flatMap(([row, ...values]) => [<b key={`r-${row}`}>{row}</b>, ...values.map((value, index) => <i key={`${row}-${index}`} style={{ '--correlation': Math.abs(value) }}>{value.toFixed(2)}</i>)])}</div><small>ใกล้ 1 = เคลื่อนไหวทิศทางเดียวกันสูง · ใกล้ -1 = สวนทางกัน</small></div><div className="analytics-insights">{[['Diversification', 52, 'ยังพึ่งพา crypto มากเกินไป'], ['Concentration', 73, 'BTC + ETH รวมกันสูง'], ['Macro sensitivity', 68, 'ไวต่อ CPI, FOMC และดอลลาร์'], ['Hedge quality', 41, 'Gold ช่วยลด correlation บางส่วน']].map(([label, score, note]) => <div key={label}><span>{label}<b>{score}/100</b></span><i><em style={{ width: `${score}%` }} /></i><small>{note}</small></div>)}</div></div>
}

function ReportTool({ exportReport }) {
  return <div className="report-tool"><div className="report-preview"><div><Crown size={18} /><span>MARKETINTEL PREMIUM REPORT</span><small>Generated mock report</small></div><h2>Portfolio risk elevated around macro events</h2><p>พอร์ตมี AI risk score 64/100 โดย crypto volatility และ US CPI/FOMC เป็นปัจจัยเสี่ยงหลัก</p><div className="report-kpis"><span><b>64</b>Risk score</span><span><b>3</b>High impact events</span><span><b>2</b>Assets to watch</span></div><h3>Recommended checklist</h3><ul><li>จำกัดสินทรัพย์ risk สูงไม่เกิน 25%</li><li>ตั้ง alert ก่อน CPI และ FOMC</li><li>ทบทวน stop loss ของ BTC และ NASDAQ</li></ul><small>Mock demo · ไม่ใช่คำแนะนำทางการเงิน</small></div><button className="primary-btn report-download" onClick={exportReport}><Download size={17} /> Download report</button></div>
}

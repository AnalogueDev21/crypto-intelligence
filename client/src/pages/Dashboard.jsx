import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Bell, CalendarDays, ChevronRight, Crown, Globe2, Lock,
  LogOut, RefreshCw, Search, Settings2, ShieldAlert, Sparkles, TrendingDown,
  TrendingUp, Unlock, X,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import {
  DEMO_ASSETS, PREMIUM_KEY, getLocalWatchlist, getStoredLanguage,
  getStoredPremium, setStoredLanguage, setStoredPremium, WATCHLIST_KEY,
} from '../data/demoData'
import CoinLogo from '../components/CoinLogo'
import PriceChart from '../components/PriceChart'
import { formatPrice, getMarketSnapshot } from '../data/marketData'
import ProductNav from '../components/ProductNav'

const copy = {
  th: {
    brand: 'MarketIntel AI',
    demo: 'เดโม',
    free: 'Free',
    premium: 'Premium',
    upgrade: 'อัปเกรด 35 บาท/เดือน',
    downgrade: 'กลับเป็น Free',
    marketOverview: 'ภาพรวมตลาด',
    marketHint: 'คริปโต ฟอเร็กซ์ หุ้น และดัชนีในเรดาร์เดียว',
    aiBrief: 'AI สรุปความเสี่ยงวันนี้',
    briefTitle: 'ตลาดยังเสี่ยงจากดอกเบี้ย ข่าวกำกับดูแล และความผันผวนของหุ้นเทค',
    briefBody: 'AI mock พบว่า crypto มีแรงหนุนจากกระแส ETF แต่ยังถูกกดดันจาก regulation ส่วน forex โฟกัส CPI/FOMC และหุ้นเทคมีความเสี่ยงจาก earnings กับ valuation ที่สูง',
    highImpact: 'เหตุการณ์ Impact สูง',
    watch: 'จับตา',
    scanner: 'AI Risk Scanner',
    scannerHint: 'คะแนนสูงคือความเสี่ยงสูง ไม่ใช่สัญญาณซื้อ',
    calendar: 'Economic & Crypto Calendar',
    calendarHint: 'สไตล์ Forex Factory สำหรับเหตุการณ์ที่อาจเพิ่ม volatility',
    premiumTitle: 'ปลดล็อก Premium',
    premiumBody: 'จำลองการสมัครสมาชิก 35 บาท/เดือน เพื่อดูว่าผู้ใช้จะได้ฟีเจอร์อะไรเพิ่ม',
    unlocked: 'ปลดล็อกแล้ว',
    locked: 'ล็อก',
    search: 'ค้นหาสินทรัพย์หรือข่าว',
    watchlist: 'Watchlist',
    manageWatchlist: 'จัดการ Watchlist',
    priceChart: 'กราฟราคา',
    aiSummary: 'สรุป AI',
    actionPlan: 'สิ่งที่ควรทำ',
    disclaimer: 'ข้อมูลทั้งหมดเป็น mock demo เพื่อประกอบการตัดสินใจ ไม่ใช่คำแนะนำทางการเงิน',
    alerts: 'Smart Alerts',
    portfolioRisk: 'Portfolio Risk',
    compare: 'Compare Assets',
    deepSummary: 'Deep AI Summary',
    refresh: 'รีเฟรชเดโม',
    logout: 'ออก',
  },
  en: {
    brand: 'MarketIntel AI',
    demo: 'Demo',
    free: 'Free',
    premium: 'Premium',
    upgrade: 'Upgrade ฿35/mo',
    downgrade: 'Back to Free',
    marketOverview: 'Market Overview',
    marketHint: 'Crypto, forex, stocks, and indices in one radar',
    aiBrief: 'Today AI Risk Brief',
    briefTitle: 'Rates, regulation, and tech-stock volatility remain the main risks',
    briefBody: 'The mock AI sees ETF flow supporting crypto, regulation capping risk appetite, CPI/FOMC driving forex, and tech valuations making equity reactions sharper.',
    highImpact: 'High-impact events',
    watch: 'Watch',
    scanner: 'AI Risk Scanner',
    scannerHint: 'Higher score means higher risk, not a buy signal',
    calendar: 'Economic & Crypto Calendar',
    calendarHint: 'Forex Factory style events that can increase volatility',
    premiumTitle: 'Premium Unlock',
    premiumBody: 'Mock a ฿35/month subscription and show what users unlock.',
    unlocked: 'Unlocked',
    locked: 'Locked',
    search: 'Search asset or news',
    watchlist: 'Watchlist',
    manageWatchlist: 'Manage Watchlist',
    priceChart: 'Price chart',
    aiSummary: 'AI Summary',
    actionPlan: 'Action plan',
    disclaimer: 'All data is mock demo intelligence for decision support, not financial advice.',
    alerts: 'Smart Alerts',
    portfolioRisk: 'Portfolio Risk',
    compare: 'Compare Assets',
    deepSummary: 'Deep AI Summary',
    refresh: 'Refresh demo',
    logout: 'Logout',
  },
}

const intelligence = [
  { id: 1, assets: ['BTC', 'ETH'], type: 'crypto', score: 72, sentiment: 'Bullish', titleTh: 'เงินไหลเข้า ETF หนุน Bitcoin แต่แรงขายทำกำไรยังสูง', titleEn: 'ETF inflows support Bitcoin, but profit taking remains elevated', summaryTh: 'โมเมนตัมเป็นบวกแต่ควรระวังการไล่ราคาในช่วงข่าวแรง', summaryEn: 'Momentum is constructive, but chasing price during headline spikes is risky.', actionTh: 'รอย่อหรือแบ่งไม้ ลด leverage', actionEn: 'Wait for pullbacks or scale in, reduce leverage' },
  { id: 2, assets: ['XAU/USD', 'EUR/USD'], type: 'forex', score: 81, sentiment: 'Bearish', titleTh: 'CPI และ FOMC ทำให้ทองและคู่เงินหลักเสี่ยงผันผวน', titleEn: 'CPI and FOMC raise volatility risk for gold and major FX', summaryTh: 'ดอลลาร์อาจแกว่งแรงตามคาดการณ์ดอกเบี้ย ส่งผลโดยตรงต่อทองและ EUR/USD', summaryEn: 'The dollar can swing with rate expectations, directly affecting gold and EUR/USD.', actionTh: 'หลีกเลี่ยงเปิดสถานะใหญ่ก่อนข่าว', actionEn: 'Avoid large entries before the event' },
  { id: 3, assets: ['NASDAQ', 'TSLA', 'AAPL'], type: 'stock', score: 67, sentiment: 'Neutral', titleTh: 'หุ้นเทคมีแรงซื้อ แต่ valuation ทำให้ความเสี่ยงขาลงยังอยู่', titleEn: 'Tech demand is firm, but valuation keeps downside risk alive', summaryTh: 'ตลาดตอบรับ earnings ไว หาก guidance อ่อนอาจเกิดแรงขายเร็ว', summaryEn: 'Earnings reactions can be sharp if guidance disappoints.', actionTh: 'ใช้ stop และดู breadth ตลาด', actionEn: 'Use stops and monitor market breadth' },
  { id: 4, assets: ['SOL', 'ETH'], type: 'crypto', score: 54, sentiment: 'Bullish', titleTh: 'กิจกรรมบนเชนฟื้นตัว แต่เหรียญ beta สูงยังแกว่งแรง', titleEn: 'On-chain activity improves, while high-beta assets stay volatile', summaryTh: 'SOL และ ETH ได้แรงหนุนจาก activity แต่ความเสี่ยงจากข่าว regulation ยังมี', summaryEn: 'SOL and ETH benefit from activity, but regulatory headline risk remains.', actionTh: 'ถือเฉพาะขนาดที่รับ drawdown ได้', actionEn: 'Size positions for tolerable drawdown' },
]

const calendar = [
  { time: 'Tue 19:30', impact: 'High', market: 'Forex', eventTh: 'US CPI', eventEn: 'US CPI', noteTh: 'กระทบทอง ดอลลาร์ และหุ้น', noteEn: 'Moves gold, USD, and equities' },
  { time: 'Wed 01:00', impact: 'High', market: 'Macro', eventTh: 'FOMC Statement', eventEn: 'FOMC Statement', noteTh: 'เสี่ยง gap หลังประกาศ', noteEn: 'Gap risk after release' },
  { time: 'Thu 15:00', impact: 'Medium', market: 'Crypto', eventTh: 'Token Unlock รอบใหญ่', eventEn: 'Major Token Unlock', noteTh: 'กดดันเหรียญ beta สูง', noteEn: 'Pressure on high-beta tokens' },
  { time: 'Fri 20:30', impact: 'Medium', market: 'Stock', eventTh: 'Earnings หุ้นเทค', eventEn: 'Tech Earnings', noteTh: 'มีผลต่อ NASDAQ', noteEn: 'Impacts NASDAQ' },
]

const premiumFeatures = ['alerts', 'portfolioRisk', 'compare', 'deepSummary']
const riskColor = (score) => score >= 75 ? '#ff6575' : score >= 55 ? '#f5c451' : '#b7ed55'

export default function Dashboard({ demoMode, onEndDemo }) {
  const navigate = useNavigate()
  const [language, setLanguage] = useState(getStoredLanguage)
  const [premium, setPremium] = useState(getStoredPremium)
  const [watchlist, setWatchlist] = useState(() => DEMO_ASSETS.filter((asset) => getLocalWatchlist().includes(asset.id)))
  const [query, setQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [selectedIntel, setSelectedIntel] = useState(null)
  const [chartPeriod, setChartPeriod] = useState('24H')
  const [refreshing, setRefreshing] = useState(false)
  const t = copy[language]

  useEffect(() => {
    setStoredLanguage(language)
  }, [language])

  useEffect(() => {
    setStoredPremium(premium)
  }, [premium])

  const symbols = useMemo(() => watchlist.map((asset) => asset.symbol), [watchlist])
  const relevantIntel = useMemo(() => intelligence.filter((item) => item.assets.some((symbol) => symbols.includes(symbol))), [symbols])
  const filteredIntel = useMemo(() => {
    const lower = query.toLowerCase()
    return relevantIntel.filter((item) => `${item.assets.join(' ')} ${item.titleTh} ${item.titleEn}`.toLowerCase().includes(lower))
  }, [query, relevantIntel])
  const riskScore = relevantIntel.length ? Math.max(...relevantIntel.map((item) => item.score)) : 32
  const selectedMarket = selectedAsset ? getMarketSnapshot(selectedAsset.symbol, chartPeriod) : null

  function setPlan(nextPremium) {
    setPremium(nextPremium)
    localStorage.setItem(PREMIUM_KEY, nextPremium ? 'true' : 'false')
  }

  function removeAsset(id) {
    const next = watchlist.filter((asset) => asset.id !== id)
    setWatchlist(next)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next.map((asset) => asset.id)))
  }

  function refreshDemo() {
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 600)
  }

  async function logout() {
    if (demoMode) onEndDemo()
    else await supabase.auth.signOut()
    navigate('/login')
  }

  return <div className="app-shell"><ProductNav /><div className="page">
    <nav className="topbar">
      <button className="brand brand-button" onClick={() => navigate('/dashboard')}><ShieldAlert size={20} /><span className="brand-label">{t.brand}</span>{demoMode && <span className="demo-badge">{t.demo}</span>}</button>
      <div className="top-actions">
        <button className="plan-pill" onClick={() => navigate('/premium')}>{premium ? <Crown size={15} /> : <Lock size={15} />}{premium ? t.premium : t.free}</button>
        <button className="icon-btn" aria-label="language" onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}><Globe2 size={18} /></button>
        <button className="icon-btn desktop-action" aria-label={t.manageWatchlist} onClick={() => navigate('/select-coins')}><Settings2 size={18} /></button>
        <button className="icon-btn desktop-action" aria-label={t.logout} onClick={logout}><LogOut size={18} /></button>
      </div>
    </nav>

    <section className="risk-panel-new" id="brief" style={{ '--risk': riskColor(riskScore) }}>
      <div className="risk-gauge"><div className="risk-gauge-ring"><span>{riskScore}</span><small>/100</small></div><div><span className="status-dot" />AI Risk Score</div></div>
      <div className="risk-content">
        <div className="section-kicker"><Sparkles size={14} /> {t.aiBrief}</div>
        <h1>{t.briefTitle}</h1>
        <p>{t.briefBody}</p>
        <div className="insight-row">
          <span><ShieldAlert size={15} /> {relevantIntel.filter((item) => item.score >= 70).length} {t.highImpact}</span>
          <span><Bell size={15} /> {t.watch}: {symbols.slice(0, 4).join(', ')}</span>
        </div>
      </div>
    </section>

    <section className="premium-strip">
      <div><div className="section-kicker"><Crown size={14} /> {t.premiumTitle}</div><p>{t.premiumBody}</p></div>
      <div className="unlock-grid">{premiumFeatures.map((key) => <div className={`unlock-item ${premium ? 'active' : ''}`} key={key}>{premium ? <Unlock size={15} /> : <Lock size={15} />}<span>{t[key]}</span><small>{premium ? t.unlocked : t.locked}</small></div>)}</div>
      <button className="primary-btn premium-btn" onClick={() => navigate('/premium')}>{premium ? 'เปิด Premium Center' : t.upgrade}</button>
    </section>

    <section className="market-section" id="markets">
      <div className="section-head"><div><div className="section-kicker"><Activity size={14} /> {t.marketOverview}</div><h2>{t.marketHint}</h2></div><button className="text-btn" onClick={refreshDemo}><RefreshCw size={14} className={refreshing ? 'spin' : ''} /> {t.refresh}</button></div>
      <div className="market-grid">{watchlist.map((asset) => {
        const market = getMarketSnapshot(asset.symbol)
        const positive = market.periodChange >= 0
        return <button className="market-card" key={asset.id} onClick={() => { setSelectedAsset(asset); setChartPeriod('24H') }}>
          <div className="market-card-head"><CoinLogo symbol={asset.symbol} color={asset.color} size={34} /><div><strong>{asset.symbol}</strong><span>{asset.name} · {asset.type}</span></div><ChevronRight size={17} /></div>
          <div className="market-card-price"><strong>{formatPrice(market.price, asset.symbol)}</strong><span className={positive ? 'positive' : 'negative'}>{positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{positive ? '+' : ''}{market.periodChange.toFixed(2)}%</span></div>
          <PriceChart data={market.data} color={positive ? '#b7ed55' : '#ff6575'} compact />
        </button>
      })}</div>
    </section>

    <div className="dashboard-grid">
      <main id="scanner">
        <div className="section-head"><div><div className="section-kicker"><ShieldAlert size={14} /> {t.scanner}</div><h2>{t.scannerHint}</h2></div></div>
        <div className="feed-toolbar"><label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label></div>
        <div className="panel scanner-list">{filteredIntel.map((item) => <button className="scanner-row" key={item.id} onClick={() => setSelectedIntel(item)}>
          <div className="score-box" style={{ color: riskColor(item.score), background: `${riskColor(item.score)}16` }}><strong>{item.score}</strong><span>RISK</span></div>
          <div><div className="news-tags"><span>{item.type}</span><i>{item.sentiment}</i></div><div className="news-title">{language === 'th' ? item.titleTh : item.titleEn}</div><div className="news-meta"><span>{item.assets.join(' / ')}</span><span>{language === 'th' ? item.actionTh : item.actionEn}</span></div></div>
          <ChevronRight size={19} />
        </button>)}</div>
      </main>

      <aside id="watchlist">
        <div className="section-head"><div><div className="section-kicker">{t.watchlist}</div><h2>{watchlist.length} Assets</h2></div></div>
        <div className="panel side-panel">
          <div className="coin-list">{watchlist.map((asset) => <div className="coin-row" key={asset.id}><CoinLogo symbol={asset.symbol} color={asset.color} size={34} /><div><div className="coin-symbol">{asset.symbol}</div><div className="coin-name">{asset.name}</div></div><button className="remove-coin" aria-label={`remove ${asset.symbol}`} onClick={() => removeAsset(asset.id)}><X size={15} /></button></div>)}</div>
          <button className="secondary-btn button-with-icon" onClick={() => navigate('/select-coins')}><Settings2 size={16} /> {t.manageWatchlist}</button>
        </div>
      </aside>
    </div>

    <section className="calendar-section" id="calendar">
      <div className="section-head"><div><div className="section-kicker"><CalendarDays size={14} /> {t.calendar}</div><h2>{t.calendarHint}</h2></div></div>
      <div className="panel calendar-list">{calendar.map((event) => <div className="calendar-row" key={`${event.time}-${event.eventEn}`}><strong>{event.time}</strong><span className={`impact ${event.impact.toLowerCase()}`}>{event.impact}</span><div><b>{language === 'th' ? event.eventTh : event.eventEn}</b><small>{event.market} · {language === 'th' ? event.noteTh : event.noteEn}</small></div></div>)}</div>
    </section>

    <div className="footer-note">{t.disclaimer}</div>
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <a href="#brief"><ShieldAlert size={18} /><span>Brief</span></a>
      <a href="#markets"><Activity size={18} /><span>Markets</span></a>
      <a href="#scanner"><Search size={18} /><span>Scanner</span></a>
      <a href="#calendar"><CalendarDays size={18} /><span>Calendar</span></a>
      <button type="button" onClick={() => navigate('/select-coins')}><Settings2 size={18} /><span>Assets</span></button>
    </nav>
  </div>

  {selectedIntel && <div className="modal-backdrop" onMouseDown={() => setSelectedIntel(null)}><section className="news-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedIntel(null)}><X size={19} /></button><div className="modal-score" style={{ color: riskColor(selectedIntel.score), background: `${riskColor(selectedIntel.score)}16` }}><ShieldAlert size={18} /> Risk Score {selectedIntel.score}</div><h2>{language === 'th' ? selectedIntel.titleTh : selectedIntel.titleEn}</h2><div className="modal-section"><small>{t.aiSummary}</small><p>{language === 'th' ? selectedIntel.summaryTh : selectedIntel.summaryEn}</p></div><div className="modal-section action-box"><small>{t.actionPlan}</small><p>{language === 'th' ? selectedIntel.actionTh : selectedIntel.actionEn}</p></div><div className="modal-footer"><div>{selectedIntel.assets.map((asset) => <span className="tag" key={asset}>{asset}</span>)}</div>{!premium && <button className="secondary-btn button-with-icon compact" onClick={() => setPlan(true)}><Crown size={16} /> {t.upgrade}</button>}</div></section></div>}

  {selectedAsset && selectedMarket && <div className="modal-backdrop" onMouseDown={() => setSelectedAsset(null)}><section className="coin-modal" onMouseDown={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={() => setSelectedAsset(null)}><X size={19} /></button>
    <div className="coin-modal-head"><CoinLogo symbol={selectedAsset.symbol} color={selectedAsset.color} size={45} /><div><h2>{selectedAsset.name}</h2><span>{selectedAsset.symbol}</span></div></div>
    <div className="coin-price-row"><div><strong>{formatPrice(selectedMarket.price, selectedAsset.symbol)}</strong><span className={selectedMarket.periodChange >= 0 ? 'positive' : 'negative'}>{selectedMarket.periodChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}{selectedMarket.periodChange >= 0 ? '+' : ''}{selectedMarket.periodChange.toFixed(2)}% · {chartPeriod}</span></div><div className="period-tabs">{['24H', '7D', '30D'].map((period) => <button className={chartPeriod === period ? 'active' : ''} key={period} onClick={() => setChartPeriod(period)}>{period}</button>)}</div></div>
    <div className="large-chart"><PriceChart data={selectedMarket.data} color={selectedMarket.periodChange >= 0 ? '#b7ed55' : '#ff6575'} /></div>
    <div className="market-stats"><div><span>High</span><strong>{formatPrice(selectedMarket.high, selectedAsset.symbol)}</strong></div><div><span>Low</span><strong>{formatPrice(selectedMarket.low, selectedAsset.symbol)}</strong></div><div><span>Volume</span><strong>{selectedMarket.volumeLabel}</strong></div></div>
  </section></div>}
  </div>
}

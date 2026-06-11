import { useMemo, useState } from 'react'
import { Bell, CalendarDays, Check, Clock3, Filter } from 'lucide-react'
import ProductNav from '../components/ProductNav'
import { ECONOMIC_EVENTS } from '../data/marketUniverse'

export default function Calendar() {
  const [impact, setImpact] = useState('All')
  const [market, setMarket] = useState('All')
  const [alerts, setAlerts] = useState([])
  const events = useMemo(() => ECONOMIC_EVENTS.filter((event) => (impact === 'All' || event.impact === impact) && (market === 'All' || event.market === market)), [impact, market])
  function toggleAlert(id) { setAlerts((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) }
  return <div className="app-shell workspace-page"><ProductNav /><main className="workspace-main">
    <div className="workspace-title"><div><span className="section-kicker"><CalendarDays size={14} /> ECONOMIC & CRYPTO CALENDAR</span><h1>เตรียมตัวก่อนตลาดผันผวน</h1><p>Actual, Forecast, Previous และสินทรัพย์ที่ได้รับผลกระทบในมุมมองเดียว</p></div><div className="next-event"><Clock3 size={18} /><div><span>Next high impact</span><strong>US CPI · 19:30</strong></div></div></div>
    <section className="calendar-toolbar panel"><div className="control-group"><span><Filter size={13} /> Impact</span><div className="segmented">{['All', 'High', 'Medium'].map((item) => <button className={impact === item ? 'active' : ''} onClick={() => setImpact(item)} key={item}>{item}</button>)}</div></div><div className="control-group"><span>Market</span><div className="segmented">{['All', 'Forex', 'Macro', 'Crypto', 'Stock'].map((item) => <button className={market === item ? 'active' : ''} onClick={() => setMarket(item)} key={item}>{item}</button>)}</div></div></section>
    <section className="full-calendar panel"><div className="calendar-table-head"><span>Date / Time</span><span>Impact</span><span>Event</span><span>Actual</span><span>Forecast</span><span>Previous</span><span>Alert</span></div>{events.map((event) => <div className="full-calendar-row" key={event.id}><span><b>{event.date}</b><small>{event.time} · {event.country}</small></span><span><i className={`impact-dot ${event.impact.toLowerCase()}`} />{event.impact}</span><span className="event-name"><b>{event.event}</b><small>{event.assets.join(' · ')}</small></span><strong>{event.actual}</strong><span>{event.forecast}</span><span>{event.previous}</span><button className={alerts.includes(event.id) ? 'calendar-alert active' : 'calendar-alert'} onClick={() => toggleAlert(event.id)}>{alerts.includes(event.id) ? <Check size={15} /> : <Bell size={15} />}</button></div>)}</section>
    <section className="event-brief panel"><div><span className="section-kicker">AI EVENT BRIEF</span><h2>ก่อน CPI: ลดขนาดสถานะที่ไวต่อดอลลาร์</h2></div><p>Gold, EUR/USD, BTC และ NASDAQ มีโอกาสเกิด volatility spike หาก Actual ต่างจาก Forecast มาก ระบบแนะนำให้หลีกเลี่ยง leverage สูงในช่วง 30 นาทีก่อนและหลังประกาศ</p></section>
  </main></div>
}

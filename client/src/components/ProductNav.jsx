import { Activity, CalendarDays, Crown, LayoutDashboard, PieChart, Search, ShieldAlert } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { getStoredPremium } from '../data/demoData'

const items = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/screener', label: 'Screener', icon: Search },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart },
  { to: '/premium', label: 'Premium', icon: Crown },
]

export default function ProductNav() {
  const premium = getStoredPremium()
  return <header className="product-header">
    <NavLink to="/dashboard" className="product-brand"><ShieldAlert size={20} /><span>MarketIntel AI</span></NavLink>
    <nav className="product-tabs">{items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={16} /><span>{label}</span></NavLink>)}</nav>
    <div className={`live-status ${premium ? 'is-premium' : ''}`}>{premium ? <Crown size={14} /> : <Activity size={14} />}<span>{premium ? 'Premium active' : 'Mock market live'}</span></div>
  </header>
}

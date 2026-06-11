import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, CheckCheck, Search, ShieldAlert, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { DEMO_ASSETS, WATCHLIST_KEY, getLocalWatchlist, getStoredLanguage } from '../data/demoData'
import CoinLogo from '../components/CoinLogo'

const copy = {
  th: {
    brand: 'MarketIntel AI',
    back: 'กลับ Dashboard',
    kicker: 'PERSONALIZE YOUR RADAR',
    title: 'เลือกสินทรัพย์ที่คุณอยากติดตาม',
    subtitle: 'ข่าว Risk Score และปฏิทินสำคัญจะถูกกรองจาก watchlist นี้',
    selected: 'รายการที่เลือก',
    search: 'ค้นหา BTC, XAU/USD, NASDAQ...',
    selectAll: 'เลือกทั้งหมด',
    clear: 'ล้าง',
    empty: 'ไม่พบสินทรัพย์ที่ค้นหา',
    clearSearch: 'ล้างคำค้นหา',
    save: 'บันทึก Watchlist',
    saving: 'กำลังบันทึก...',
    note: 'จะถูกใช้คำนวณความเสี่ยงของพอร์ต',
  },
  en: {
    brand: 'MarketIntel AI',
    back: 'Back to Dashboard',
    kicker: 'PERSONALIZE YOUR RADAR',
    title: 'Choose assets to track',
    subtitle: 'News, risk scores, and key calendar events will be filtered from this watchlist.',
    selected: 'selected assets',
    search: 'Search BTC, XAU/USD, NASDAQ...',
    selectAll: 'Select all',
    clear: 'Clear',
    empty: 'No assets match your search',
    clearSearch: 'Clear search',
    save: 'Save Watchlist',
    saving: 'Saving...',
    note: 'will be used for portfolio risk scoring',
  },
}

export default function SelectCoins({ demoMode }) {
  const [assets, setAssets] = useState(demoMode ? DEMO_ASSETS : [])
  const [selected, setSelected] = useState(getLocalWatchlist)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(!demoMode)
  const [saving, setSaving] = useState(false)
  const language = getStoredLanguage()
  const t = copy[language] || copy.th
  const navigate = useNavigate()

  useEffect(() => {
    if (demoMode) return
    supabase.from('coins').select('*').order('symbol').then(({ data }) => { setAssets(data?.length ? data : DEMO_ASSETS); setLoading(false) })
  }, [demoMode])

  const visibleAssets = useMemo(() => assets.filter((asset) => `${asset.symbol} ${asset.name} ${asset.type}`.toLowerCase().includes(query.toLowerCase())), [assets, query])
  function toggleAsset(id) { setSelected((current) => current.includes(id) ? current.filter((assetId) => assetId !== id) : [...current, id]) }

  async function handleSave() {
    if (!selected.length) return
    setSaving(true)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(selected))
    if (!demoMode) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from('watchlists').upsert(selected.map((coin_id) => ({ user_id: user.id, coin_id, weight: null })), { onConflict: 'user_id,coin_id' })
    }
    navigate('/dashboard')
  }

  if (loading) return <div className="app-shell loading-screen">Loading assets...</div>

  return <div className="app-shell"><div className="page select-wrap">
    <div className="topbar"><div className="brand"><ShieldAlert size={20} /> {t.brand}</div><button className="nav-btn button-with-icon" onClick={() => navigate('/dashboard')}><ArrowLeft size={16} /> {t.back}</button></div>
    <div className="select-header"><div><div className="section-kicker">{t.kicker}</div><h1 className="select-title">{t.title}</h1><p className="select-sub">{t.subtitle}</p></div><div className="selected-counter"><strong>{selected.length}</strong><span>{t.selected}</span></div></div>
    <div className="select-tools"><label className="search-box large"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><button className="tool-btn" onClick={() => setSelected(assets.map((asset) => asset.id))}><CheckCheck size={16} /> {t.selectAll}</button><button className="tool-btn danger" onClick={() => setSelected([])}><Trash2 size={16} /> {t.clear}</button></div>
    <div className="coin-grid">{visibleAssets.map((asset) => {
      const active = selected.includes(asset.id)
      return <button type="button" key={asset.id} className={`coin-card ${active ? 'selected' : ''}`} onClick={() => toggleAsset(asset.id)}><span className="coin-check">{active && <Check size={14} />}</span><CoinLogo symbol={asset.symbol} color={asset.color} size={44} /><div className="coin-symbol">{asset.symbol}</div><div className="coin-name">{asset.name}</div><span className="asset-type">{asset.type}</span></button>
    })}</div>
    {!visibleAssets.length && <div className="empty-state"><Search size={26} /><strong>{t.empty}</strong><button onClick={() => setQuery('')}>{t.clearSearch}</button></div>}
    <div className="select-footer"><div><strong style={{ color: '#fff' }}>{selected.length}</strong><span> {t.note}</span></div><button className="primary-btn button-with-icon" onClick={handleSave} disabled={!selected.length || saving}><Check size={17} />{saving ? t.saving : t.save}</button></div>
  </div></div>
}

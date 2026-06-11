import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe2, LogIn, PlayCircle, ShieldAlert } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Login({ onStartDemo }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function enterDemo() {
    onStartDemo()
    navigate('/dashboard')
  }

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError(authError.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } })
  }

  return <div className="auth-page app-shell">
    <section className="auth-hero">
      <div className="brand"><ShieldAlert size={20} /> MarketIntel AI</div>
      <div>
        <div className="eyebrow">AI market risk radar</div>
        <h1>กรองข่าวและความเสี่ยงจาก <span>crypto, forex และหุ้น</span></h1>
        <p>เดโมนี้จำลองแพลตฟอร์มวิเคราะห์ตลาดแบบ CoinMarketCap + TradingView + Forex Factory พร้อม AI Risk Score ระบบสองภาษา และ premium mock 35 บาทต่อเดือน</p>
        <div className="signal-row"><span className="signal-pill">MULTI-MARKET</span><span className="signal-pill">AI RISK SCORE</span><span className="signal-pill">TH / EN</span></div>
      </div>
      <div className="eyebrow" style={{ color: '#45455b' }}>MVP · MOCK DEMO</div>
    </section>
    <main className="auth-side">
      <div className="auth-card">
        <div className="eyebrow">Welcome back</div><h2>เข้าสู่ระบบ</h2><p>เปิดเดโมเพื่อดู dashboard, premium unlock และข้อมูล mock ได้ทันที</p>
        <button className="demo-btn button-with-icon" onClick={enterDemo}><PlayCircle size={18} /> เปิด Demo Dashboard</button>
        <button className="secondary-btn button-with-icon" onClick={handleGoogle}><Globe2 size={17} /> เข้าสู่ระบบด้วย Google</button>
        <div className="divider">หรือใช้อีเมล</div>
        <form onSubmit={handleLogin}>
          <input className="field" type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="field" type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div className="form-error">{error}</div>}
          <button className="primary-btn button-with-icon" disabled={loading}><LogIn size={17} />{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</button>
        </form>
        <div className="auth-link">ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link></div>
      </div>
    </main>
  </div>
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlayCircle, ShieldAlert, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Register({ onStartDemo }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  function enterDemo() { onStartDemo(); navigate('/dashboard') }
  async function handleRegister(event) {
    event.preventDefault(); setLoading(true); setError('')
    const { error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) setError(authError.message); else setDone(true)
    setLoading(false)
  }

  return <div className="auth-page app-shell">
    <section className="auth-hero"><div className="brand"><ShieldAlert size={20} /> CryptoIntel</div><div><div className="eyebrow">Your signal, not the noise</div><h1>เริ่มติดตามความเสี่ยงของ<span>เหรียญที่คุณสนใจ</span></h1><p>สร้าง watchlist ส่วนตัว แล้วให้ระบบคัดเฉพาะข่าวที่มีผลต่อสินทรัพย์ของคุณ</p></div><div className="eyebrow" style={{ color: '#45455b' }}>MVP · PRIVATE BETA</div></section>
    <main className="auth-side"><div className="auth-card">
      <div className="eyebrow">Create account</div><h2>{done ? 'เช็คอีเมลของคุณ' : 'สมัครสมาชิก'}</h2>
      {done ? <><p>เราส่งลิงก์ยืนยันไปที่ <strong style={{ color: '#fff' }}>{email}</strong> แล้ว</p><button className="demo-btn button-with-icon" onClick={enterDemo}><PlayCircle size={18} /> ดู Demo ระหว่างรอ</button></> : <>
        <p>เริ่มต้นฟรี เลือกเหรียญที่ต้องการติดตามได้ทันที</p>
        <button className="demo-btn button-with-icon" onClick={enterDemo}><PlayCircle size={18} /> ทดลองใช้งานก่อนสมัคร</button>
        <form onSubmit={handleRegister}><input className="field" type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} required /><input className="field" type="password" minLength="6" placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)" value={password} onChange={(e) => setPassword(e.target.value)} required />{error && <div className="form-error">{error}</div>}<button className="primary-btn button-with-icon" disabled={loading}><UserPlus size={17} />{loading ? 'กำลังสมัคร...' : 'สร้างบัญชี'}</button></form>
        <div className="auth-link">มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link></div>
      </>}
    </div></main>
  </div>
}

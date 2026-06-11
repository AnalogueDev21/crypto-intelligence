import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import SelectCoins from './pages/SelectCoins'
import Dashboard from './pages/Dashboard'
import Screener from './pages/Screener'
import AssetDetail from './pages/AssetDetail'
import Calendar from './pages/Calendar'
import Portfolio from './pages/Portfolio'
import Premium from './pages/Premium'

export const DEMO_KEY = 'crypto-intel-demo'

function ProtectedRoute({ session, demoMode, children }) {
  return session || demoMode ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(localStorage.getItem(DEMO_KEY) === 'true')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => subscription.unsubscribe()
  }, [])

  function startDemo() {
    localStorage.setItem(DEMO_KEY, 'true')
    setDemoMode(true)
  }

  function endDemo() {
    localStorage.removeItem(DEMO_KEY)
    setDemoMode(false)
  }

  if (loading && !demoMode) return <div className="app-shell" style={{ display: 'grid', placeItems: 'center', color: '#c8ff57', fontFamily: 'Manrope, sans-serif' }}>INITIALIZING INTELLIGENCE...</div>

  const guard = (page) => <ProtectedRoute session={session} demoMode={demoMode}>{page}</ProtectedRoute>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onStartDemo={startDemo} />} />
        <Route path="/register" element={<Register onStartDemo={startDemo} />} />
        <Route path="/select-coins" element={guard(<SelectCoins demoMode={demoMode} />)} />
        <Route path="/dashboard" element={guard(<Dashboard demoMode={demoMode} onEndDemo={endDemo} />)} />
        <Route path="/screener" element={guard(<Screener />)} />
        <Route path="/asset/:assetId" element={guard(<AssetDetail />)} />
        <Route path="/calendar" element={guard(<Calendar />)} />
        <Route path="/portfolio" element={guard(<Portfolio />)} />
        <Route path="/premium" element={guard(<Premium />)} />
        <Route path="*" element={<Navigate to={session || demoMode ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

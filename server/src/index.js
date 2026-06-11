import 'dotenv/config'
import express from 'express'
import cron from 'node-cron'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { collectNews } from './collectors/rssCollector.js'
import { analyzeNews } from './analyzers/geminiAnalyzer.js'

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ── ROUTES ──

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// ดึงข่าวพร้อม Analysis
app.get('/news', async (req, res) => {
  const { limit = 20, coin } = req.query
  let query = supabase
    .from('news')
    .select('*, news_analysis(*)')
    .eq('status', 'analyzed')
    .order('published_at', { ascending: false })
    .limit(parseInt(limit))

  if (coin) {
    query = query.contains('news_analysis.affected_coins', [coin.toUpperCase()])
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Risk Score ของ User
app.get('/dashboard/risk/:userId', async (req, res) => {
  const { userId } = req.params

  // ดึง Watchlist ของ User
  const { data: watchlist } = await supabase
    .from('watchlists')
    .select('*, coins(symbol)')
    .eq('user_id', userId)

  if (!watchlist?.length) return res.json({ score: 0, level: 'Low', news: [] })

  const userCoins = watchlist.map(w => w.coins?.symbol).filter(Boolean)

  // ดึงข่าววันนี้ที่กระทบเหรียญของ User
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: news } = await supabase
    .from('news_analysis')
    .select('*, news!inner(title, source, published_at, original_url)')
    .gte('news.published_at', today.toISOString())
    .order('impact_score', { ascending: false })
    .limit(20)

  const relevant = (news || []).filter(n =>
    n.affected_coins?.some(c => userCoins.includes(c))
  )

  const maxScore = relevant.length > 0 ? Math.max(...relevant.map(n => n.impact_score)) : 0
  const level = maxScore >= 70 ? 'High' : maxScore >= 40 ? 'Medium' : 'Low'

  res.json({ score: maxScore, level, news: relevant.slice(0, 10), userCoins })
})

// Manual trigger (สำหรับ test)
app.post('/trigger/collect', async (req, res) => {
  collectNews().then(() => analyzeNews())
  res.json({ message: 'Pipeline started' })
})

// ── CRON JOBS ──
// ทุก 15 นาที: ดึงข่าว
cron.schedule('*/15 * * * *', async () => {
  console.log('[CRON] Collecting news...')
  await collectNews()
})

// ทุก 20 นาที: วิเคราะห์
cron.schedule('*/20 * * * *', async () => {
  console.log('[CRON] Analyzing news...')
  await analyzeNews()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
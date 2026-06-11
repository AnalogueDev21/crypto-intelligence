import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const PROMPT = (title, content) => `
You are a professional crypto market analyst. Analyze this news article and return ONLY valid JSON, no markdown, no explanation.

Title: ${title}
Content: ${content}

Return exactly this JSON:
{
  "summary": "สรุป 2-3 ประโยคภาษาไทย อธิบายว่าเกิดอะไรขึ้น",
  "category": "ETF|FED|CPI|Regulation|Exchange|Hack|Adoption|DeFi|Other",
  "sentiment": "Bullish|Bearish|Neutral",
  "impact_score": 0,
  "risk_level": "Low|Medium|High",
  "affected_coins": ["BTC"],
  "reason": "one sentence in Thai explaining why these coins are affected",
  "is_breaking": false
}

Rules:
- impact_score: 0-100 (80+ = major market moving event)
- affected_coins: use standard tickers only [BTC, ETH, SOL, BNB, XRP, ADA, DOGE, AVAX, DOT, MATIC]
- is_breaking: true only if time-sensitive and high impact
`

export async function analyzeNews() {
  // ดึงข่าวที่ยังไม่วิเคราะห์
  const { data: pendingNews } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'pending')
    .limit(10)

  if (!pendingNews || pendingNews.length === 0) {
    console.log('[AI] No pending news')
    return
  }

  console.log(`[AI] Analyzing ${pendingNews.length} articles...`)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  for (const article of pendingNews) {
    try {
      const result = await model.generateContent(
        PROMPT(article.title, article.content || '')
      )
      const text = result.response.text().trim()
      const clean = text.replace(/```json|```/g, '').trim()
      const analysis = JSON.parse(clean)

      // บันทึก Analysis
      await supabase.from('news_analysis').upsert({
        news_id: article.id,
        summary_th: analysis.summary,
        category: analysis.category,
        sentiment: analysis.sentiment,
        impact_score: analysis.impact_score,
        risk_level: analysis.risk_level,
        affected_coins: analysis.affected_coins,
        reason: analysis.reason,
        is_breaking: analysis.is_breaking
      }, { onConflict: 'news_id' })

      // Update สถานะ
      await supabase.from('news').update({ status: 'analyzed' }).eq('id', article.id)

      // ถ้า Impact สูง → สร้าง Alert
      if (analysis.impact_score >= 70) {
        await createAlerts(article, analysis)
      }

      console.log(`[AI] ✓ ${article.title.slice(0, 50)}... (${analysis.impact_score})`)
      await sleep(2000) // Rate limit: 15 RPM
    } catch (err) {
      console.error(`[AI] Failed: ${article.title.slice(0, 40)}`, err.message)
      await supabase.from('news').update({ status: 'failed' }).eq('id', article.id)
    }
  }
}

async function createAlerts(article, analysis) {
  if (!analysis.affected_coins?.length) return

  // หา Users ที่มีเหรียญนั้นใน Watchlist
  const { data: watchlistUsers } = await supabase
    .from('watchlists')
    .select('user_id, coins(symbol)')
    .in('coins.symbol', analysis.affected_coins)

  if (!watchlistUsers?.length) return

  const alerts = watchlistUsers.map(w => ({
    user_id: w.user_id,
    news_id: article.id,
    type: 'news',
    message: `🚨 Impact ${analysis.impact_score}: ${article.title.slice(0, 80)}`,
    is_read: false
  }))

  await supabase.from('alerts').insert(alerts)
  console.log(`[AI] Created ${alerts.length} alerts`)
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
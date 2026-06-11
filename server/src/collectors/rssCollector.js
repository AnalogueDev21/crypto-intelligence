import Parser from 'rss-parser'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const parser = new Parser()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const SOURCES = [
  { name: 'CoinDesk',      url: 'https://feeds.coindesk.com/coindesk/rss' },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
  { name: 'Decrypt',       url: 'https://decrypt.co/feed' },
]

export async function collectNews() {
  console.log('[RSS] Starting collection...')
  let collected = 0

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url)

      for (const item of feed.items.slice(0, 10)) {
        const url_hash = crypto.createHash('md5').update(item.link || item.title).digest('hex')
        const content = item.contentSnippet || item.summary || item.content || ''

        const { error } = await supabase.from('news').upsert({
          url_hash,
          title: item.title,
          content: content.slice(0, 2000),
          source: source.name,
          original_url: item.link,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          status: 'pending'
        }, { onConflict: 'url_hash', ignoreDuplicates: true })

        if (!error) collected++
      }

      console.log(`[RSS] ${source.name}: done`)
    } catch (err) {
      console.error(`[RSS] ${source.name} failed:`, err.message)
    }
  }

  console.log(`[RSS] Collected ${collected} new articles`)
  return collected
}
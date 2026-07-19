/**
 * Nightly stream health check.
 * Probes every channel URL and writes src/lib/streamStatus.json with the
 * list of dead URLs. The app badges those channels as "Offline" and sinks
 * them to the end of category lists.
 *
 * Run: node scripts/check-streams.mjs
 */
import { writeFileSync } from 'node:fs'
import * as sources from '../src/lib/multipleChannelData.js'

const TIMEOUT_MS = 10000
const CONCURRENCY = 20

const urls = [
  ...new Set(
    Object.values(sources)
      .flatMap((s) => (Array.isArray(s?.data) ? s.data : []))
      .map((ch) => ch.url)
      .filter(Boolean),
  ),
]

async function probe(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    // GET (not HEAD) — many HLS origins reject HEAD. We only need headers,
    // so abort the body read immediately after.
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (SLStream health check)' },
    })
    res.body?.cancel?.().catch(() => {})
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

const dead = []
let done = 0

for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(probe))
  results.forEach((ok, j) => {
    if (!ok) dead.push(batch[j])
  })
  done += batch.length
  process.stdout.write(`\rchecked ${done}/${urls.length} (${dead.length} dead)`)
}

const status = {
  checkedAt: new Date().toISOString(),
  total: urls.length,
  deadUrls: dead.sort(),
}

writeFileSync(
  new URL('../src/lib/streamStatus.json', import.meta.url),
  JSON.stringify(status, null, 2) + '\n',
)
console.log(`\nwrote streamStatus.json — ${dead.length}/${urls.length} dead`)

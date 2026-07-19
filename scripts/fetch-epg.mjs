/**
 * Nightly EPG fetch — pulls Sri Lanka TV guide data (XMLTV) from open-epg
 * and writes a compact public/epg.json the client reads for "now playing".
 *
 * Best-effort: if the source is unreachable the previous file is kept.
 * Run: node scripts/fetch-epg.mjs
 */
import { writeFileSync } from 'node:fs'
import * as channelSources from '../src/lib/multipleChannelData.js'

const SOURCES = [
  // Sri Lanka guides (open-epg blocks non-browser fetches — kept as best effort)
  'https://www.open-epg.com/files/srilanka1.xml',
  'https://www.open-epg.com/files/srilanka2.xml',
  // FAST-channel guides covering many of our global channels
  'https://i.mjh.nz/SamsungTVPlus/us.xml',
  'https://i.mjh.nz/SamsungTVPlus/au.xml',
  'https://i.mjh.nz/PlutoTV/us.xml',
]

// Keep programmes from 6h ago to 48h ahead — enough for "now/next"
const WINDOW_START = Date.now() - 6 * 3600 * 1000
const WINDOW_END = Date.now() + 48 * 3600 * 1000

/** "20260720123000 +0000" → epoch ms */
function parseXmltvTime(raw) {
  const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\s*([+-]\d{4})?$/.exec(raw.trim())
  if (!m) return null
  const [, y, mo, d, h, mi, s, tz] = m
  let ms = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
  if (tz) {
    const sign = tz.startsWith('-') ? -1 : 1
    const offMin = sign * (Number(tz.slice(1, 3)) * 60 + Number(tz.slice(3, 5)))
    ms -= offMin * 60 * 1000
  }
  return ms
}

/** Normalize a channel name for matching: lowercase alphanumerics only. */
const norm = (name) =>
  name
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

const decode = (s) =>
  s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")

async function fetchXml(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// Only keep guide data for channels that actually exist in the app —
// keeps epg.json small enough to ship to every client.
const wantedKeys = new Set(
  Object.values(channelSources)
    .flatMap((s) => (Array.isArray(s?.data) ? s.data : []))
    .map((ch) => norm(ch.tvgName || ch.title || ''))
    .filter(Boolean),
)

const channels = {}
let programmeCount = 0

for (const url of SOURCES) {
  const xml = await fetchXml(url)
  if (!xml) {
    console.warn(`skip (unreachable): ${url}`)
    continue
  }

  // channel id → display name
  const idToName = new Map()
  for (const m of xml.matchAll(
    /<channel id="([^"]+)"[^>]*>[\s\S]*?<display-name[^>]*>([^<]+)<\/display-name>/g,
  )) {
    idToName.set(m[1], decode(m[2]).trim())
  }

  for (const m of xml.matchAll(
    /<programme[^>]*start="([^"]+)"[^>]*stop="([^"]+)"[^>]*channel="([^"]+)"[^>]*>[\s\S]*?<title[^>]*>([^<]+)<\/title>/g,
  )) {
    const start = parseXmltvTime(m[1])
    const stop = parseXmltvTime(m[2])
    if (!start || !stop || stop < WINDOW_START || start > WINDOW_END) continue

    const name = idToName.get(m[3]) || m[3]
    const key = norm(name)
    if (!key || !wantedKeys.has(key)) continue

    channels[key] ||= []
    channels[key].push({ s: start, e: stop, t: decode(m[4]).trim() })
    programmeCount++
  }
}

for (const list of Object.values(channels)) {
  list.sort((a, b) => a.s - b.s)
}

if (programmeCount === 0) {
  console.warn('no programmes fetched — keeping previous epg.json')
  process.exit(0)
}

writeFileSync(
  new URL('../public/epg.json', import.meta.url),
  JSON.stringify({ fetchedAt: new Date().toISOString(), channels }),
)
console.log(`wrote epg.json — ${Object.keys(channels).length} channels, ${programmeCount} programmes`)

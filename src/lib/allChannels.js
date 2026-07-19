import { CODE_CLOUD_BD, MRGIFY_TV, PRIATES_TV, AKASH_TV, DEKHO_PRIME, ADULT_IPTV, SPORTS_PLUS, SRI_LANKA_TV, ENGLISH_TV, SLSTREAM_LANKA, WORLD_NEWS } from './multipleChannelData'
import streamStatus from './streamStatus.json'

// ─── Category normalisation ───────────────────────────────────────────────────

const CATEGORY_MAP = {
  sports: 'Sports',
  news: 'News',
  movies: 'Movies',
  music: 'Music',
  cartoon: 'Cartoon',
  kids: 'Kids',
  documentary: 'Documentary',
  religion: 'Religion',
  bangla: 'General',
  entertainment: 'Entertainment',
  xxx: 'XXX',
}

function normalizeCategory(raw) {
  if (!raw) return 'General'
  const key = raw.trim().toLowerCase()
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key]
  // Fuzzy fallbacks for future data additions
  if (key.includes('sports')) return 'Sports'
  if (key.includes('news')) return 'News'
  if (key.includes('movie')) return 'Movies'
  if (key.includes('music')) return 'Music'
  if (key.includes('cartoon')) return 'Cartoon'
  if (key.includes('religion') || key.includes('islamic') || key.includes('religious')) return 'Religion'
  if (key.includes('bangla')) return 'General'
  if (key.includes('documentary') || key.includes('info')) return 'Documentary'
  return raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1)
}

// ─── Source normalisation ─────────────────────────────────────────────────────

function slugify(text) {
  if (!text) return ''
  return String(text)
    .normalize('NFKD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Collapse whitespace to dash
    .replace(/-+/g, '-') // Collapse multiple dashes
}

/**
 * Converts a source's data array into normalised channel objects.
 * Fields: id, name, category, logo, url, isAdult, sourceSlug, sourceName, _search
 */
function normalizeSource(source) {
  if (!source || !Array.isArray(source.data)) return []
  return source.data.map((item) => {
    const name = item.tvgName || item.title || 'Unknown'
    const category = normalizeCategory(item.groupTitle)
    const sourceName = source.name
    return {
      _rawId: item.tvgId || item.title,
      name,
      category,
      logo: item.tvgLogo || null,
      url: item.url || '',
      isAdult: source.isAdult === true,
      sourceSlug: source.slug,
      sourceName,
      number: null,
      // Pre-built lowercase search string - avoids template-literal concat on every keystroke
      _search: `${name} ${category} ${sourceName}`.toLowerCase(),
    }
  })
}

// ─── Build channel list ───────────────────────────────────────────────────────

const multiSources = [SLSTREAM_LANKA, SRI_LANKA_TV, WORLD_NEWS, ENGLISH_TV, SPORTS_PLUS, CODE_CLOUD_BD, MRGIFY_TV, PRIATES_TV, AKASH_TV, DEKHO_PRIME, ADULT_IPTV]
const rawChannels = multiSources.flatMap(normalizeSource)

/**
 * Merge key: same channel offered by multiple sources. Strips quality
 * suffixes like "(720p)" and "[Not 24/7]" so "Sirasa TV (720p)" and
 * "Sirasa TV (1080p)" collapse into one channel with alternate URLs.
 * Adult channels never merge with non-adult ones.
 */
function nameKey(ch) {
  const cleaned = ch.name
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
  return `${ch.isAdult ? 'x:' : ''}${cleaned}`
}

const seenUrls = new Set()
const seenIds = new Set()
const byNameKey = new Map()
const allChannels = []

for (const ch of rawChannels) {
  if (!ch.url) continue
  if (seenUrls.has(ch.url)) continue

  seenUrls.add(ch.url)

  // Same channel from another source → keep as an alternate (failover) URL
  const key = nameKey(ch)
  const existing = byNameKey.get(key)
  if (existing) {
    existing.altUrls.push(ch.url)
    continue
  }

  // Generate perfect slug
  let baseSlug = slugify(ch._rawId || ch.name || 'channel')
  let finalId = `${ch.sourceSlug}-${baseSlug}`

  // Ensure strict uniqueness for the Map
  let counter = 1
  while (seenIds.has(finalId)) {
    finalId = `${ch.sourceSlug}-${baseSlug}-${counter}`
    counter++
  }

  seenIds.add(finalId)
  ch.id = finalId
  ch.altUrls = []
  delete ch._rawId

  byNameKey.set(key, ch)
  allChannels.push(ch)
}

// ─── Channel numbers (stable: assigned in source order) ──────────────────────

allChannels.forEach((ch, i) => {
  ch.number = i + 1
})

/** Map<number, channel> - for remote-style quick tuning ("47" → channel 47). */
export const channelByNumber = new Map(allChannels.map((ch) => [ch.number, ch]))

// ─── Stream health (from nightly GitHub Action → streamStatus.json) ──────────

const deadUrls = new Set(streamStatus.deadUrls || [])
for (const ch of allChannels) {
  // Only offline when the primary AND every alternate URL are dead
  ch.maybeOffline = deadUrls.has(ch.url) && ch.altUrls.every((u) => deadUrls.has(u))
}

/** Sort helper: healthy channels first, then A→Z by name. */
function byHealthThenName(a, b) {
  if (a.maybeOffline !== b.maybeOffline) return a.maybeOffline ? 1 : -1
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
}

// ─── Pre-built indices (computed once at module load, O(1) access everywhere) ─

/**
 * Map<id, channel> - O(1) lookup by ID, used in Player, Favorites, byIds()
 */
export const channelIndex = new Map(allChannels.map((ch) => [ch.id, ch]))

/**
 * Map<category, channel[]> - sorted A→Z per category (case-insensitive).
 * Used in Category page for instant O(1) category lookup.
 * Both adult and non-adult are stored; callers filter by isAdult themselves.
 */
/**
 * Sri Lankan channels - the flagship category, sourced by origin not genre.
 */
export const lankaChannels = allChannels
  .filter((ch) => ch.sourceSlug === 'lanka' || ch.sourceSlug === 'sri-lanka-tv')
  .sort(byHealthThenName)

export const channelsByCategory = (() => {
  const map = new Map()
  for (const ch of allChannels) {
    const list = map.get(ch.category)
    if (list) list.push(ch)
    else map.set(ch.category, [ch])
  }
  // Sort each bucket: healthy first, then A→Z
  for (const list of map.values()) {
    list.sort(byHealthThenName)
  }
  // Synthetic category: Sri Lankan channels grouped by origin, not genre
  map.set('Sri Lankan', lankaChannels)
  return map
})()

/**
 * All unique category names (excluding XXX) - "Sri Lankan" pinned first,
 * the rest sorted A→Z. Pre-built so CategoryFilter never recomputes it.
 */
export const allCategories = [
  'Sri Lankan',
  ...Array.from(channelsByCategory.keys())
    .filter((c) => c !== 'XXX' && c !== 'Sri Lankan')
    .sort((a, b) => a.localeCompare(b)),
]

/**
 * Resolve an array of IDs → channels in O(1) per ID using channelIndex.
 * Preserves ID order; skips missing entries.
 */
export function byIds(ids) {
  const result = []
  for (const id of ids) {
    const ch = channelIndex.get(id)
    if (ch) result.push(ch)
  }
  return result
}

export default allChannels

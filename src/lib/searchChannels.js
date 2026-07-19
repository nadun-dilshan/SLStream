/**
 * Channel search with light typo tolerance.
 *
 * Ranking: exact substring matches first (earlier match = higher), then
 * fuzzy subsequence matches so "sirsa" still finds "Sirasa TV".
 */

function isSubsequence(needle, hay) {
  let i = 0
  for (let j = 0; i < needle.length && j < hay.length; j++) {
    if (needle[i] === hay[j]) i++
  }
  return i === needle.length
}

export default function searchChannels(pool, query) {
  const term = query.trim().toLowerCase()
  if (!term) return pool

  const scored = []
  const tokens = term.split(/\s+/)

  for (const ch of pool) {
    const hay = ch._search
    const idx = hay.indexOf(term)
    if (idx !== -1) {
      scored.push([ch, 1000 - idx])
      continue
    }
    // All tokens must appear as subsequences (cheap fuzzy match)
    if (term.length >= 3 && tokens.every((t) => isSubsequence(t, hay))) {
      scored.push([ch, 100 - hay.length / 20])
    }
  }

  return scored.sort((a, b) => b[1] - a[1]).map(([ch]) => ch)
}

import { useEffect, useState } from 'react'

/**
 * Lightweight EPG client. /epg.json is generated nightly by
 * scripts/fetch-epg.mjs (GitHub Action) from public XMLTV data.
 * Everything degrades gracefully when the file is empty.
 */

const cache = { promise: null, data: null }

function loadEpg() {
  cache.promise ||= fetch('/epg.json')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      cache.data = data
      return data
    })
    .catch(() => null)
  return cache.promise
}

/** Normalize a channel name for matching: lowercase alphanumerics only. */
function norm(name) {
  return String(name || '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/** Returns { now, next } programmes for a channel name, or null. */
export function nowAndNext(channelName, data = cache.data) {
  const list = data?.channels?.[norm(channelName)]
  if (!list?.length) return null
  const t = Date.now()
  const idx = list.findIndex((p) => p.s <= t && t < p.e)
  if (idx === -1) return null
  return { now: list[idx], next: list[idx + 1] || null }
}

/**
 * Hook: current + next programme for a channel, refreshed each minute.
 * Returns null until EPG data is loaded (or when none exists).
 */
export function useNowPlaying(channelName) {
  const [programmes, setProgrammes] = useState(() => nowAndNext(channelName))

  useEffect(() => {
    let alive = true
    const update = () => {
      if (alive) setProgrammes(nowAndNext(channelName))
    }
    loadEpg().then(update)
    const timer = setInterval(update, 60000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [channelName])

  return programmes
}

export const formatTime = (ms) =>
  new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

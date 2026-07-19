import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info, Play, X } from 'lucide-react'
import allChannels, { byIds, allCategories, channelsByCategory, lankaChannels } from '../lib/allChannels'
import { useTvStore } from '../store/tvStore'
import ChannelCard from '../components/ChannelCard'
import ChannelRow from '../components/ChannelRow'
import ChannelGrid from '../components/ChannelGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import Seo from '../components/Seo'
import { useT } from '../lib/i18n'

// Stable module-level pools — no re-creation on each render
const safeChannels = allChannels.filter((ch) => !ch.isAdult)
const defaultFeatured = lankaChannels.find((ch) => !ch.isAdult) || safeChannels[0]

// Row order: Sri Lankan first, then the strongest categories, rest alphabetical
const ROW_PRIORITY = ['Sri Lankan', 'Sports', 'News', 'Movies', 'Entertainment', 'Music', 'Kids', 'Cartoon', 'Documentary']
const rowCategories = [
  ...ROW_PRIORITY.filter((c) => channelsByCategory.has(c)),
  ...allCategories.filter((c) => !ROW_PRIORITY.includes(c)),
]

/** One-time "pick up where you left off" toast, shown once per session. */
function ResumeToast({ channel }) {
  const t = useT()
  const [visible, setVisible] = useState(
    () => Boolean(channel) && !sessionStorage.getItem('slstream_resume_shown'),
  )

  useEffect(() => {
    if (!visible) return undefined
    sessionStorage.setItem('slstream_resume_shown', '1')
    const timer = setTimeout(() => setVisible(false), 10000)
    return () => clearTimeout(timer)
  }, [visible])

  if (!visible || !channel) return null

  return (
    <div className="animate-slide-up fixed bottom-20 left-1/2 z-40 w-[min(92vw,26rem)] -translate-x-1/2 lg:bottom-8">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#141414]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <Link
          to={`/live/${channel.id}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e50914]/70"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e50914] text-white shadow-lg shadow-[#e50914]/40">
            <Play className="h-4 w-4 fill-current" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.6rem] font-black uppercase tracking-widest text-white/40">
              {t('continueWatchingToast')}
            </span>
            <span className="block truncate text-sm font-bold text-white">{channel.name}</span>
          </span>
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setVisible(false)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const t = useT()
  const [query, setQuery] = useState('')
  const favoriteIds = useTvStore((state) => state.favoriteIds)
  const recentlyWatchedIds = useTvStore((state) => state.recentlyWatchedIds)
  const currentChannelId = useTvStore((state) => state.currentChannelId)
  const adultEnabled = useTvStore((state) => state.settings.adultContentEnabled)

  const visibleChannels = adultEnabled ? allChannels : safeChannels
  const reducedMotion = useTvStore((state) => state.settings.reducedMotion)

  const lastWatched = useMemo(
    () => allChannels.find((ch) => ch.id === currentChannelId && !ch.isAdult) || null,
    [currentChannelId],
  )

  // Billboard rotation pool: last-watched first, then healthy Sri Lankan channels
  const rotationPool = useMemo(() => {
    const pool = lastWatched ? [lastWatched] : []
    for (const ch of lankaChannels) {
      if (pool.length >= 5) break
      if (!ch.isAdult && !ch.maybeOffline && !pool.includes(ch)) pool.push(ch)
    }
    if (!pool.length) pool.push(defaultFeatured)
    return pool
  }, [lastWatched])

  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion || rotationPool.length < 2) return undefined
    const timer = setInterval(() => setHeroIndex((i) => i + 1), 8000)
    return () => clearInterval(timer)
  }, [rotationPool, reducedMotion])

  const featured = rotationPool[heroIndex % rotationPool.length]
  const favorites = useMemo(() => byIds(favoriteIds).slice(0, 14), [favoriteIds])
  const recentlyWatched = useMemo(() => byIds(recentlyWatchedIds).slice(0, 14), [recentlyWatchedIds])

  const filteredChannels = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return null
    return visibleChannels.filter((ch) => ch._search.includes(term))
  }, [query, visibleChannels])

  return (
    <>
      <Seo
        title="Watch Live TV Free"
        description={`Stream ${allChannels.length}+ live TV channels on SLStream — Sri Lankan TV, sports, news, movies, music and more.`}
      />
      <div className="space-y-8 tv:space-y-12">

        {/* ── Billboard hero ── */}
        <section className="animate-fade-up relative -mx-4 overflow-hidden sm:-mx-6 sm:rounded-2xl lg:mx-0">
          <div className="relative bg-[radial-gradient(ellipse_at_75%_20%,rgba(229,9,20,0.28),transparent_55%),linear-gradient(100deg,#000_10%,#1a0507_55%,#2a070b_100%)] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            {/* Bottom fade into page background */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0b0b] to-transparent" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-[#e50914]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#e50914]" />
                  {t('liveTvFree')}
                </p>
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl tv:text-8xl">
                  {t('heroTitle')}
                  <br />
                  <span className="text-white/70">{t('heroSubtitle')}</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm font-medium text-white/60 sm:text-base tv:text-2xl">
                  Sri Lankan channels, world news, sports, movies and music — {allChannels.length}+ live channels streaming in HD.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    key={featured.id}
                    to={`/live/${featured.id}`}
                    data-focusable="true"
                    className="animate-fade-in inline-flex h-12 items-center gap-2.5 rounded bg-[#e50914] px-6 text-base font-black text-white shadow-xl shadow-[#e50914]/30 transition hover:bg-[#f6121d] focus:outline-none focus:ring-2 focus:ring-white/80 tv:h-16 tv:px-9 tv:text-2xl"
                  >
                    <Play className="h-5 w-5 fill-current tv:h-6 tv:w-6" />
                    {featured.id === currentChannelId ? t('resume') : t('play')} {featured.name}
                  </Link>
                  <Link
                    to="/search"
                    className="inline-flex h-12 items-center gap-2 rounded bg-white/20 px-6 text-base font-bold text-white backdrop-blur transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 tv:h-16 tv:px-9 tv:text-2xl"
                  >
                    <Info className="h-5 w-5" />
                    {t('browseAll')}
                  </Link>
                </div>
              </div>

              {/* Featured card — keyed so rotation crossfades */}
              <div key={featured.id} className="animate-fade-in hidden lg:block lg:w-52 xl:w-60">
                <ChannelCard channel={featured} featured />
              </div>
            </div>
          </div>
        </section>

        {/* ── Search + category pills ── */}
        <section className="space-y-3">
          <SearchBar value={query} onChange={setQuery} />
          {!query && <CategoryFilter compact />}
        </section>

        {query ? (
          /* ── Search results grid ── */
          <section>
            <h2 className="mb-3 text-lg font-black tracking-tight">{t('resultsFor')} “{query}”</h2>
            <ChannelGrid
              channels={filteredChannels}
              emptyTitle="No matching channels"
              emptyText="Try a different search or category."
            />
          </section>
        ) : (
          /* ── Netflix-style rows ── */
          <div className="space-y-8 tv:space-y-12">
            <ChannelRow title={t('continueWatching')} channels={recentlyWatched} />
            <ChannelRow title={t('myList')} channels={favorites} viewAllTo="/favorites" />
            {rowCategories.map((category) => {
              const list = channelsByCategory.get(category) ?? []
              const visible = adultEnabled ? list : list.filter((ch) => !ch.isAdult)
              return (
                <ChannelRow
                  key={category}
                  title={category}
                  channels={visible.slice(0, 20)}
                  viewAllTo={`/category/${encodeURIComponent(category)}`}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Cold-start resume toast (once per session) */}
      <ResumeToast channel={lastWatched} />
    </>
  )
}

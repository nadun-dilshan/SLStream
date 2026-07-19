import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info, Play } from 'lucide-react'
import allChannels, { byIds, allCategories, channelsByCategory, lankaChannels } from '../lib/allChannels'
import { useTvStore } from '../store/tvStore'
import ChannelCard from '../components/ChannelCard'
import ChannelRow from '../components/ChannelRow'
import ChannelGrid from '../components/ChannelGrid'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import Seo from '../components/Seo'

// Stable module-level pools — no re-creation on each render
const safeChannels = allChannels.filter((ch) => !ch.isAdult)
const defaultFeatured = lankaChannels.find((ch) => !ch.isAdult) || safeChannels[0]

// Row order: Sri Lankan first, then the strongest categories, rest alphabetical
const ROW_PRIORITY = ['Sri Lankan', 'Sports', 'News', 'Movies', 'Entertainment', 'Music', 'Kids', 'Cartoon', 'Documentary']
const rowCategories = [
  ...ROW_PRIORITY.filter((c) => channelsByCategory.has(c)),
  ...allCategories.filter((c) => !ROW_PRIORITY.includes(c)),
]

export default function Home() {
  const [query, setQuery] = useState('')
  const favoriteIds = useTvStore((state) => state.favoriteIds)
  const recentlyWatchedIds = useTvStore((state) => state.recentlyWatchedIds)
  const currentChannelId = useTvStore((state) => state.currentChannelId)
  const adultEnabled = useTvStore((state) => state.settings.adultContentEnabled)

  const visibleChannels = adultEnabled ? allChannels : safeChannels

  const featured = useMemo(
    () => allChannels.find((ch) => ch.id === currentChannelId && !ch.isAdult) || defaultFeatured,
    [currentChannelId],
  )
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
                  Live TV · Free
                </p>
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl tv:text-8xl">
                  Unlimited live TV.
                  <br />
                  <span className="text-white/70">One place. Zero cost.</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm font-medium text-white/60 sm:text-base tv:text-2xl">
                  Sri Lankan channels, world news, sports, movies and music — {allChannels.length}+ live channels streaming in HD.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/live/${featured.id}`}
                    data-focusable="true"
                    className="inline-flex h-12 items-center gap-2.5 rounded bg-[#e50914] px-6 text-base font-black text-white shadow-xl shadow-[#e50914]/30 transition hover:bg-[#f6121d] focus:outline-none focus:ring-2 focus:ring-white/80 tv:h-16 tv:px-9 tv:text-2xl"
                  >
                    <Play className="h-5 w-5 fill-current tv:h-6 tv:w-6" />
                    Play {featured.name}
                  </Link>
                  <Link
                    to="/search"
                    className="inline-flex h-12 items-center gap-2 rounded bg-white/20 px-6 text-base font-bold text-white backdrop-blur transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 tv:h-16 tv:px-9 tv:text-2xl"
                  >
                    <Info className="h-5 w-5" />
                    Browse All
                  </Link>
                </div>
              </div>

              {/* Featured card */}
              <div className="hidden lg:block lg:w-52 xl:w-60">
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
            <h2 className="mb-3 text-lg font-black tracking-tight">Results for “{query}”</h2>
            <ChannelGrid
              channels={filteredChannels}
              emptyTitle="No matching channels"
              emptyText="Try a different search or category."
            />
          </section>
        ) : (
          /* ── Netflix-style rows ── */
          <div className="space-y-8 tv:space-y-12">
            <ChannelRow title="Continue Watching" channels={recentlyWatched} />
            <ChannelRow title="My List" channels={favorites} viewAllTo="/favorites" />
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
    </>
  )
}

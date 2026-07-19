import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Grid3X3, Search } from 'lucide-react'
import { channelsByCategory } from '../lib/allChannels'
import { useTvStore } from '../store/tvStore'
import ChannelGrid from '../components/ChannelGrid'
import ChannelRow from '../components/ChannelRow'
import CategoryFilter from '../components/CategoryFilter'
import Seo from '../components/Seo'

export default function Category() {
  const { name = '' } = useParams()
  const category = decodeURIComponent(name)
  const adultEnabled = useTvStore((state) => state.settings.adultContentEnabled)

  // O(1) map lookup → pre-sorted list; only filter adult flag
  const channels = useMemo(() => {
    const list = channelsByCategory.get(category) ?? []
    return adultEnabled ? list : list.filter((ch) => !ch.isAdult)
  }, [category, adultEnabled])

  // Netflix-style sub-rows by source when the category is large and mixed;
  // small categories stay a simple grid.
  const sourceRows = useMemo(() => {
    if (channels.length <= 14) return null
    const groups = new Map()
    for (const ch of channels) {
      const list = groups.get(ch.sourceName)
      if (list) list.push(ch)
      else groups.set(ch.sourceName, [ch])
    }
    if (groups.size < 2) return null
    // Biggest sources first
    return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [channels])

  return (
    <div className="space-y-6 tv:space-y-10">
      <Seo
        title={`${category} Channels`}
        description={`Watch ${channels.length} ${category} live TV channels on SLStream.`}
      />
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-[#f6614a]">
              <Grid3X3 className="h-3 w-3" />
              Category
            </div>
            <h1 className="text-3xl font-black sm:text-5xl tv:text-7xl">{category}</h1>
            <p className="mt-2 text-white/55 tv:text-2xl">{channels.length} live channels</p>
          </div>
          <Link to="/search" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-[#181818] px-4 text-sm font-bold text-white/70 transition hover:bg-[#232323] focus:outline-none focus:ring-2 focus:ring-[#e50914]/60">
            <Search className="h-4 w-4" />
            Search
          </Link>
        </div>
        <CategoryFilter active={category} />
      </header>

      {sourceRows ? (
        <div className="space-y-8 tv:space-y-12">
          {sourceRows.map(([sourceName, list]) => (
            <ChannelRow key={sourceName} title={sourceName} channels={list} />
          ))}
        </div>
      ) : (
        <ChannelGrid
          channels={channels}
          emptyTitle="Category not found"
          emptyText="Choose another category from the filter bar."
        />
      )}
    </div>
  )
}

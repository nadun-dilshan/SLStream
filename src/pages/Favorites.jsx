import { useMemo } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { byIds } from '../lib/allChannels'
import ChannelGrid from '../components/ChannelGrid'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'

export default function Favorites() {
  const favoriteIds = useTvStore((state) => state.favoriteIds)
  // byIds uses channelIndex Map — O(1) per ID, no .find() scan
  const channels = useMemo(() => byIds(favoriteIds), [favoriteIds])

  return (
    <div className="space-y-6 tv:space-y-10">
      <Seo
        title="My List"
        description="View and manage your saved live TV channels on SLStream."
      />
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-[#f6614a]">
            <Heart className="h-3 w-3" />
            Saved
          </div>
          <h1 className="text-3xl font-black sm:text-5xl tv:text-7xl">My List</h1>
          <p className="mt-2 text-white/55 tv:text-2xl">Your pinned live channels stay here after refresh.</p>
        </div>
        <Link to="/search" className="inline-flex h-10 items-center justify-center rounded-lg border border-white/[0.08] bg-[#181818] px-4 text-sm font-bold text-white/70 transition hover:bg-[#232323] focus:outline-none focus:ring-2 focus:ring-[#e50914]/60">
          Find Channels
        </Link>
      </header>

      <ChannelGrid
        channels={channels}
        emptyTitle="No favorites yet"
        emptyText="Use the heart button on any channel to build your lineup."
      />
    </div>
  )
}

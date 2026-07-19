import { Link } from 'react-router-dom'
import { Search, Settings, Bell } from 'lucide-react'
import allChannels from '../lib/allChannels'

const totalChannels = allChannels.length

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 lg:left-24 xl:left-28">
      <div className="mx-auto flex h-14 items-center justify-between gap-3 border-b border-white/[0.06] bg-gradient-to-b from-black/90 to-[#0b0b0b]/75 px-4 backdrop-blur-xl sm:px-6 lg:h-16 lg:px-8">
        {/* Wordmark */}
        <Link
          to="/"
          data-focusable="true"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e50914]/70"
        >
          <span className="text-xl font-black uppercase leading-none tracking-tighter text-[#e50914] drop-shadow-[0_0_12px_rgba(229,9,20,0.45)] sm:text-2xl tv:text-4xl">
            SLStream
          </span>
          <span className="hidden rounded border border-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/50 sm:block tv:text-xs">
            {totalChannels} Live
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            to="/search"
            data-focusable="true"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/[0.10] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e50914]/70 tv:h-12 tv:w-12"
          >
            <Search className="h-5 w-5 tv:h-6 tv:w-6" />
          </Link>
          <button
            type="button"
            data-focusable="true"
            aria-label="Notifications"
            className="hidden h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/[0.10] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e50914]/70 sm:grid tv:h-12 tv:w-12"
          >
            <Bell className="h-5 w-5 tv:h-6 tv:w-6" />
          </button>
          <Link
            to="/settings"
            data-focusable="true"
            aria-label="Settings"
            className="grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/[0.10] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e50914]/70 tv:h-12 tv:w-12"
          >
            <Settings className="h-5 w-5 tv:h-6 tv:w-6" />
          </Link>
        </div>
      </div>
    </header>
  )
}

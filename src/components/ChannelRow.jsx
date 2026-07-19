import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ChannelCard from './ChannelCard'

/**
 * Netflix-style horizontal scrolling row with edge chevrons on desktop.
 */
export default function ChannelRow({ title, channels, viewAllTo }) {
  const scrollerRef = useRef(null)

  if (!channels?.length) return null

  const scrollByPage = (direction) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  return (
    <section className="group/row relative">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-base font-black tracking-tight text-white/90 sm:text-lg tv:text-3xl">{title}</h2>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="text-xs font-bold text-white/40 transition hover:text-[#e50914] tv:text-lg"
          >
            View all
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Desktop chevrons */}
        <button
          type="button"
          aria-label={`Scroll ${title} left`}
          onClick={() => scrollByPage(-1)}
          className="absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/80 text-white opacity-0 shadow-xl backdrop-blur transition hover:bg-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/70 group-hover/row:opacity-100 lg:grid"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label={`Scroll ${title} right`}
          onClick={() => scrollByPage(1)}
          className="absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/80 text-white opacity-0 shadow-xl backdrop-blur transition hover:bg-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/70 group-hover/row:opacity-100 lg:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-1 tv:gap-6"
        >
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} row />
          ))}
        </div>
      </div>
    </section>
  )
}

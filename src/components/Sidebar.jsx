import { NavLink } from 'react-router-dom'
import { Heart, Home, Search, Settings, Play } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/favorites', label: 'My List', icon: Heart },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-24 border-r border-white/[0.06] bg-black/70 backdrop-blur-xl lg:block xl:w-28">
      <div className="flex h-full flex-col items-center gap-5 py-5">
        {/* Brand icon */}
        <NavLink
          to="/"
          data-focusable="true"
          aria-label="SLStream home"
          className="grid h-12 w-12 place-items-center rounded-xl bg-[#e50914] text-white shadow-xl shadow-[#e50914]/40 transition hover:bg-[#f6121d] hover:shadow-[#e50914]/60 focus:outline-none focus:ring-2 focus:ring-[#e50914]/70 tv:h-16 tv:w-16"
        >
          <Play className="h-6 w-6 fill-current tv:h-9 tv:w-9" />
        </NavLink>

        {/* Divider */}
        <div className="h-px w-10 bg-white/[0.08]" />

        {/* Nav items — icon only, tooltip on hover */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                data-focusable="true"
                aria-label={item.label}
                className={({ isActive }) => [
                  'group relative grid h-12 w-12 place-items-center rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-[#e50914]/70 tv:h-16 tv:w-16',
                  isActive
                    ? 'border-[#e50914]/50 bg-[#e50914]/15 text-white shadow-lg shadow-[#e50914]/10'
                    : 'border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:text-white/85',
                ].join(' ')}
              >
                <Icon className="h-5 w-5 tv:h-7 tv:w-7" />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

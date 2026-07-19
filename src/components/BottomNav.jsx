import { NavLink } from 'react-router-dom'
import { Heart, Home, Search, Settings } from 'lucide-react'
import { useT } from '../lib/i18n'

const items = [
  { to: '/', labelKey: 'home', icon: Home },
  { to: '/search', labelKey: 'search', icon: Search },
  { to: '/favorites', labelKey: 'myList', icon: Heart },
  { to: '/settings', labelKey: 'more', icon: Settings },
]

export default function BottomNav() {
  const t = useT()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-black/85 px-2 pb-safe pt-1 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => [
                'flex flex-col items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest transition focus:outline-none focus:ring-2 focus:ring-[#e50914]/70',
                isActive
                  ? 'text-[#e50914]'
                  : 'text-white/45 hover:bg-white/[0.07] hover:text-white/75',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

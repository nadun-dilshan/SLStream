import { memo } from 'react'
import { Heart } from 'lucide-react'
import { useTvStore } from '../store/tvStore'

function FavoriteButton({ channel, compact = false }) {
  const isFavorite = useTvStore((state) => state.favoriteIds.includes(channel?.id))
  const toggleFavorite = useTvStore((state) => state.toggleFavorite)

  const onClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    toggleFavorite(channel)
  }

  return (
    <button
      type="button"
      data-focusable="true"
      aria-label={isFavorite ? `Remove ${channel?.name} from favorites` : `Add ${channel?.name} to favorites`}
      onClick={onClick}
      className={[
        'group/fav grid shrink-0 place-items-center rounded-full border border-white/15 bg-black/35 text-white shadow-lg backdrop-blur-xl transition',
        'hover:border-[#e50914]/60 hover:bg-[#e50914]/20 focus:outline-none focus:ring-4 focus:ring-[#e50914]/50',
        compact ? 'h-10 w-10' : 'h-12 w-12 tv:h-14 tv:w-14',
      ].join(' ')}
    >
      <Heart
        className={[
          compact ? 'h-4 w-4' : 'h-5 w-5 tv:h-6 tv:w-6',
          isFavorite ? 'fill-[#e50914] text-[#e50914]' : 'text-white/80 group-hover/fav:text-[#f6614a]',
        ].join(' ')}
      />
    </button>
  )
}

export default memo(FavoriteButton)

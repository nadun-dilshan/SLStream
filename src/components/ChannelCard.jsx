import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EyeOff, Play, Radio } from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import { useTvStore } from '../store/tvStore'

function ChannelCard({ channel, featured = false, row = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const adultEnabled = useTvStore((state) => state.settings.adultContentEnabled)

  const isBlocked = channel.isAdult && !adultEnabled

  return (
    <article className={['group relative cv-auto', row ? 'w-40 shrink-0 snap-start sm:w-44 tv:w-64' : ''].join(' ')}>
      <Link
        to={isBlocked ? '#' : `/live/${channel.id}`}
        onClick={isBlocked ? (e) => e.preventDefault() : undefined}
        data-focusable={!isBlocked ? 'true' : undefined}
        title={isBlocked ? 'Enable 18+ content in Settings to watch' : channel.name}
        className={[
          'relative block overflow-hidden rounded-lg border bg-[#181818] transition duration-200',
          isBlocked
            ? 'cursor-not-allowed border-white/[0.05] opacity-70'
            : 'border-white/[0.06] hover:z-10 hover:scale-[1.04] hover:border-[#e50914]/60 hover:bg-[#232323] hover:shadow-2xl hover:shadow-black/60',
          'focus:outline-none focus:ring-2 focus:ring-[#e50914]/70',
          featured ? 'min-h-[20rem] p-4 sm:p-5' : 'min-h-40 p-3 sm:min-h-44',
        ].join(' ')}
      >
        <div className="relative z-10 flex h-full flex-col">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[#e50914] px-1.5 py-0.5 text-[0.58rem] font-black uppercase tracking-widest text-white tv:text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>
            {channel.isAdult && (
              <span className="inline-flex items-center gap-1 rounded border border-orange-400/30 bg-orange-500/15 px-1.5 py-0.5 text-[0.58rem] font-black uppercase tracking-widest text-orange-300">
                18+
              </span>
            )}
            <FavoriteButton channel={channel} compact />
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center py-4">
            {isBlocked ? (
              <div className={[
                'grid place-items-center rounded-lg bg-black/40',
                featured ? 'h-28 w-28 sm:h-36 sm:w-36' : 'h-16 w-16 sm:h-20 sm:w-20',
              ].join(' ')}>
                <EyeOff className="h-7 w-7 text-white/25" />
              </div>
            ) : (
              <div className={[
                'grid place-items-center rounded-lg bg-black/30',
                featured ? 'h-28 w-28 sm:h-36 sm:w-36 tv:h-44 tv:w-44' : 'h-16 w-16 sm:h-20 sm:w-20 tv:h-28 tv:w-28',
              ].join(' ')}>
                {imageFailed || !channel.logo ? (
                  <Radio className="h-8 w-8 text-white/30 tv:h-10 tv:w-10" />
                ) : (
                  <img
                    src={channel.logo}
                    alt={`${channel.name} logo`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageFailed(true)}
                    className="max-h-full max-w-full object-contain drop-shadow-lg"
                  />
                )}
              </div>
            )}
          </div>

          {/* Name + category */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className={[
                'truncate font-bold leading-tight',
                featured ? 'text-xl sm:text-2xl tv:text-3xl' : 'text-sm tv:text-lg',
              ].join(' ')}>
                {isBlocked ? '••••••••' : channel.name}
              </p>
              {!isBlocked && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e50914] text-white opacity-0 shadow-lg shadow-[#e50914]/40 transition group-hover:opacity-100 tv:h-9 tv:w-9">
                  <Play className="h-3 w-3 fill-current tv:h-4 tv:w-4" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-widest text-white/40 tv:text-xs">
              <span className="truncate">{isBlocked ? 'Adult Content' : channel.category}</span>
              {channel.number && !isBlocked && <span className="shrink-0 text-white/25">#{channel.number}</span>}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default memo(ChannelCard)

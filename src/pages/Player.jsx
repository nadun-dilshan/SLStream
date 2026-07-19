import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Home } from 'lucide-react'
import allChannels, { channelIndex, channelsByCategory } from '../lib/allChannels'
import VideoPlayer from '../components/VideoPlayer'
import { useTvStore } from '../store/tvStore'
import Seo from '../components/Seo'

// Total channel count — stable, computed once
const TOTAL = allChannels.length

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const setCurrentChannel = useTvStore((state) => state.setCurrentChannel)

  // O(1) Map lookup instead of O(n) findIndex + array access
  const channel = channelIndex.get(id) ?? null
  const index = useMemo(
    () => (channel ? allChannels.indexOf(channel) : -1),
    [channel],
  )

  useEffect(() => {
    if (channel) setCurrentChannel(channel)
  }, [channel, setCurrentChannel])

  if (!channel) {
    return (
      <>
        <Seo title="Channel Not Found" description="The requested live TV channel is not available in the SLStream catalog." noIndex />
        <div className="grid min-h-screen place-items-center bg-[#0b0b0b] px-6 text-center">
          <div>
            <p className="text-3xl font-black tv:text-6xl">Channel not found</p>
            <p className="mt-3 text-white/55 tv:text-2xl">The live channel you requested is not in the catalog.</p>
            <Link to="/" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#e50914] px-6 font-bold text-white transition hover:bg-[#f6121d] focus:outline-none focus:ring-4 focus:ring-[#e50914]/50 tv:min-h-20 tv:px-10 tv:text-3xl">
              <Home className="h-5 w-5 tv:h-9 tv:w-9" />
              Go Home
            </Link>
          </div>
        </div>
      </>
    )
  }

  const goNext = () => navigate(`/live/${allChannels[(index + 1) % TOTAL].id}`)
  const goPrevious = () => navigate(`/live/${allChannels[(index - 1 + TOTAL) % TOTAL].id}`)

  // Fallback when a stream dies: jump to the next healthy channel in the same category
  const goNextInCategory = () => {
    const list = channelsByCategory.get(channel.category) ?? []
    if (list.length < 2) return goNext()
    const i = list.indexOf(channel)
    for (let step = 1; step < list.length; step++) {
      const candidate = list[(i + step) % list.length]
      if (!candidate.maybeOffline && !candidate.isAdult) {
        return navigate(`/live/${candidate.id}`)
      }
    }
    goNext()
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Seo
        title={`${channel.name} Live`}
        description={`Watch ${channel.name} live on SLStream. Category: ${channel.category}.`}
        image={channel.logo || '/favicon.svg'}
        type="video.other"
      />
      <VideoPlayer
        channel={channel}
        onNext={goNext}
        onPrevious={goPrevious}
        onNextInCategory={goNextInCategory}
        onBack={() => navigate(-1)}
      />
    </div>
  )
}

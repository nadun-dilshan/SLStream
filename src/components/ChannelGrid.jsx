import ChannelCard from './ChannelCard'

export default function ChannelGrid({ channels, emptyTitle = 'No channels found', emptyText = 'Try a different filter.', featured = false }) {
  if (!channels?.length) {
    return (
      <div className="rounded-lg border border-white/[0.07] bg-[#181818] px-6 py-14 text-center">
        <p className="text-xl font-bold text-white tv:text-3xl">{emptyTitle}</p>
        <p className="mt-2 text-sm text-white/55 tv:text-lg">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 tv:grid-cols-4 tv:gap-7">
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} featured={featured} />
      ))}
    </div>
  )
}

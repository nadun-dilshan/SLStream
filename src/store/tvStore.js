import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const uniqueIds = (ids) => {
  const seen = new Set()
  return ids.filter((id) => {
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export const useTvStore = create(
  persist(
    (set, get) => ({
      favoriteIds: [],
      recentlyWatchedIds: [],
      currentChannelId: null,
      // Session-only (not persisted): channels whose stream failed this session
      offlineIds: [],
      settings: {
        autoplay: true,
        muted: false,
        volume: 0.85,
        streamQuality: 'auto',
        reducedMotion: false,
        adultContentEnabled: false,
      },
      setCurrentChannel: (channel) => {
        if (!channel?.id) return
        set({ currentChannelId: channel.id })
        get().addRecentlyWatched(channel.id)
      },
      addRecentlyWatched: (id) => {
        if (!id) return
        set((state) => ({
          recentlyWatchedIds: uniqueIds([id, ...state.recentlyWatchedIds]).slice(0, 18),
        }))
      },
      toggleFavorite: (channel) => {
        if (!channel?.id) return
        set((state) => {
          const exists = state.favoriteIds.includes(channel.id)
          return {
            favoriteIds: exists
              ? state.favoriteIds.filter((id) => id !== channel.id)
              : uniqueIds([channel.id, ...state.favoriteIds]),
          }
        })
      },
      isFavorite: (id) => get().favoriteIds.includes(id),
      updateSettings: (settings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        }))
      },
      clearRecentlyWatched: () => set({ recentlyWatchedIds: [] }),
      markOffline: (id) => {
        if (!id) return
        set((state) =>
          state.offlineIds.includes(id) ? state : { offlineIds: [...state.offlineIds, id] },
        )
      },
      markOnline: (id) => {
        set((state) =>
          state.offlineIds.includes(id)
            ? { offlineIds: state.offlineIds.filter((x) => x !== id) }
            : state,
        )
      },
    }),
    {
      name: 'slstream-v1',           // rebrand — fresh storage namespace
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
        recentlyWatchedIds: state.recentlyWatchedIds,
        currentChannelId: state.currentChannelId,
        settings: state.settings,
      }),
    },
  ),
)

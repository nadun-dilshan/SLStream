import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, autoFocus = false, placeholder = 'Search channels, categories…' }) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 tv:h-6 tv:w-6" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-white/[0.08] bg-[#181818] pl-11 pr-10 text-sm font-semibold text-white outline-none transition placeholder:text-white/30 focus:border-[#e50914]/60 focus:bg-[#232323] focus:ring-2 focus:ring-[#e50914]/25 tv:h-16 tv:pl-14 tv:text-xl"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-white/50 transition hover:bg-white/[0.10] hover:text-white focus:outline-none tv:h-10 tv:w-10"
        >
          <X className="h-4 w-4 tv:h-5 tv:w-5" />
        </button>
      )}
    </div>
  )
}

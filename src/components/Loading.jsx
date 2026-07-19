export default function Loading({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[50vh] place-items-center px-6 text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="spinner" role="status" aria-label={label} />
        <p className="text-base font-semibold tracking-wide text-white/80">{label}</p>
      </div>
    </div>
  )
}

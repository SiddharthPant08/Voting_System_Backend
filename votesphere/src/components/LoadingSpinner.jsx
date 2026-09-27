export default function LoadingSpinner({ label, size = 20, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <span
        className="inline-block rounded-full border-2 border-current border-t-transparent animate-spin"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label && <span className="text-sm">{label}</span>}
    </span>
  )
}

export function FullPageLoader({ label = 'Loading VoteSphere…' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-paper-100 text-ink-600">
      <LoadingSpinner size={28} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}

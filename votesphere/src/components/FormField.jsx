export default function FormField({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-signal-500">{error}</p>}
    </div>
  )
}

export const inputClass = (hasError) =>
  `w-full px-3.5 py-2.5 text-sm rounded-sm border bg-white text-ink-900 placeholder:text-ink-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40 ${
    hasError ? 'border-signal-500' : 'border-ink-200 focus:border-gold-500'
  }`

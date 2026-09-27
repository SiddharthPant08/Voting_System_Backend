import { CheckCheck } from 'lucide-react'

export default function Logo({ variant = 'dark', size = 'md' }) {
  const isLight = variant === 'light'
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-base', mark: 14 },
    md: { icon: 'h-8 w-8', text: 'text-xl', mark: 18 },
    lg: { icon: 'h-11 w-11', text: 'text-2xl', mark: 22 },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2.5 select-none">
      <span
        className={`${s.icon} rounded-md flex items-center justify-center shrink-0 ${
          isLight ? 'bg-gold-500' : 'bg-ink-900'
        }`}
      >
        <CheckCheck size={s.mark} className={isLight ? 'text-ink-900' : 'text-gold-300'} strokeWidth={2.5} />
      </span>
      <span className={`${s.text} font-display font-semibold tracking-tight ${isLight ? 'text-white' : 'text-ink-900'}`}>
        Vote<span className={isLight ? 'text-gold-300' : 'text-gold-600'}>Sphere</span>
      </span>
    </div>
  )
}

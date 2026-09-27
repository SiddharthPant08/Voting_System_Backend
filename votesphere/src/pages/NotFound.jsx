import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-5">
      <div className="h-14 w-14 rounded-full bg-ink-100 flex items-center justify-center mb-5">
        <CompassIcon size={24} className="text-ink-500" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-2">Page not found</h1>
      <p className="text-sm text-ink-500 mb-7 max-w-sm">
        We couldn't find what you're looking for. The page may have moved or the link may be outdated.
      </p>
      <Link to="/" className="px-5 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors">
        Back to home
      </Link>
    </div>
  )
}

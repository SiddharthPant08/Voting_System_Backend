import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const { isAdmin } = useAuth()
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-5">
      <div className="h-14 w-14 rounded-full bg-signal-50 flex items-center justify-center mb-5">
        <ShieldAlert size={24} className="text-signal-500" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-2">You don't have permission</h1>
      <p className="text-sm text-ink-500 mb-7 max-w-sm">
        This section of VoteSphere is restricted, and your account doesn't have access to it.
      </p>
      <Link
        to={isAdmin ? '/admin' : '/dashboard'}
        className="px-5 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors"
      >
        Back to your dashboard
      </Link>
    </div>
  )
}

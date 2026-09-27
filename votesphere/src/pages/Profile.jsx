import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Calendar, ShieldCheck, KeyRound, CheckCircle2, Circle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getInitials, maskAadhaar } from '../utils/format'

export default function Profile() {
  const { user, isAdmin } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-1">My profile</h1>
      <p className="text-sm text-ink-500 mb-8">Your account information as stored on VoteSphere.</p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-ink-100 bg-white overflow-hidden"
      >
        <div className="bg-ink-900 px-6 py-8 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gold-500 text-ink-900 text-xl font-semibold flex items-center justify-center shrink-0">
            {getInitials(user.name)}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-white">{user.name}</h2>
            <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium text-gold-300 uppercase tracking-wide">
              <ShieldCheck size={13} />
              {isAdmin ? 'Administrator' : 'Registered voter'}
            </span>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-6">
          <Field icon={Mail} label="Email" value={user.email} />
          <Field icon={Phone} label="Mobile" value={user.mobile} />
          <Field icon={Calendar} label="Age" value={user.age} />
          <Field icon={MapPin} label="Address" value={user.address} />
          <Field icon={ShieldCheck} label="Aadhaar number" value={maskAadhaar(user.adhaarCardNumber)} mono />
          {!isAdmin && (
            <div>
              <p className="text-xs font-medium text-ink-400 mb-1.5 flex items-center gap-1.5">
                {user.isVoted ? <CheckCircle2 size={13} className="text-civic-500" /> : <Circle size={13} />}
                Voting status
              </p>
              <p className={`text-sm font-medium ${user.isVoted ? 'text-civic-600' : 'text-ink-700'}`}>
                {user.isVoted ? 'Vote cast' : 'Not yet voted'}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-ink-100 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-800">Password</p>
            <p className="text-xs text-ink-400">Last changed date is not tracked by the backend.</p>
          </div>
          <Link
            to="/change-password"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors"
          >
            <KeyRound size={14} />
            Change password
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

function Field({ icon: Icon, label, value, mono }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-400 mb-1.5 flex items-center gap-1.5">
        <Icon size={13} />
        {label}
      </p>
      <p className={`text-sm text-ink-800 ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</p>
    </div>
  )
}

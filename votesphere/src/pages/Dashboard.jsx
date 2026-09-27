import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Users, Vote, TrendingUp, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getAllCandidates, getVoteCount, extractList } from '../services/candidateService'
import { CardSkeleton } from '../components/Skeleton'

export default function Dashboard() {
  const { user } = useAuth()
  const [candidateCount, setCandidateCount] = useState(null)
  const [totalVotes, setTotalVotes] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [candidatesRes, countRes] = await Promise.allSettled([getAllCandidates(), getVoteCount()])
        if (cancelled) return
        const candidates = candidatesRes.status === 'fulfilled' ? extractList(candidatesRes.value) : []
        const counts = countRes.status === 'fulfilled' ? extractList(countRes.value) : []
        const votes = counts.length
          ? counts.reduce((sum, c) => sum + (c.count ?? c.voteCount ?? 0), 0)
          : candidates.reduce((sum, c) => sum + (c.voteCount ?? 0), 0)
        setCandidateCount(candidates.length)
        setTotalVotes(votes)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-1">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-ink-500 mb-8">Here's the current state of the election.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatusCard voted={user?.isVoted} />
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <InfoCard icon={Vote} label="Election status" value="Open for voting" tone="civic" />
            <InfoCard icon={Users} label="Available candidates" value={candidateCount ?? '—'} tone="gold" />
            <InfoCard icon={TrendingUp} label="Total votes cast" value={totalVotes ?? '—'} tone="ink" />
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <ActionCard
          title={user?.isVoted ? 'Vote Successfully Cast' : 'Your vote has not been cast yet'}
          description={
            user?.isVoted
              ? 'Thank you for participating. You can review candidates and results at any time.'
              : 'Review the candidates and submit your vote — it only takes a moment.'
          }
          cta={user?.isVoted ? 'View candidates' : 'Vote now'}
          to="/candidates"
          highlighted={!user?.isVoted}
        />
        <ActionCard
          title="See live results"
          description="Check party-wise vote counts as they update, visualized with charts."
          cta="View results"
          to="/results"
        />
      </div>
    </div>
  )
}

function StatusCard({ voted }) {
  return (
    <div className={`rounded-lg border p-5 ${voted ? 'bg-civic-50 border-civic-300/40' : 'bg-white border-ink-100'}`}>
      <div className="flex items-center gap-2 mb-3">
        {voted ? (
          <CheckCircle2 size={16} className="text-civic-500" />
        ) : (
          <Circle size={16} className="text-ink-400" />
        )}
        <span className="text-xs font-medium text-ink-500">Voting status</span>
      </div>
      <p className={`font-display text-lg font-semibold ${voted ? 'text-civic-600' : 'text-ink-900'}`}>
        {voted ? 'Vote cast' : 'Not yet voted'}
      </p>
    </div>
  )
}

const TONES = {
  civic: 'text-civic-500 bg-civic-50',
  gold: 'text-gold-600 bg-gold-50',
  ink: 'text-ink-700 bg-ink-100',
}

function InfoCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-3 ${TONES[tone]}`}>
        <Icon size={15} />
      </div>
      <p className="font-display text-xl font-semibold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500 mt-1">{label}</p>
    </div>
  )
}

function ActionCard({ title, description, cta, to, highlighted }) {
  return (
    <div
      className={`rounded-lg border p-6 flex flex-col ${
        highlighted ? 'bg-ink-900 border-ink-900' : 'bg-white border-ink-100'
      }`}
    >
      <h3 className={`font-display text-lg font-semibold mb-2 ${highlighted ? 'text-white' : 'text-ink-900'}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed mb-6 ${highlighted ? 'text-ink-300' : 'text-ink-500'}`}>
        {description}
      </p>
      <Link
        to={to}
        className={`mt-auto inline-flex items-center gap-2 text-sm font-medium w-fit transition-colors ${
          highlighted ? 'text-gold-300 hover:text-gold-100' : 'text-ink-900 hover:text-gold-600'
        }`}
      >
        {cta} <ArrowRight size={15} />
      </Link>
    </div>
  )
}

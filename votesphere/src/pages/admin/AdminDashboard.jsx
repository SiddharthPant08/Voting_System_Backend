import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Vote, TrendingUp, Activity, ArrowRight, Plus } from 'lucide-react'
import { getAllCandidates, getVoteCount, extractList } from '../../services/candidateService'
import { CardSkeleton } from '../../components/Skeleton'
import { partyColor, getInitials } from '../../utils/format'

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([])
  const [totalVotes, setTotalVotes] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [candidatesRes, countRes] = await Promise.allSettled([getAllCandidates(), getVoteCount()])
        if (cancelled) return
        const list = candidatesRes.status === 'fulfilled' ? extractList(candidatesRes.value) : []
        const counts = countRes.status === 'fulfilled' ? extractList(countRes.value) : []
        const votes = counts.length
          ? counts.reduce((sum, c) => sum + (c.count ?? c.voteCount ?? 0), 0)
          : list.reduce((sum, c) => sum + (c.voteCount ?? 0), 0)
        setCandidates(list)
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

  const parties = new Set(candidates.map((c) => c.party)).size

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">Admin dashboard</h1>
          <p className="text-sm text-ink-500 mt-1">Overview of the current election.</p>
        </div>
        <Link
          to="/admin/candidates/new"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm bg-ink-900 hover:bg-ink-800 text-white transition-colors"
        >
          <Plus size={15} /> Add candidate
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={Users} label="Total candidates" value={candidates.length} />
            <StatCard icon={Vote} label="Total votes" value={totalVotes ?? '—'} />
            <StatCard icon={TrendingUp} label="Parties in contest" value={parties} />
            <StatCard icon={Activity} label="Election status" value="Open" isText />
          </>
        )}
      </div>

      <div className="rounded-lg border border-ink-100 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base font-semibold text-ink-900">Candidates</h2>
          <Link to="/admin/candidates" className="text-sm font-medium text-ink-500 hover:text-ink-900 flex items-center gap-1.5">
            Manage all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-ink-400">Loading…</p>
        ) : candidates.length === 0 ? (
          <p className="text-sm text-ink-500">No candidates have been added yet.</p>
        ) : (
          <div className="divide-y divide-ink-100">
            {candidates.slice(0, 5).map((c) => (
              <div key={c._id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: partyColor(c.party) }}
                  >
                    {getInitials(c.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-500">{c.party}</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-ink-600">{c.voteCount ?? 0} votes</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, isText }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <div className="h-8 w-8 rounded-full bg-ink-100 flex items-center justify-center mb-3">
        <Icon size={15} className="text-ink-700" />
      </div>
      <p className="font-display text-xl font-semibold text-ink-900">{isText ? value : Number(value).toLocaleString?.() ?? value}</p>
      <p className="text-xs text-ink-500 mt-1">{label}</p>
    </div>
  )
}

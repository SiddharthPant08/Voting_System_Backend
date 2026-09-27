import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { RefreshCw, BarChart3, Trophy } from 'lucide-react'
import { getVoteCount, extractList } from '../services/candidateService'
import EmptyState from '../components/EmptyState'
import { partyColor } from '../utils/format'

export default function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true)
    setError('')
    try {
      const data = await getVoteCount()
      const list = extractList(data).map((row) => ({
        party: row.party || row._id || 'Unknown',
        count: row.count ?? row.voteCount ?? 0,
      }))
      setResults(list)
    } catch (err) {
      setError(err.message || 'Could not load results.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const totalVotes = results.reduce((sum, r) => sum + r.count, 0)
  const leader = results.length
    ? results.reduce((max, r) => (r.count > max.count ? r : max), results[0])
    : null

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-civic-500 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-civic-500 animate-pulse" />
            LIVE RESULTS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">Election results</h1>
          <p className="text-sm text-ink-500 mt-1">Reflects vote counts currently stored on the server.</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-lg bg-ink-100 animate-pulse" />
          <div className="h-80 rounded-lg bg-ink-100 animate-pulse" />
        </div>
      ) : error ? (
        <div className="mt-10">
          <EmptyState
            icon={BarChart3}
            title="Couldn't load results"
            description={error}
            action={
              <button
                onClick={() => load()}
                className="px-4 py-2 text-sm font-medium rounded-sm bg-ink-900 text-white hover:bg-ink-800 transition-colors"
              >
                Try again
              </button>
            }
          />
        </div>
      ) : results.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={BarChart3}
            title="No results yet"
            description="No votes have been cast yet. Results will appear here as votes come in."
          />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 my-8">
            <SummaryCard label="Total votes cast" value={totalVotes.toLocaleString()} />
            <SummaryCard label="Parties in contest" value={results.length} />
            <SummaryCard
              label="Leading party"
              value={leader?.party || '—'}
              icon={Trophy}
              accent
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 rounded-lg border border-ink-100 bg-white p-6">
              <h2 className="font-display text-base font-semibold text-ink-900 mb-5">Votes by party</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDE2EB" />
                  <XAxis dataKey="party" tick={{ fontSize: 12, fill: '#5C6E90' }} axisLine={{ stroke: '#DDE2EB' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#5C6E90' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #DDE2EB', fontSize: 13 }}
                    cursor={{ fill: '#F6F4EE' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={700}>
                    {results.map((entry) => (
                      <Cell key={entry.party} fill={partyColor(entry.party)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border border-ink-100 bg-white p-6">
              <h2 className="font-display text-base font-semibold text-ink-900 mb-5">Vote share</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={results}
                    dataKey="count"
                    nameKey="party"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    animationDuration={700}
                  >
                    {results.map((entry) => (
                      <Cell key={entry.party} fill={partyColor(entry.party)} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #DDE2EB', fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {results.map((r) => (
                  <div key={r.party} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColor(r.party) }} />
                      <span className="text-ink-600">{r.party}</span>
                    </div>
                    <span className="font-mono text-ink-500">
                      {totalVotes ? Math.round((r.count / totalVotes) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

function SummaryCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <p className="text-xs font-medium text-ink-500 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-gold-600" />}
        <p className={`font-display text-xl font-semibold ${accent ? 'text-gold-600' : 'text-ink-900'}`}>{value}</p>
      </div>
    </div>
  )
}

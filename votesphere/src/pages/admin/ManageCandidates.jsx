import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Users, ArrowUpDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllCandidates, deleteCandidate, extractList } from '../../services/candidateService'
import CandidateTable from '../../components/CandidateTable'
import ConfirmModal from '../../components/ConfirmModal'
import EmptyState from '../../components/EmptyState'

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'votes-desc', label: 'Votes (high to low)' },
  { value: 'age-asc', label: 'Age (low to high)' },
]

export default function ManageCandidates() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [partyFilter, setPartyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getAllCandidates()
      setCandidates(extractList(data))
    } catch (err) {
      setError(err.message || 'Could not load candidates.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const parties = useMemo(() => Array.from(new Set(candidates.map((c) => c.party))).sort(), [candidates])

  const visible = useMemo(() => {
    let list = [...candidates]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((c) => c.name?.toLowerCase().includes(q) || c.party?.toLowerCase().includes(q))
    }
    if (partyFilter !== 'all') {
      list = list.filter((c) => c.party === partyFilter)
    }
    switch (sortBy) {
      case 'votes-desc':
        list.sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0))
        break
      case 'age-asc':
        list.sort((a, b) => (a.age ?? 0) - (b.age ?? 0))
        break
      default:
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }
    return list
  }, [candidates, search, partyFilter, sortBy])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCandidate(deleteTarget._id)
      toast.success('Candidate deleted successfully')
      setCandidates((prev) => prev.filter((c) => c._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message || 'Could not delete this candidate.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">Manage candidates</h1>
          <p className="text-sm text-ink-500 mt-1">Add, edit or remove candidates from this election.</p>
        </div>
        <Link
          to="/admin/candidates/new"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm bg-ink-900 hover:bg-ink-800 text-white transition-colors"
        >
          <Plus size={15} /> Add candidate
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-sm border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
            placeholder="Search by candidate or party…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={partyFilter}
          onChange={(e) => setPartyFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm rounded-sm border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
        >
          <option value="all">All parties</option>
          {parties.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-9 pr-3.5 py-2.5 text-sm rounded-sm border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/40 appearance-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </div>

      {!loading && error ? (
        <EmptyState
          icon={Users}
          title="Couldn't load candidates"
          description={error}
          action={
            <button onClick={load} className="px-4 py-2 text-sm font-medium rounded-sm bg-ink-900 text-white hover:bg-ink-800">
              Try again
            </button>
          }
        />
      ) : !loading && visible.length === 0 && candidates.length > 0 ? (
        <EmptyState icon={Users} title="No matching candidates" description="Try adjusting your search or filter." />
      ) : !loading && candidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates yet"
          description="Add your first candidate to get this election started."
          action={
            <Link to="/admin/candidates/new" className="px-4 py-2 text-sm font-medium rounded-sm bg-ink-900 text-white hover:bg-ink-800">
              Add candidate
            </Link>
          }
        />
      ) : (
        <CandidateTable
          candidates={visible}
          isLoading={loading}
          onEdit={(c) => navigate(`/admin/candidates/${c._id}/edit`)}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this candidate?"
        description={`This will permanently remove ${deleteTarget?.name || 'this candidate'} from the election. This action cannot be undone.`}
        confirmLabel="Delete candidate"
        loadingLabel="Deleting…"
        tone="danger"
        isLoading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

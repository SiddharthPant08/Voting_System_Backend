import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllCandidates, updateCandidate, extractList } from '../../services/candidateService'
import CandidateForm from '../../components/CandidateForm'
import { FullPageLoader } from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'

export default function EditCandidate() {
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        // The list endpoint is the reliably documented one, so we fetch all
        // candidates and find the match rather than assuming a
        // GET /candidate/:id route exists.
        const data = await getAllCandidates()
        const list = extractList(data)
        const found = list.find((c) => c._id === candidateId)
        if (!cancelled) {
          if (found) setCandidate(found)
          else setError('This candidate could not be found.')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load candidate details.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [candidateId])

  async function handleSubmit(payload) {
    await updateCandidate(candidateId, payload)
    toast.success('Candidate updated successfully')
    navigate('/admin/candidates')
  }

  if (loading) return <FullPageLoader label="Loading candidate…" />

  return (
    <div className="max-w-lg">
      <button
        onClick={() => navigate('/admin/candidates')}
        className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to candidates
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">Edit candidate</h1>
      <p className="text-sm text-ink-500 mb-7">Update this candidate's details.</p>

      {error ? (
        <EmptyState icon={Users} title="Couldn't load candidate" description={error} />
      ) : (
        <div className="bg-white rounded-lg border border-ink-100 shadow-card p-7">
          <CandidateForm
            initialValues={candidate}
            submitLabel="Save changes"
            loadingLabel="Saving…"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin/candidates')}
          />
        </div>
      )}
    </div>
  )
}

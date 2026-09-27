import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { addCandidate } from '../../services/candidateService'
import CandidateForm from '../../components/CandidateForm'

export default function AddCandidate() {
  const navigate = useNavigate()

  async function handleSubmit(payload) {
    await addCandidate(payload)
    toast.success('Candidate added successfully')
    navigate('/admin/candidates')
  }

  return (
    <div className="max-w-lg">
      <button
        onClick={() => navigate('/admin/candidates')}
        className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to candidates
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">Add candidate</h1>
      <p className="text-sm text-ink-500 mb-7">Register a new candidate for this election.</p>

      <div className="bg-white rounded-lg border border-ink-100 shadow-card p-7">
        <CandidateForm
          submitLabel="Add candidate"
          loadingLabel="Adding…"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/candidates')}
        />
      </div>
    </div>
  )
}

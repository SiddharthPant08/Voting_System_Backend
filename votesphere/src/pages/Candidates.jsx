import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getAllCandidates, voteForCandidate, extractList } from '../services/candidateService'
import CandidateCard from '../components/CandidateCard'
import VoteModal from '../components/VoteModal'
import EmptyState from '../components/EmptyState'
import { CandidateCardSkeleton } from '../components/Skeleton'

export default function Candidates() {
  const { user, isAdmin, refreshProfile } = useAuth()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [voteTarget, setVoteTarget] = useState(null)
  const [voteStatus, setVoteStatus] = useState('confirm')

  async function loadCandidates() {
    setLoading(true)
    setLoadError('')
    try {
      const data = await getAllCandidates()
      setCandidates(extractList(data))
    } catch (err) {
      setLoadError(err.message || 'Could not load candidates.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  function openConfirm(candidate) {
    setVoteTarget(candidate)
    setVoteStatus('confirm')
  }

  function closeModal() {
    if (voteStatus === 'submitting') return
    setVoteTarget(null)
  }

  async function handleConfirmVote() {
    if (!voteTarget) return
    setVoteStatus('submitting')
    try {
      await voteForCandidate(voteTarget._id)
      setVoteStatus('success')
      await Promise.all([loadCandidates(), refreshProfile()])
      toast.success('Vote recorded successfully')
    } catch (err) {
      setVoteTarget(null)
      const message = err.message || ''
      if (/already voted/i.test(message)) {
        toast.error('You have already cast your vote.')
      } else if (/admin/i.test(message) && /vote/i.test(message)) {
        toast.error('Admin accounts are not permitted to vote.')
      } else {
        toast.error(message || 'Your vote could not be submitted. Please try again.')
      }
      await refreshProfile()
    }
  }

  const hasVoted = Boolean(user?.isVoted)

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">Candidates</h1>
          <p className="text-sm text-ink-500 mt-1">Review each candidate before casting your vote.</p>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-6 rounded border border-gold-500/40 bg-gold-50 text-sm text-gold-700 px-4 py-3">
          Admin accounts cannot vote. You're viewing this page for reference only.
        </div>
      )}

      {!isAdmin && hasVoted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center gap-2.5 rounded border border-civic-300/40 bg-civic-50 text-sm text-civic-600 px-4 py-3"
        >
          <CheckCircle2 size={16} />
          You have already cast your vote. Thank you for participating.
        </motion.div>
      )}

      <div className="mt-8">
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CandidateCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <EmptyState
            icon={Users}
            title="Couldn't load candidates"
            description={loadError}
            action={
              <button
                onClick={loadCandidates}
                className="px-4 py-2 text-sm font-medium rounded-sm bg-ink-900 text-white hover:bg-ink-800 transition-colors"
              >
                Try again
              </button>
            }
          />
        )}

        {!loading && !loadError && candidates.length === 0 && (
          <EmptyState
            icon={Users}
            title="No candidates yet"
            description="Candidates haven't been added to this election yet. Check back soon."
          />
        )}

        {!loading && !loadError && candidates.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                canVote={!isAdmin && !hasVoted}
                hasVoted={!isAdmin && hasVoted}
                onVote={openConfirm}
              />
            ))}
          </div>
        )}
      </div>

      <VoteModal candidate={voteTarget} status={voteStatus} onConfirm={handleConfirmVote} onClose={closeModal} />
    </div>
  )
}

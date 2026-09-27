import { motion } from 'framer-motion'
import { CheckCircle2, Vote } from 'lucide-react'
import { getInitials, partyColor } from '../utils/format'

export default function CandidateCard({ candidate, canVote, hasVoted, onVote }) {
  const color = partyColor(candidate.party)

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="group relative rounded-lg border border-ink-100 bg-white p-5 shadow-card flex flex-col"
    >
      <div className="absolute top-0 left-5 right-5 h-[3px] rounded-b" style={{ backgroundColor: color }} />

      <div className="flex items-center gap-3 mb-4 mt-1">
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center text-base font-semibold text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {getInitials(candidate.name)}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-ink-900 truncate">{candidate.name}</h3>
          <p className="text-sm text-ink-500 truncate">{candidate.party}</p>
        </div>
      </div>

      <dl className="flex items-center gap-4 text-xs text-ink-500 mb-5">
        <div className="flex items-center gap-1.5">
          <dt className="font-medium text-ink-400">Age</dt>
          <dd className="text-ink-700">{candidate.age ?? '—'}</dd>
        </div>
        {typeof candidate.voteCount === 'number' && (
          <div className="flex items-center gap-1.5">
            <dt className="font-medium text-ink-400">Votes</dt>
            <dd className="text-ink-700 font-mono">{candidate.voteCount}</dd>
          </div>
        )}
      </dl>

      <div className="mt-auto">
        {hasVoted ? (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-civic-500 bg-civic-50 rounded-sm py-2.5">
            <CheckCircle2 size={16} />
            Vote submitted
          </div>
        ) : (
          <button
            onClick={() => onVote(candidate)}
            disabled={!canVote}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-ink-900 hover:bg-ink-800 disabled:bg-ink-200 disabled:text-ink-400 rounded-sm py-2.5 transition-colors"
          >
            <Vote size={15} />
            Vote for {candidate.name.split(' ')[0]}
          </button>
        )}
      </div>
    </motion.div>
  )
}

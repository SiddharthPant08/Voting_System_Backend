import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { getInitials, partyColor } from '../utils/format'
import LoadingSpinner from './LoadingSpinner'

export default function VoteModal({ candidate, status, onConfirm, onClose }) {
  // status: 'confirm' | 'submitting' | 'success'
  if (!candidate) return null
  const open = Boolean(candidate)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/55 backdrop-blur-[2px]"
            onClick={status === 'confirm' ? onClose : undefined}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-sm rounded-lg bg-white shadow-raised border border-ink-100 p-6 overflow-hidden"
          >
            {status !== 'success' && (
              <button
                onClick={status === 'confirm' ? onClose : undefined}
                className="absolute top-4 right-4 text-ink-400 hover:text-ink-700 transition-colors disabled:opacity-40"
                disabled={status === 'submitting'}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}

            {status !== 'success' ? (
              <>
                <div className="h-10 w-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center mb-4">
                  <ShieldCheck size={19} />
                </div>
                <h2 className="font-display text-lg font-semibold text-ink-900 mb-1.5">Confirm your vote</h2>
                <p className="text-sm text-ink-500 leading-relaxed mb-5">
                  Are you sure you want to vote for <span className="font-medium text-ink-800">{candidate.name}</span>{' '}
                  representing <span className="font-medium text-ink-800">{candidate.party}</span>? This action cannot
                  be undone.
                </p>

                <div className="flex items-center gap-3 rounded border border-ink-100 bg-paper-50 p-3 mb-6">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                    style={{ backgroundColor: partyColor(candidate.party) }}
                  >
                    {getInitials(candidate.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{candidate.name}</p>
                    <p className="text-xs text-ink-500 truncate">{candidate.party}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={onClose}
                    disabled={status === 'submitting'}
                    className="px-4 py-2 text-sm font-medium rounded-sm text-ink-600 hover:bg-ink-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={status === 'submitting'}
                    className="px-5 py-2 text-sm font-medium rounded-sm text-white bg-ink-900 hover:bg-ink-800 transition-colors disabled:opacity-70 flex items-center gap-2 min-w-[132px] justify-center"
                  >
                    {status === 'submitting' ? (
                      <LoadingSpinner size={14} label="Submitting…" />
                    ) : (
                      'Confirm vote'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="h-14 w-14 rounded-full bg-civic-50 text-civic-500 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 size={30} />
                </motion.div>
                <h2 className="font-display text-lg font-semibold text-ink-900 mb-1">Vote recorded</h2>
                <p className="text-sm text-ink-500 mb-6">
                  Your vote for {candidate.name} has been securely cast.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium rounded-sm text-white bg-ink-900 hover:bg-ink-800 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

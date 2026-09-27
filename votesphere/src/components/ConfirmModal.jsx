import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  loadingLabel = 'Working…',
  tone = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}) {
  const toneStyles =
    tone === 'danger'
      ? { icon: 'bg-signal-50 text-signal-500', button: 'bg-signal-500 hover:bg-signal-600' }
      : { icon: 'bg-gold-50 text-gold-600', button: 'bg-ink-900 hover:bg-ink-800' }

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
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
            onClick={!isLoading ? onClose : undefined}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-sm rounded-lg bg-white shadow-raised border border-ink-100 p-6"
          >
            <button
              onClick={!isLoading ? onClose : undefined}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-4 ${toneStyles.icon}`}>
              <AlertTriangle size={19} />
            </div>
            <h2 id="confirm-modal-title" className="font-display text-lg font-semibold text-ink-900 mb-1.5">
              {title}
            </h2>
            <p className="text-sm text-ink-500 leading-relaxed mb-6">{description}</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-sm text-ink-600 hover:bg-ink-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-sm text-white transition-colors disabled:opacity-70 flex items-center gap-2 ${toneStyles.button}`}
              >
                {isLoading ? <LoadingSpinner size={14} label={loadingLabel} /> : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import FormField, { inputClass } from './FormField'
import LoadingSpinner from './LoadingSpinner'

export default function CandidateForm({ initialValues, submitLabel, loadingLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialValues?.name || '',
    party: initialValues?.party || '',
    age: initialValues?.age ?? '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Candidate name is required.'
    if (!form.party.trim()) next.party = 'Party name is required.'
    const age = Number(form.age)
    if (!form.age || Number.isNaN(age) || age < 18 || age > 100) {
      next.age = 'Enter a reasonable age between 18 and 100.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await onSubmit({
        name: form.name.trim(),
        party: form.party.trim(),
        age: Number(form.age),
      })
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && (
        <div className="text-sm text-signal-500 bg-signal-50 border border-signal-300/40 rounded-sm px-3.5 py-2.5">
          {formError}
        </div>
      )}

      <FormField label="Candidate name" error={errors.name}>
        <input
          className={inputClass(errors.name)}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Aanya Sharma"
        />
      </FormField>

      <FormField label="Party" error={errors.party}>
        <input
          className={inputClass(errors.party)}
          value={form.party}
          onChange={(e) => setForm((f) => ({ ...f, party: e.target.value }))}
          placeholder="e.g. Unity Party"
        />
      </FormField>

      <FormField label="Age" error={errors.age}>
        <input
          type="number"
          min={18}
          max={100}
          className={inputClass(errors.age)}
          value={form.age}
          onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
          placeholder="45"
        />
      </FormField>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors disabled:opacity-70 min-w-[140px] justify-center"
        >
          {submitting ? <LoadingSpinner size={14} label={loadingLabel} /> : submitLabel}
        </button>
      </div>
    </form>
  )
}

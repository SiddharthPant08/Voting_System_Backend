import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { changePassword } from '../services/authService'
import FormField, { inputClass } from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
  const [show, setShow] = useState({ current: false, next: false })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function validate() {
    const next = {}
    if (!form.currentPassword) next.currentPassword = 'Enter your current password.'
    if (form.newPassword.length < 6) next.newPassword = 'New password must be at least 6 characters.'
    if (form.confirmNewPassword !== form.newPassword) next.confirmNewPassword = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password updated successfully')
      navigate('/profile')
    } catch (err) {
      setFormError(err.message || 'Could not update your password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-10">
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to profile
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">Change password</h1>
      <p className="text-sm text-ink-500 mb-7">Choose a new password for your VoteSphere account.</p>

      <div className="bg-white rounded-lg border border-ink-100 shadow-card p-7">
        {formError && (
          <div className="mb-5 text-sm text-signal-500 bg-signal-50 border border-signal-300/40 rounded-sm px-3.5 py-2.5">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Current password" error={errors.currentPassword}>
            <div className="relative">
              <input
                type={show.current ? 'text' : 'password'}
                className={`${inputClass(errors.currentPassword)} pr-10`}
                value={form.currentPassword}
                onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
              >
                {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <FormField label="New password" error={errors.newPassword}>
            <div className="relative">
              <input
                type={show.next ? 'text' : 'password'}
                className={`${inputClass(errors.newPassword)} pr-10`}
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
              >
                {show.next ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm new password" error={errors.confirmNewPassword}>
            <input
              type={show.next ? 'text' : 'password'}
              className={inputClass(errors.confirmNewPassword)}
              value={form.confirmNewPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmNewPassword: e.target.value }))}
            />
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors disabled:opacity-70"
          >
            {submitting ? <LoadingSpinner size={15} label="Updating…" /> : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

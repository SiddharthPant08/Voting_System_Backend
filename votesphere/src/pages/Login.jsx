import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Fingerprint, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import FormField, { inputClass } from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ adhaarCardNumber: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function validate() {
    const next = {}
    const aadhaarDigits = form.adhaarCardNumber.replace(/\D/g, '')
    if (!aadhaarDigits) next.adhaarCardNumber = 'Aadhaar number is required.'
    else if (aadhaarDigits.length !== 12) next.adhaarCardNumber = 'Aadhaar number must be 12 digits.'
    if (!form.password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const profile = await login({
        adhaarCardNumber: Number(form.adhaarCardNumber.replace(/\D/g, '')),
        password: form.password,
      })
      toast.success('Login successful')
      const redirectTo = location.state?.from?.pathname
      if (redirectTo && redirectTo !== '/login') {
        navigate(redirectTo, { replace: true })
      } else {
        navigate(profile?.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
      }
    } catch (err) {
      setFormError(err.message || 'Unable to log in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="bg-white rounded-lg border border-ink-100 shadow-card p-8">
          <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1.5">Welcome back</h1>
          <p className="text-sm text-ink-500 mb-7">Log in with your Aadhaar number to continue.</p>

          {formError && (
            <div className="mb-5 text-sm text-signal-500 bg-signal-50 border border-signal-300/40 rounded-sm px-3.5 py-2.5">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField label="Aadhaar number" error={errors.adhaarCardNumber}>
              <div className="relative">
                <Fingerprint size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="1234 5678 9012"
                  className={`${inputClass(errors.adhaarCardNumber)} pl-10`}
                  value={form.adhaarCardNumber}
                  onChange={(e) => setForm((f) => ({ ...f, adhaarCardNumber: e.target.value }))}
                />
              </div>
            </FormField>

            <FormField label="Password" error={errors.password}>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`${inputClass(errors.password)} pl-10 pr-10`}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors disabled:opacity-70"
            >
              {submitting ? <LoadingSpinner size={15} label="Signing in…" /> : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-ink-500 text-center mt-7">
            New to VoteSphere?{' '}
            <Link to="/signup" className="font-medium text-ink-900 hover:text-gold-600">
              Register to vote
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

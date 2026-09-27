import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import FormField, { inputClass } from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'

const STEPS = ['Personal information', 'Address', 'Identity & security']

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    adhaarCardNumber: '',
    password: '',
    confirmPassword: '',
  })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validateStep(current) {
    const next = {}
    if (current === 0) {
      if (!form.name.trim()) next.name = 'Name is required.'
      if (!form.age || Number(form.age) < 18) next.age = 'You must be at least 18 years old.'
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
      if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) next.mobile = 'Enter a valid 10-digit mobile number.'
    }
    if (current === 1) {
      if (!form.address.trim()) next.address = 'Address is required.'
    }
    if (current === 2) {
      const aadhaarDigits = form.adhaarCardNumber.replace(/\D/g, '')
      if (aadhaarDigits.length !== 12) next.adhaarCardNumber = 'Aadhaar number must be 12 digits.'
      if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
      if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validateStep(2)) return

    setSubmitting(true)
    try {
      // confirmPassword is intentionally excluded — the backend does not expect it.
      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        email: form.email.trim(),
        mobile: form.mobile.replace(/\D/g, ''),
        address: form.address.trim(),
        adhaarCardNumber: Number(form.adhaarCardNumber.replace(/\D/g, '')),
        password: form.password,
      }
      const profile = await signup(payload)
      toast.success('Account created successfully')
      navigate(profile?.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setFormError(err.message || 'Unable to create your account. Please try again.')
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
        className="w-full max-w-lg"
      >
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="bg-white rounded-lg border border-ink-100 shadow-card p-8">
          <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1.5">Register to vote</h1>
          <p className="text-sm text-ink-500 mb-6">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

          <ProgressBar step={step} />

          {formError && (
            <div className="mt-6 text-sm text-signal-500 bg-signal-50 border border-signal-300/40 rounded-sm px-3.5 py-2.5">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <StepWrapper key="step0">
                  <FormField label="Full name" error={errors.name}>
                    <input
                      className={inputClass(errors.name)}
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="e.g. Priya Nair"
                    />
                  </FormField>
                  <FormField label="Age" error={errors.age}>
                    <input
                      type="number"
                      min={18}
                      className={inputClass(errors.age)}
                      value={form.age}
                      onChange={(e) => update('age', e.target.value)}
                      placeholder="18"
                    />
                  </FormField>
                  <FormField label="Email" error={errors.email}>
                    <input
                      type="email"
                      className={inputClass(errors.email)}
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                    />
                  </FormField>
                  <FormField label="Mobile number" error={errors.mobile}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      className={inputClass(errors.mobile)}
                      value={form.mobile}
                      onChange={(e) => update('mobile', e.target.value)}
                      placeholder="9876543210"
                    />
                  </FormField>
                </StepWrapper>
              )}

              {step === 1 && (
                <StepWrapper key="step1">
                  <FormField label="Residential address" error={errors.address}>
                    <textarea
                      rows={4}
                      className={inputClass(errors.address)}
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                      placeholder="House no., street, city, state, PIN"
                    />
                  </FormField>
                </StepWrapper>
              )}

              {step === 2 && (
                <StepWrapper key="step2">
                  <FormField label="Aadhaar number" error={errors.adhaarCardNumber}>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={14}
                      className={inputClass(errors.adhaarCardNumber)}
                      value={form.adhaarCardNumber}
                      onChange={(e) => update('adhaarCardNumber', e.target.value)}
                      placeholder="1234 5678 9012"
                    />
                  </FormField>
                  <FormField label="Password" error={errors.password}>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`${inputClass(errors.password)} pr-10`}
                        value={form.password}
                        onChange={(e) => update('password', e.target.value)}
                        placeholder="At least 6 characters"
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
                    <PasswordStrength password={form.password} />
                  </FormField>
                  <FormField label="Confirm password" error={errors.confirmPassword}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={inputClass(errors.confirmPassword)}
                      value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      placeholder="Re-enter your password"
                    />
                  </FormField>
                </StepWrapper>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className="px-4 py-2.5 text-sm font-medium text-ink-500 hover:text-ink-800 disabled:opacity-0 transition-colors"
              >
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors disabled:opacity-70"
                >
                  {submitting ? <LoadingSpinner size={15} label="Creating account…" /> : 'Create account'}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-sm text-ink-500 text-center mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-ink-900 hover:text-gold-600">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

function StepWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {children}
    </motion.div>
  )
}

function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex-1 flex items-center gap-2">
          <div
            className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              i < step
                ? 'bg-civic-500 text-white'
                : i === step
                ? 'bg-ink-900 text-white'
                : 'bg-ink-100 text-ink-400'
            }`}
          >
            {i < step ? <Check size={13} /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-civic-500' : 'bg-ink-100'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { label: 'Weak', color: 'bg-signal-500' },
    { label: 'Fair', color: 'bg-gold-500' },
    { label: 'Good', color: 'bg-gold-500' },
    { label: 'Strong', color: 'bg-civic-500' },
  ]
  const level = levels[Math.max(0, Math.min(score - 1, 3))]

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? level.color : 'bg-ink-100'}`} />
        ))}
      </div>
      <p className="text-xs text-ink-400 mt-1.5">{level.label} password</p>
    </div>
  )
}

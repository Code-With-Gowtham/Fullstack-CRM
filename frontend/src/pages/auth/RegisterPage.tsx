import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Crown, User, Mail, Lock, Building2 } from 'lucide-react'
import { Field, Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { apiEnabled } from '@/lib/api'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiEnabled) {
      setMessage('Self-service registration requires the configured backend. Please sign in with an active demo account.')
      return
    }
    setMessage('')
    setSubmitting(true)
    try {
      await register(name, email, password, company)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create your workspace. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 lg:hidden">
          <Crown className="h-3.5 w-3.5" /> Pulse CRM
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-ink-500">Set up Pulse CRM for your sales and support teams in minutes.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {message && (
          <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {message}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9" placeholder="Gowtham Raj" required minLength={2} maxLength={120} />
            </div>
          </Field>
          <Field label="Work email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="you@company.com" required />
            </div>
          </Field>
        </div>
        <Field label="Company">
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input value={company} onChange={(e) => setCompany(e.target.value)} className="pl-9" placeholder="Your company or workspace" required minLength={2} maxLength={160} />
          </div>
        </Field>
        <Field label="Password" hint="At least 12 characters. Your account will be the workspace administrator.">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="At least 12 characters" required minLength={12} maxLength={128} />
          </div>
        </Field>
        <label className="flex items-start gap-2 text-sm text-ink-600">
          <input type="checkbox" className="mt-1 rounded border-ink-300 text-brand-600 focus:ring-brand-500" required />
          <span>
            I agree to the <a className="text-brand-700 hover:underline">Terms</a> and <a className="text-brand-700 hover:underline">Privacy Policy</a>.
          </span>
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
          Create account <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="text-center text-sm text-ink-500">
        Already have an account? <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">Sign in</Link>
      </p>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, Crown, ShieldCheck, BriefcaseBusiness, Headset, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Field, Input } from '@/components/ui/Input'
import { apiEnabled } from '@/lib/api'
import type { Role } from '@/types'

const roleOptions: { role: Role; label: string; description: string; email: string; icon: typeof ShieldCheck }[] = [
  { role: 'admin', label: 'Administrator', description: 'Full access to every CRM area and user management.', email: 'gowtham@pulsecrm.com', icon: ShieldCheck },
  { role: 'manager', label: 'Sales Manager', description: 'Manage sales activity, reports, and team workflows.', email: 'ram@pulsecrm.com', icon: BriefcaseBusiness },
  { role: 'sales', label: 'Sales Executive', description: 'Work with assigned customers, leads, and pipeline.', email: 'raja@pulsecrm.com', icon: TrendingUp },
  { role: 'support', label: 'Support Agent', description: 'Handle customer conversations and support tickets.', email: 'anjali@pulsecrm.com', icon: Headset },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { role: roleParam } = useParams<{ role: string }>()
  const roleOption = roleOptions.find((option) => option.role === roleParam)
  const [email, setEmail] = useState(apiEnabled ? '' : roleOption?.email ?? '')
  const [password, setPassword] = useState(apiEnabled ? '' : 'demo1234')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (roleOption && !apiEnabled) setEmail(roleOption.email)
  }, [roleOption])

  if (!roleParam) {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 lg:hidden">
            <Crown className="h-3.5 w-3.5" /> Pulse CRM
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Choose your sign-in</h1>
          <p className="mt-1 text-sm text-ink-500">{apiEnabled ? 'Select the role assigned to your workspace account.' : 'Select your role to open the right CRM workspace.'}</p>
        </div>
        <div className="space-y-3">
          {roleOptions.map(({ role, label, description, email: accountEmail, icon: Icon }) => (
            <Link
              key={role}
              to={`/login/${role}`}
              className="flex items-start gap-3 rounded-xl border border-ink-200 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink-900">{label}</span>
                <span className="mt-1 block text-xs text-ink-500">{description}</span>
                {!apiEnabled && <span className="mt-2 block truncate text-xs text-brand-700">{accountEmail}</span>}
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-400" />
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-ink-500">
          New to Pulse? <Link to="/register" className="font-medium text-brand-700 hover:text-brand-800">Create an account</Link>
        </p>
      </div>
    )
  }

  if (!roleOption) return <Navigate to="/login" replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    if (!email || !password) {
      setError('Email and password are required.')
      setSubmitting(false)
      return
    }
    try {
      if (!(await login(email, password, roleOption.role))) {
        setError(`Sign-in failed. Use an active ${roleOption.label} account.`)
        return
      }
      const redirect = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'
      navigate(redirect, { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Please try again.')
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
        <h1 className="text-2xl font-semibold tracking-tight">Sign in as {roleOption.label}</h1>
        <p className="mt-1 text-sm text-ink-500">Sign in to access your AI-powered customer intelligence dashboard.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        <Field label="Email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="pl-9" placeholder="you@company.com" autoComplete="email" required />
          </div>
        </Field>
        <Field label="Password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="pl-9" placeholder="••••••••" autoComplete="current-password" required />
          </div>
        </Field>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" className="rounded border-ink-300 text-brand-600 focus:ring-brand-500" defaultChecked />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
          Sign in <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50/40 p-3 text-xs text-ink-600">
        <p className="font-medium text-brand-800">{apiEnabled ? 'Workspace account:' : 'Demo accounts:'}</p>
        <ul className="mt-1 space-y-0.5 text-ink-600">
          {!apiEnabled && <li><code className="text-ink-700">{roleOption.email}</code> — {roleOption.label}</li>}
          {!apiEnabled && <li>Password: <code className="text-ink-700">demo1234</code></li>}
          {apiEnabled && <li>Use an account created for your workspace and choose its assigned role.</li>}
        </ul>
      </div>

      <p className="text-center text-sm text-ink-500">
        <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">Choose a different role</Link>
      </p>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { Field, Input } from '@/components/ui/Input'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mt-1 text-sm text-ink-500">
          We’ll email you a secure link to reset your password.
        </p>
      </div>

      {sent ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium">Reset link sent</p>
              <p className="mt-1 text-emerald-700/80">
                If <span className="font-medium">{email}</span> matches an account, you’ll receive an email shortly.
              </p>
            </div>
          </div>
          <Link to="/login" className="btn-secondary w-full justify-center">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="you@company.com" required />
            </div>
          </Field>
          <button type="submit" className="btn-primary w-full justify-center">
            Send reset link <ArrowRight className="h-4 w-4" />
          </button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-ink-600 hover:text-ink-900">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </form>
      )}
    </div>
  )
}

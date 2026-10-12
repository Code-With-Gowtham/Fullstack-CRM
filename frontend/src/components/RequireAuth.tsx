import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { Role } from '@/types'

export function RequireAuth({ children, roles }: { children: React.ReactNode; roles?: Role[] }) {
  const { user, loading, authError } = useAuth()
  const location = useLocation()
  if (loading) return <div className="p-8 text-center text-sm text-ink-500">Checking your session…</div>
  if (authError) {
    return (
      <div role="alert" className="m-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        Could not validate your session: {authError}. Check that the API is running, then reload this page.
      </div>
    )
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

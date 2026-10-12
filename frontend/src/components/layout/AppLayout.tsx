import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="flex h-full bg-ink-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
      <div className="relative hidden bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 lg:block">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative flex h-full flex-col justify-center p-12 text-white">
          <p className="text-sm font-medium uppercase tracking-wider text-white/70">AI-Powered CRM</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight">
            From customer data to the next best action — automatically.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Pulse CRM combines lead management, sentiment analysis, churn prediction, and Next-Best-Action recommendations in one platform.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
            {[
              { label: 'Churn Prediction', value: '94%' },
              { label: 'AI Recommendations', value: '12k+' },
              { label: 'Avg Response', value: '<2m' },
              { label: 'Retention Lift', value: '+38%' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

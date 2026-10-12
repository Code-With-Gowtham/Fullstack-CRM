import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GitBranch,
  MessageSquare,
  LifeBuoy,
  Sparkles,
  TrendingDown,
  Target,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
  badge?: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'sales', 'support'] },
  { to: '/customers', label: 'Customers', icon: Users, roles: ['admin', 'manager', 'sales', 'support'] },
  { to: '/leads', label: 'Leads', icon: UserPlus, roles: ['admin', 'manager', 'sales'] },
  { to: '/pipeline', label: 'Sales Pipeline', icon: GitBranch, roles: ['admin', 'manager', 'sales'] },
  { to: '/whatsapp', label: 'WhatsApp Inbox', icon: MessageSquare, roles: ['admin', 'manager', 'sales', 'support'] },
  { to: '/tickets', label: 'Support Tickets', icon: LifeBuoy, roles: ['admin', 'manager', 'support'] },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles, roles: ['admin', 'manager', 'sales', 'support'] },
  { to: '/churn', label: 'Churn Analytics', icon: TrendingDown, roles: ['admin', 'manager', 'sales'] },
  { to: '/next-best-action', label: 'Next-Best-Action', icon: Target, roles: ['admin', 'manager', 'sales'], badge: 'AI' },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager'] },
  { to: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'manager', 'sales', 'support'] },
  { to: '/users', label: 'User Management', icon: ShieldCheck, roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'manager', 'sales', 'support'] },
]

export function Sidebar() {
  const { user } = useAuth()
  if (!user) return null
  const visible = navItems.filter((n) => n.roles.includes(user.role))

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-ink-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-ink-900">Pulse CRM</p>
          <p className="text-[11px] uppercase tracking-wider text-ink-500">AI Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Main</p>
        <div className="space-y-0.5">
          {visible.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-gradient-to-r from-violet-500 to-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-ink-100 p-3">
        <div className="rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 p-4 text-white">
          <p className="text-sm font-semibold">AI Engine Active</p>
          <p className="mt-1 text-xs text-white/80">
            {visible.find((i) => i.badge === 'AI')?.label ?? 'AI features'} are live. Review recommendations daily.
          </p>
        </div>
      </div>
    </aside>
  )
}

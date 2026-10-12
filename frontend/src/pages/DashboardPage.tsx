import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  Users,
  UserPlus,
  Target,
  TrendingUp,
  AlertTriangle,
  LifeBuoy,
  Bell,
  Sparkles,
  Calendar,
  ArrowRight,
  Crown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { StatTile, Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import {
  kpis,
  customers,
  recommendations,
  notifications,
  revenueTrend,
  churnRiskDistribution,
  sentimentDistribution,
} from '@/mock/data'
import { formatCurrency, formatNumber, cn } from '@/lib/utils'

const roleGreetings: Record<string, string> = {
  admin: "Here's the company-wide pulse today.",
  manager: "Here's how your sales team is performing.",
  sales: "Here are your customers and leads today.",
  support: "Here are the conversations and tickets needing you.",
}

export function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null
  const greeting = `${user.name.split(' ')[0]}, ${roleGreetings[user.role]}`

  const recentRecommendations = recommendations.slice(0, 4)
  const upcomingFollowUps = customers.slice(0, 4)
  const unreadNotifications = notifications.filter((n) => !n.read).slice(0, 3)

  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting}
        description={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`}
        action={
          <Link to="/ai-insights" className="btn-primary">
            <Sparkles className="h-4 w-4" /> View AI insights
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Customers" value={formatNumber(kpis.totalCustomers)} hint={`+${kpis.newCustomers} new this month`} icon={<Users className="h-5 w-5" />} />
        <StatTile label="Active Leads" value={formatNumber(kpis.totalLeads)} hint={`${kpis.qualifiedLeads} qualified`} icon={<UserPlus className="h-5 w-5" />} tone="success" />
        <StatTile label="Revenue (MTD)" value={formatCurrency(kpis.revenue)} hint="+12.4% vs last month" icon={<TrendingUp className="h-5 w-5" />} tone="violet" />
        <StatTile label="High Churn Risk" value={kpis.highChurnRisk} hint="Customers needing attention" icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatTile label="Conversion Rate" value={`${kpis.conversionRate}%`} hint="Across all sources" icon={<Target className="h-5 w-5" />} tone="warning" />
        <StatTile label="Open Tickets" value={kpis.openTickets} hint={`${kpis.pendingFollowUps} follow-ups pending`} icon={<LifeBuoy className="h-5 w-5" />} />
        <StatTile label="AI Recommendations" value={kpis.aiRecommendations} hint="Pending approval" icon={<Sparkles className="h-5 w-5" />} tone="brand" />
        <StatTile label="Notifications" value={notifications.filter((n) => !n.read).length} hint="Unread" icon={<Bell className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue trend" description="Actual vs target over the last 8 months" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tgt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => formatCurrency(v as number)} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="target" stroke="#a78bfa" fill="url(#tgt)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Churn risk distribution" description="Breakdown of customers by risk level" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={churnRiskDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {churnRiskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="AI-recommended next actions"
            description="Customers where AI suggests the next best action"
            action={
              <Link to="/next-best-action" className="text-sm font-medium text-brand-700 hover:text-brand-800">
                View all <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody className="space-y-3">
            {recentRecommendations.map((r) => {
              const customer = customers.find((c) => c.id === r.customerId)!
              return (
                <Link
                  to={`/customers/${customer.id}`}
                  key={r.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-ink-100 p-3 transition-colors hover:bg-ink-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} color="bg-brand-500" />
                    <div>
                      <p className="text-sm font-medium text-ink-900">{customer.company}</p>
                      <p className="text-xs text-ink-500">{customer.name} • {r.recommendedAction}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={r.confidence >= 75 ? 'success' : 'warning'} className="font-mono">
                      {r.confidence}% confidence
                    </Badge>
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              )
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sentiment breakdown" description="Across all customer channels" />
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sentimentDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#94a3b8" />
                  <Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <Link to="/whatsapp" className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2 text-sm hover:bg-ink-50">
                <span className="flex items-center gap-2 text-ink-700"><Crown className="h-4 w-4 text-brand-600" /> Hot lead from WhatsApp</span>
                <ArrowRight className="h-4 w-4 text-ink-400" />
              </Link>
              <Link to="/churn" className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2 text-sm hover:bg-ink-50">
                <span className="flex items-center gap-2 text-ink-700"><AlertTriangle className="h-4 w-4 text-rose-600" /> 4 customers at high churn risk</span>
                <ArrowRight className="h-4 w-4 text-ink-400" />
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Upcoming follow-ups" description="Customers scheduled for today" />
          <CardBody className="space-y-3">
            {upcomingFollowUps.map((c) => (
              <Link
                to={`/customers/${c.id}`}
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-ink-100 p-3 hover:bg-ink-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} color="bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">{c.company}</p>
                    <p className="text-xs text-ink-500">{c.name} • {c.value} value</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {c.nextFollowUpAt}
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent notifications" description="Updates you should know about" />
          <CardBody className="space-y-3">
            {unreadNotifications.map((n) => (
              <Link
                to={n.link ?? '#'}
                key={n.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                  'border-ink-100 hover:bg-ink-50',
                )}
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-900">{n.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{n.body}</p>
                  <p className="mt-1 text-[11px] text-ink-400">{n.createdAt}</p>
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

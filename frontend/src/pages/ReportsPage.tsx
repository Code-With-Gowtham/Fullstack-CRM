import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts'
import { Download, Calendar, Trophy, FileText } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatTile, Card, CardHeader, CardBody } from '@/components/ui/Card'
import {
  revenueTrend,
  leadSourceDistribution,
  salespersonPerformance,
  customerGrowth,
  leads,
} from '@/mock/data'
import { formatCurrency } from '@/lib/utils'

const funnelData = [
  { name: 'Visitors', value: 4200 },
  { name: 'Leads', value: leads.length * 8 },
  { name: 'Qualified', value: 160 },
  { name: 'Proposal', value: 90 },
  { name: 'Negotiation', value: 50 },
  { name: 'Won', value: 24 },
]

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive business performance and AI effectiveness"
        action={
          <>
            <button className="btn-secondary"><Calendar className="h-4 w-4" /> This month</button>
            <button className="btn-primary"><Download className="h-4 w-4" /> Export PDF</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Revenue (MTD)" value="₹7.1L" hint="+12.4% MoM" icon={<Trophy className="h-5 w-5" />} tone="success" />
        <StatTile label="New customers" value="12" hint="This month" icon={<Trophy className="h-5 w-5" />} tone="brand" />
        <StatTile label="Conversion rate" value="32%" hint="+4pts vs last month" icon={<Trophy className="h-5 w-5" />} tone="violet" />
        <StatTile label="AI accuracy" value="94%" hint="Churn prediction" icon={<Trophy className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Revenue vs target" description="Monthly performance" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="r2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="t2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => formatCurrency(v as number)} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="target" name="Target" stroke="#a78bfa" fill="url(#t2)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#r2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Lead funnel" description="From visitor to closed-won" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <FunnelChart>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList position="right" fill="#475569" stroke="none" dataKey="name" fontSize={12} />
                  <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={13} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Salesperson performance" description="Leads vs conversions per team member" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salespersonPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="leads" name="Leads" fill="#bfdbfe" radius={[6, 6, 0, 0]} />
                <Bar dataKey="converted" name="Converted" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Lead sources" description="Where your leads come from" />
          <CardBody className="space-y-3">
            {leadSourceDistribution.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{s.name}</span>
                  <span className="font-mono text-ink-500">{s.value}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${s.value * 2.5}%` }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Customer growth" description="New vs churned over time" />
        <CardBody>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="new" name="New" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="churned" name="Churned" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Available report exports" description="Schedule or download detailed reports" />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Weekly executive summary', desc: 'KPIs + AI insights' },
            { name: 'Sales performance', desc: 'By rep, region, source' },
            { name: 'Customer churn analysis', desc: 'Drivers and predictions' },
            { name: 'AI action effectiveness', desc: 'Closed-loop outcomes' },
            { name: 'Lead funnel', desc: 'Conversion by stage' },
            { name: 'Customer sentiment', desc: 'Trend across channels' },
          ].map((r) => (
            <button key={r.name} className="flex items-start gap-3 rounded-lg border border-ink-100 p-3 text-left hover:bg-ink-50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-900">{r.name}</p>
                <p className="text-xs text-ink-500">{r.desc}</p>
              </div>
              <Download className="h-4 w-4 text-ink-400" />
            </button>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Link } from 'react-router-dom'
import { TrendingDown, AlertTriangle, ArrowRight, Mail, Phone, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatTile, Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { customers, churnPredictions, churnRiskDistribution } from '@/mock/data'

export function ChurnPage() {
  const highRisk = customers.filter((c) => c.churnRisk === 'High')
  const mediumRisk = customers.filter((c) => c.churnRisk === 'Medium')

  const avgProbability = Math.round(customers.reduce((s, c) => s + c.churnProbability, 0) / customers.length)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Churn Analytics"
        description="Identify customers at risk of leaving before it's too late"
        action={
          <Link to="/next-best-action" className="btn-primary">
            <Sparkles className="h-4 w-4" /> Get AI recommendations
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="High-risk customers" value={highRisk.length} hint="Immediate attention" icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatTile label="Medium risk" value={mediumRisk.length} hint="Monitor closely" icon={<TrendingDown className="h-5 w-5" />} tone="warning" />
        <StatTile label="Avg churn probability" value={`${avgProbability}%`} hint="Across all customers" icon={<TrendingDown className="h-5 w-5" />} />
        <StatTile label="Predicted at-risk revenue" value={`₹${(highRisk.reduce((s, c) => s + c.totalRevenue, 0) / 100000).toFixed(1)}L`} hint="If churn occurs" icon={<TrendingDown className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Risk distribution" description="Across the customer base" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={churnRiskDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
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

        <Card className="lg:col-span-2">
          <CardHeader title="Top churn factors" description="Aggregate SHAP values across all customers" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[
                  { factor: 'Reduced purchase frequency', impact: 32 },
                  { factor: 'Negative sentiment', impact: 26 },
                  { factor: 'Unresolved complaints', impact: 19 },
                  { factor: 'Long time since purchase', impact: 15 },
                  { factor: 'Low engagement', impact: 12 },
                  { factor: 'Product usage decline', impact: 9 },
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="factor" stroke="#94a3b8" fontSize={12} width={180} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="impact" fill="#ef4444" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="High-risk customers"
          description="Customers most likely to churn — act today"
          action={
            <button className="btn-secondary">
              Export list <ArrowRight className="h-4 w-4" />
            </button>
          }
        />
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Probability</th>
                <th className="px-3 py-2">Top factor</th>
                <th className="px-3 py-2">Sentiment</th>
                <th className="px-3 py-2">Value at risk</th>
                <th className="px-3 py-2">Assigned</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {highRisk.slice(0, 8).map((c) => {
                const pred = churnPredictions.find((p) => p.customerId === c.id)!
                return (
                  <tr key={c.id} className="hover:bg-ink-50/60">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm" color="bg-rose-500" />
                        <div>
                          <p className="font-medium">{c.company}</p>
                          <p className="text-xs text-ink-500">{c.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-rose-600">{c.churnProbability}%</span>
                        <StatusBadge status={c.churnRisk} />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-ink-700">{pred.factors[0].feature}</td>
                    <td className="px-3 py-3"><StatusBadge status={c.sentiment} /></td>
                    <td className="px-3 py-3 font-medium">₹{(c.totalRevenue / 100000).toFixed(1)}L</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.assignedTo} size="sm" />
                        <span className="text-xs">{c.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100" title="Call"><Phone className="h-4 w-4" /></button>
                        <button className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100" title="Email"><Mail className="h-4 w-4" /></button>
                        <Link to={`/customers/${c.id}`} className="btn-secondary text-xs">View</Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}

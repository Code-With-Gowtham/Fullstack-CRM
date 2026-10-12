import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ArrowRight, Plus, Filter } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { pipeline, leads } from '@/mock/data'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Select } from '@/components/ui/Input'

const stageColors = ['bg-brand-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-amber-500', 'bg-orange-500', 'bg-emerald-500']

export function PipelinePage() {
  const stageChartData = pipeline.map((p) => ({ stage: p.stage, count: p.count }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Pipeline"
        description="Visualize deals as they move through your funnel"
        action={
          <>
            <Select className="w-36">
              <option>All teams</option>
              <option>Sales</option>
              <option>Enterprise</option>
            </Select>
            <button className="btn-primary"><Plus className="h-4 w-4" /> New opportunity</button>
          </>
        }
      />

      <div className="grid gap-3 overflow-x-auto pb-2 md:grid-cols-6">
        {pipeline.map((s, i) => (
          <div key={s.stage} className="rounded-xl bg-white border border-ink-200 shadow-card min-w-[180px]">
            <div className={cn('rounded-t-xl p-3 text-white', stageColors[i])}>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider opacity-80">{s.stage}</p>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">{s.count}</span>
              </div>
              <p className="mt-2 text-lg font-semibold">{formatCurrency(s.value)}</p>
              <p className="text-xs opacity-80">{s.conversionRate}% to next stage</p>
            </div>
            <div className="space-y-2 p-2">
              {leads.filter((l) => l.status === s.stage).slice(0, 4).map((l) => (
                <div key={l.id} className="rounded-lg border border-ink-100 p-2 hover:bg-ink-50">
                  <p className="text-sm font-medium text-ink-900">{l.company}</p>
                  <p className="text-xs text-ink-500">{formatCurrency(l.expectedRevenue)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Avatar name={l.assignedTo} size="sm" />
                    <StatusBadge status={l.temperature} />
                  </div>
                </div>
              ))}
            </div>
            {i < pipeline.length - 1 && (
              <div className="-mx-3 mb-2 hidden items-center justify-center text-ink-300 md:flex">
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Leads per stage" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stageChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stageChartData.map((_, i) => (
                    <rect key={i} fill={['#2563eb', '#8b5cf6', '#d946ef', '#f59e0b', '#f97316', '#10b981'][i % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Pipeline metrics" />
          <CardBody className="space-y-3">
            {[
              { label: 'Total opportunities', value: pipeline.reduce((s, p) => s + p.count, 0) },
              { label: 'Total value', value: formatCurrency(pipeline.reduce((s, p) => s + p.value, 0)) },
              { label: 'Avg conversion time', value: '12 days' },
              { label: 'Win rate', value: '24%' },
              { label: 'Lost opportunities', value: leads.filter((l) => l.status === 'Lost').length },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-0 last:pb-0">
                <span className="text-sm text-ink-600">{m.label}</span>
                <span className="font-medium">{m.value}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

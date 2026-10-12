import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { CheckCircle2, XCircle, Sparkles, Target, Clock, Edit3, ArrowRight, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatTile, Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Field, Textarea, Select } from '@/components/ui/Input'
import { recommendations, customers, actionEffectiveness } from '@/mock/data'
import { formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types'

export function NextBestActionPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'executed'>('all')
  const [selected, setSelected] = useState<Recommendation | null>(null)

  const filtered = recommendations.filter((r) => {
    if (filter === 'all') return true
    if (filter === 'pending') return r.status === 'Pending'
    if (filter === 'approved') return r.status === 'Approved'
    if (filter === 'executed') return r.status === 'Executed'
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Next-Best-Action"
        description="AI-recommended actions with confidence scores and reasoning"
        action={
          <div className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
            <Sparkles className="h-3.5 w-3.5" /> {recommendations.length} recommendations • {recommendations.filter((r) => r.status === 'Pending').length} need your review
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total recommendations" value={recommendations.length} icon={<Target className="h-5 w-5" />} tone="violet" />
        <StatTile label="Pending review" value={recommendations.filter((r) => r.status === 'Pending').length} hint="Awaiting your approval" icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatTile label="Approved this week" value={recommendations.filter((r) => r.status === 'Approved' || r.status === 'Executed').length} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatTile label="Avg confidence" value={`${Math.round(recommendations.reduce((s, r) => s + r.confidence, 0) / recommendations.length)}%`} icon={<Sparkles className="h-5 w-5" />} tone="brand" />
      </div>

      <Card>
        <CardHeader
          title="Action effectiveness"
          description="Which actions are working best across your customer base"
        />
        <CardBody>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={actionEffectiveness} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <YAxis type="category" dataKey="action" stroke="#94a3b8" fontSize={12} width={120} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="successRate" radius={[0, 6, 6, 0]}>
                {actionEffectiveness.map((e, i) => (
                  <rect key={i} fill={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#94a3b8'][i % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-3">
          <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="w-40">
            <option value="all">All recommendations</option>
            <option value="pending">Pending review</option>
            <option value="approved">Approved</option>
            <option value="executed">Executed</option>
          </Select>
          <span className="text-xs text-ink-500">{filtered.length} results</span>
        </div>

        <div className="divide-y divide-ink-100">
          {filtered.map((r) => {
            const customer = customers.find((c) => c.id === r.customerId)!
            return (
              <div key={r.id} className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-brand-600 text-white">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/customers/${customer.id}`} className="text-sm font-semibold text-ink-900 hover:text-brand-700">{customer.company}</Link>
                        <StatusBadge status={customer.churnRisk} />
                        <StatusBadge status={customer.sentiment} />
                      </div>
                      <p className="mt-1 text-sm text-ink-700">
                        Recommended: <span className="font-medium">{r.recommendedAction}</span>
                      </p>
                      <p className="mt-1.5 max-w-2xl text-sm text-ink-600">{r.reason}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Badge tone={r.confidence >= 80 ? 'success' : r.confidence >= 65 ? 'warning' : 'neutral'} className="font-mono">
                        <Sparkles className="h-3 w-3" /> {r.confidence}% confidence
                      </Badge>
                      <StatusBadge status={r.status} />
                    </div>
                    <span className="text-xs text-ink-500">Generated {r.generatedAt}</span>
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(r)} className="btn-secondary"><Edit3 className="h-3.5 w-3.5" /> Review</button>
                      <button className="btn-primary"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-5">
                  {r.alternatives.map((a, i) => (
                    <div
                      key={a.action}
                      className={cn(
                        'rounded-lg border p-3',
                        i === 0 ? 'border-brand-200 bg-brand-50/40' : 'border-ink-100',
                      )}
                    >
                      <p className="text-xs font-medium text-ink-700">{a.action}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-semibold">{a.score}%</span>
                        {i === 0 && <Badge tone="brand" className="text-[10px]">Top</Badge>}
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                        <div className={cn('h-full rounded-full', i === 0 ? 'bg-brand-500' : 'bg-ink-400')} style={{ width: `${a.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Review recommendation"
        description={selected ? customers.find((c) => c.id === selected.customerId)?.company : ''}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 p-4 text-white">
              <p className="text-xs uppercase tracking-wider text-white/80">Recommended action</p>
              <p className="mt-1 text-lg font-semibold">{selected.recommendedAction}</p>
              <p className="mt-1 text-sm text-white/80">Confidence: {selected.confidence}%</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Why this action?</p>
              <p className="mt-1 text-sm text-ink-700">{selected.reason}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Modify action (optional)</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Field label="Action type">
                  <Select>
                    <option>{selected.recommendedAction}</option>
                    <option>Premium Support</option>
                    <option>Product Upgrade</option>
                    <option>Discount</option>
                    <option>Personalized Follow-up</option>
                  </Select>
                </Field>
                <Field label="Assigned to">
                  <Select>
                    <option>Raja Muthu</option>
                    <option>Ram Kumar</option>
                  </Select>
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Notes for the assignee">
                  <Textarea placeholder="Add any specific instructions..." />
                </Field>
              </div>
            </div>

            <div className="flex justify-between gap-2 border-t border-ink-100 pt-4">
              <button className="btn-ghost text-rose-600"><XCircle className="h-4 w-4" /> Reject</button>
              <div className="flex gap-2">
                <button className="btn-secondary"><Edit3 className="h-4 w-4" /> Save draft</button>
                <button className="btn-primary"><CheckCircle2 className="h-4 w-4" /> Approve & execute</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

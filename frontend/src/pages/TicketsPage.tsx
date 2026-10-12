import { useState } from 'react'
import { Plus, Filter, MoreHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Select, Input } from '@/components/ui/Input'
import { tickets, customers, users } from '@/mock/data'
import { cn } from '@/lib/utils'

export function TicketsPage() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description={`${tickets.length} tickets • ${tickets.filter((t) => t.priority === 'Urgent' || t.priority === 'High').length} high priority`}
        action={<button className="btn-primary"><Plus className="h-4 w-4" /> New ticket</button>}
      />

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Open', value: tickets.filter((t) => t.status === 'Open').length, tone: 'bg-sky-50 text-sky-700' },
          { label: 'In Progress', value: tickets.filter((t) => t.status === 'In Progress').length, tone: 'bg-brand-50 text-brand-700' },
          { label: 'Waiting', value: tickets.filter((t) => t.status === 'Waiting').length, tone: 'bg-amber-50 text-amber-700' },
          { label: 'Resolved', value: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length, tone: 'bg-emerald-50 text-emerald-700' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody>
              <p className="text-sm text-ink-500">{s.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{s.value}</p>
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', s.tone)}>{Math.round((s.value / tickets.length) * 100)}%</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-3">
          <Filter className="h-4 w-4 text-ink-500" />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-40">
            <option value="all">All tickets</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting">Waiting</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </Select>
          <Select className="w-40">
            <option>All priorities</option>
            <option>Urgent</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </Select>
          <div className="flex-1" />
          <Input className="max-w-xs" placeholder="Search tickets" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-5 py-3">Ticket</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Sentiment</th>
                <th className="px-5 py-3">Assigned</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((t) => {
                const customer = customers.find((c) => c.id === t.customerId)!
                const agent = users.find((u) => u.name === t.assignedAgent)
                return (
                  <tr key={t.id} className="hover:bg-ink-50/60">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink-900">{t.subject}</p>
                      <p className="text-xs text-ink-500">{t.id} • {t.description.slice(0, 40)}…</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={customer.name} size="sm" />
                        <span className="text-xs">{customer.company}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warning' : 'neutral'}>{t.priority}</Badge>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3"><StatusBadge status={t.sentiment} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {agent && <Avatar name={agent.name} size="sm" color={agent.avatarColor} />}
                        <span className="text-xs">{t.assignedAgent}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-500">{t.createdAt}</td>
                    <td className="px-5 py-3 text-right">
                      <button className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Search, Edit3, MoreHorizontal, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Input'
import { users, permissions } from '@/mock/data'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

const roleLabels: Record<Role, string> = {
  admin: 'Administrator',
  manager: 'Sales Manager',
  sales: 'Sales Executive',
  support: 'Support Agent',
}

export function UsersPage() {
  const [tab, setTab] = useState<'users' | 'roles'>('users')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<'all' | Role>('all')
  const [openInvite, setOpenInvite] = useState(false)

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase())
    const matchRole = role === 'all' || u.role === role
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage team members, roles, and permissions"
        action={
          <button onClick={() => setOpenInvite(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Invite user
          </button>
        }
      />

      <div className="flex border-b border-ink-200">
        {[
          { key: 'users' as const, label: 'Users' },
          { key: 'roles' as const, label: 'Roles & Permissions' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium',
              tab === t.key ? 'text-brand-700' : 'text-ink-600 hover:text-ink-900',
            )}
          >
            {t.label}
            {tab === t.key && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-600" />}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <Card>
          <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <Input className="pl-9" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="w-40">
              <option value="all">All roles</option>
              {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-ink-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} color={u.avatarColor} />
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-ink-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge tone="brand">{roleLabels[u.role]}</Badge></td>
                    <td className="px-5 py-3">{u.department}</td>
                    <td className="px-5 py-3"><StatusBadge status={u.status === 'active' ? 'Open' : 'Closed'} /></td>
                    <td className="px-5 py-3 text-ink-500">{u.joinedAt}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"><Edit3 className="h-4 w-4" /></button>
                        <button className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"><MoreHorizontal className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'roles' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeaderForRoles />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-5 py-3">Permission</th>
                    {Object.entries(roleLabels).map(([k, v]) => (
                      <th key={k} className="px-3 py-3 text-center">{v}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {permissions.map((p) => (
                    <tr key={p.key}>
                      <td className="px-5 py-3 text-ink-700">{p.label}</td>
                      {(['admin', 'manager', 'sales', 'support'] as Role[]).map((r) => (
                        <td key={r} className="px-3 py-3 text-center">
                          {p.roles[r] ? (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <ShieldCheck className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-4">
            {(Object.entries(roleLabels) as [Role, string][]).map(([r, label]) => (
              <Card key={r}>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-ink-500">{users.filter((u) => u.role === r).length} users</p>
                    </div>
                    <Badge tone="brand">{permissions.filter((p) => p.roles[r]).length} permissions</Badge>
                  </div>
                  <p className="mt-3 text-sm text-ink-600">
                    {r === 'admin' && 'Full access to all system features including user management and AI configuration.'}
                    {r === 'manager' && 'Access to team performance, analytics, lead assignment, and AI insights.'}
                    {r === 'sales' && 'Manage assigned leads and customers, view churn risk, and act on AI recommendations.'}
                    {r === 'support' && 'Handle customer conversations, create tickets, and use AI reply generation.'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal open={openInvite} onClose={() => setOpenInvite(false)} title="Invite a new user" size="md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setOpenInvite(false) }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name"><Input placeholder="Jane Doe" required /></Field>
            <Field label="Email"><Input type="email" placeholder="jane@company.com" required /></Field>
          </div>
          <Field label="Role">
            <Select>
              {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Department"><Input placeholder="Sales" /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpenInvite(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> Send invite</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function CardHeaderForRoles() {
  return (
    <div className="border-b border-ink-100 px-5 py-4">
      <h3 className="text-base font-semibold">Permission matrix</h3>
      <p className="mt-0.5 text-sm text-ink-500">What each role can do in the system</p>
    </div>
  )
}

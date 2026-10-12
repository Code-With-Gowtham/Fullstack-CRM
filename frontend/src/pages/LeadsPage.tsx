import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Download, Filter, ChevronRight, Flame, Thermometer, Snowflake } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Field, Input, Select } from '@/components/ui/Input'
import { leads as demoLeads } from '@/mock/data'
import { formatCurrency } from '@/lib/utils'
import { apiCreateLead, apiEnabled, apiListLeads } from '@/lib/api'
import type { Lead, LeadStatus } from '@/types'

const statusOptions: (LeadStatus | 'All')[] = ['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Converted', 'Lost']

const tempIcon = {
  Hot: <Flame className="h-3.5 w-3.5" />,
  Warm: <Thermometer className="h-3.5 w-3.5" />,
  Cold: <Snowflake className="h-3.5 w-3.5" />,
}

const tempTone = {
  Hot: 'text-rose-600 bg-rose-50',
  Warm: 'text-amber-600 bg-amber-50',
  Cold: 'text-sky-600 bg-sky-50',
} as const

export function LeadsPage() {
  const [leads, setLeads] = useState(apiEnabled ? [] : demoLeads)
  const [loading, setLoading] = useState(apiEnabled)
  const [loadError, setLoadError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [newLead, setNewLead] = useState({ name: '', email: '', company: '' })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LeadStatus | 'All'>('All')
  const [temp, setTemp] = useState<Lead['temperature'] | 'All'>('All')

  useEffect(() => {
    if (!apiEnabled) return
    let active = true
    apiListLeads()
      .then((records) => {
        if (active) setLeads(records)
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load leads.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const s = search.toLowerCase()
      const matchSearch = !s || l.name.toLowerCase().includes(s) || l.company.toLowerCase().includes(s)
      const matchStatus = status === 'All' || l.status === status
      const matchTemp = temp === 'All' || l.temperature === temp
      return matchSearch && matchStatus && matchTemp
    })
  }, [leads, search, status, temp])

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const created = await apiCreateLead(newLead)
      setLeads((current) => [created, ...current])
      setNewLead({ name: '', email: '', company: '' })
      setShowCreate(false)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save this lead.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={`${filtered.length} of ${leads.length} leads • ${leads.filter((l) => l.temperature === 'Hot').length} hot`}
        action={
          <>
            <button className="btn-secondary"><Download className="h-4 w-4" /> Export</button>
            <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={!apiEnabled} onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> Add lead</button>
          </>
        }
      />

      {loadError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</p>}
      {loading && <p role="status" className="text-sm text-ink-500">Loading leads…</p>}

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-5 py-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input placeholder="Search leads" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Filter className="h-4 w-4 text-ink-500" />
          <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-40">
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={temp} onChange={(e) => setTemp(e.target.value as typeof temp)} className="w-32">
            <option value="All">All temps</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Expected</th>
                <th className="px-5 py-3">Assigned</th>
                <th className="px-5 py-3">Last contact</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-ink-50/60">
                  <td className="px-5 py-3">
                    <Link to={`/leads/${l.id}`} className="block">
                      <p className="font-medium text-ink-900">{l.name}</p>
                      <p className="text-xs text-ink-500">{l.company} • {l.industry}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tempTone[l.temperature]}`}>
                        {tempIcon[l.temperature]} {l.temperature}
                      </span>
                      <span className="text-xs text-ink-500">{l.score}/100</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-700">{l.source}</td>
                  <td className="px-5 py-3 font-medium">{formatCurrency(l.expectedRevenue)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={l.assignedTo} size="sm" />
                      <span className="text-xs">{l.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-500">{l.lastContactedAt}</td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/leads/${l.id}`} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add lead" description="Create a lead in your workspace.">
        <form onSubmit={submitLead} className="space-y-4">
          {formError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formError}</p>}
          <Field label="Lead name"><Input value={newLead.name} onChange={(event) => setNewLead({ ...newLead, name: event.target.value })} required maxLength={120} /></Field>
          <Field label="Email"><Input type="email" value={newLead.email} onChange={(event) => setNewLead({ ...newLead, email: event.target.value })} required maxLength={254} /></Field>
          <Field label="Company"><Input value={newLead.company} onChange={(event) => setNewLead({ ...newLead, company: event.target.value })} required maxLength={160} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Create lead'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

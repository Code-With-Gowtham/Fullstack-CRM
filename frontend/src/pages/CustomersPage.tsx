import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Download, Plus, Users, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Field, Input, Select } from '@/components/ui/Input'
import { customers as demoCustomers } from '@/mock/data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { apiCreateCustomer, apiEnabled, apiListCustomers } from '@/lib/api'
import type { Customer } from '@/types'

export function CustomersPage() {
  const [customers, setCustomers] = useState(apiEnabled ? [] : demoCustomers)
  const [loading, setLoading] = useState(apiEnabled)
  const [loadError, setLoadError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [risk, setRisk] = useState<'all' | Customer['churnRisk']>('all')
  const [value, setValue] = useState<'all' | Customer['value']>('all')
  const [sentiment, setSentiment] = useState<'all' | Customer['sentiment']>('all')
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', company: '', phone: '' })

  useEffect(() => {
    if (!apiEnabled) return
    let active = true
    apiListCustomers()
      .then((records) => {
        if (active) setCustomers(records)
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load customers.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      const matchRisk = risk === 'all' || c.churnRisk === risk
      const matchValue = value === 'all' || c.value === value
      const matchSentiment = sentiment === 'all' || c.sentiment === sentiment
      return matchSearch && matchRisk && matchValue && matchSentiment
    })
  }, [customers, search, risk, value, sentiment])

  const submitCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const created = await apiCreateCustomer(newCustomer)
      setCustomers((current) => [created, ...current])
      setNewCustomer({ name: '', email: '', company: '', phone: '' })
      setShowCreate(false)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save this customer.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${filtered.length} of ${customers.length} customers`}
        action={
          <>
            <button className="btn-secondary">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={!apiEnabled} onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> Add customer
            </button>
          </>
        }
      />

      {loadError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</p>}
      {loading && <p role="status" className="text-sm text-ink-500">Loading customers…</p>}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-5 py-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              placeholder="Search by name, company, or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-500" />
            <Select value={risk} onChange={(e) => setRisk(e.target.value as typeof risk)} className="w-36">
              <option value="all">All risks</option>
              <option value="High">High risk</option>
              <option value="Medium">Medium risk</option>
              <option value="Low">Low risk</option>
            </Select>
            <Select value={value} onChange={(e) => setValue(e.target.value as typeof value)} className="w-32">
              <option value="all">All values</option>
              <option value="High">High value</option>
              <option value="Medium">Medium value</option>
              <option value="Low">Low value</option>
            </Select>
            <Select value={sentiment} onChange={(e) => setSentiment(e.target.value as typeof sentiment)} className="w-36">
              <option value="all">All sentiment</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Sentiment</th>
                <th className="px-5 py-3">Churn risk</th>
                <th className="px-5 py-3">Revenue</th>
                <th className="px-5 py-3">Assigned</th>
                <th className="px-5 py-3">Last interaction</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-ink-50/60">
                  <td className="px-5 py-3">
                    <Link to={`/customers/${c.id}`} className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <div>
                        <p className="font-medium text-ink-900">{c.company}</p>
                        <p className="text-xs text-ink-500">{c.name} • {c.location}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={c.value} /></td>
                  <td className="px-5 py-3"><StatusBadge status={c.sentiment} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.churnRisk} />
                      <span className="text-xs text-ink-500">{c.churnProbability}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">{formatCurrency(c.totalRevenue)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.assignedTo} size="sm" />
                      <span className="text-xs">{c.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-500">{c.lastInteractionAt}</td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/customers/${c.id}`} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-8 w-8 text-ink-400" />
            <p className="mt-2 text-sm font-medium text-ink-700">No customers match your filters</p>
            <p className="mt-1 text-xs text-ink-500">Try clearing the search or changing the filters above.</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-xs text-ink-500">
          <span>Showing {filtered.length} of {formatNumber(customers.length)} customers</span>
          <div className="flex items-center gap-1">
            <button className="rounded-md px-2 py-1 hover:bg-ink-100">Previous</button>
            <span className="px-2">Page 1 of 1</span>
            <button className="rounded-md px-2 py-1 hover:bg-ink-100">Next</button>
          </div>
        </div>
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add customer" description="Create a customer in your workspace.">
        <form onSubmit={submitCustomer} className="space-y-4">
          {formError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formError}</p>}
          <Field label="Customer name"><Input value={newCustomer.name} onChange={(event) => setNewCustomer({ ...newCustomer, name: event.target.value })} required maxLength={120} /></Field>
          <Field label="Email"><Input type="email" value={newCustomer.email} onChange={(event) => setNewCustomer({ ...newCustomer, email: event.target.value })} required maxLength={254} /></Field>
          <Field label="Company"><Input value={newCustomer.company} onChange={(event) => setNewCustomer({ ...newCustomer, company: event.target.value })} required maxLength={160} /></Field>
          <Field label="Phone"><Input value={newCustomer.phone} onChange={(event) => setNewCustomer({ ...newCustomer, phone: event.target.value })} maxLength={40} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Create customer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

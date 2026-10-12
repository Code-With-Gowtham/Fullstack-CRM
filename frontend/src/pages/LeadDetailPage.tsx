import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, Building2, MapPin, Calendar, Sparkles, MessageSquare, PhoneCall, Edit3, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader, CardBody, StatTile } from '@/components/ui/Card'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select } from '@/components/ui/Input'
import { useEffect, useState } from 'react'
import { leads as demoLeads } from '@/mock/data'
import { formatCurrency } from '@/lib/utils'
import { apiDeleteLead, apiEnabled, apiGetLead, apiUpdateLead } from '@/lib/api'
import type { Lead, LeadStatus } from '@/types'

export function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | undefined>(() => apiEnabled ? undefined : demoLeads.find((l) => l.id === id))
  const [loading, setLoading] = useState(apiEnabled)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState<{ name: string; email: string; company: string; phone: string; status: LeadStatus; score: number }>({
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'New',
    score: 50,
  })
  const [tab, setTab] = useState('activity')

  useEffect(() => {
    if (!apiEnabled || !id) return
    let active = true
    apiGetLead(id)
      .then((record) => {
        if (active) setLead(record)
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load this lead.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const saveLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!lead) return
    setActionError('')
    setSaving(true)
    try {
      setLead(await apiUpdateLead(lead.id, editForm))
      setShowEditModal(false)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update this lead.')
    } finally {
      setSaving(false)
    }
  }

  const deleteLead = async () => {
    if (!lead) return
    setActionError('')
    setSaving(true)
    try {
      await apiDeleteLead(lead.id)
      navigate('/leads', { replace: true })
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete this lead.')
      setShowDeleteModal(false)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p role="status" className="text-sm text-ink-500">Loading lead…</p>
  if (loadError) return <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{loadError}</p>
  if (!lead) return <div className="text-center text-ink-500">Lead not found.</div>

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </button>
      {actionError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{actionError}</p>}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-emerald-50 via-white to-brand-50 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={lead.name} size="lg" className="h-14 w-14 text-lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{lead.name}</h2>
                <StatusBadge status={lead.status} />
                <Badge tone={lead.temperature === 'Hot' ? 'danger' : lead.temperature === 'Warm' ? 'warning' : 'info'}>{lead.temperature}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-600">{lead.company} • {lead.industry} • {lead.location}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-600">
                <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-ink-400" /> {lead.email}</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 text-ink-400" /> {lead.phone}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-ink-400" /> {lead.location}</span>
                <span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4 text-ink-400" /> {lead.source}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button disabled={!apiEnabled} onClick={() => { setEditForm({ name: lead.name, email: lead.email, company: lead.company, phone: lead.phone, status: lead.status, score: lead.score }); setShowEditModal(true) }} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"><Edit3 className="h-4 w-4" /> Edit</button>
            <button disabled={!apiEnabled} onClick={() => setShowDeleteModal(true)} className="btn-secondary text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"><Trash2 className="h-4 w-4" /> Delete</button>
            <button className="btn-secondary"><PhoneCall className="h-4 w-4" /> Call</button>
            <button className="btn-secondary"><MessageSquare className="h-4 w-4" /> WhatsApp</button>
            <button className="btn-primary"><Sparkles className="h-4 w-4" /> Convert</button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Lead Score" value={`${lead.score}/100`} hint="Based on engagement & fit" icon={<Sparkles className="h-5 w-5" />} tone="violet" />
        <StatTile label="Expected Revenue" value={formatCurrency(lead.expectedRevenue)} hint="From opportunity" icon={<Building2 className="h-5 w-5" />} />
        <StatTile label="Created" value={lead.createdAt} hint="First captured" icon={<Calendar className="h-5 w-5" />} />
        <StatTile label="Last Contacted" value={lead.lastContactedAt} hint="Most recent touchpoint" icon={<Phone className="h-5 w-5" />} tone="warning" />
      </div>

      <Card>
        <CardHeader title="Lead score breakdown" description="AI explanation of what makes this lead likely to convert" />
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink-600">Final score</p>
            <p className="text-3xl font-semibold">{lead.score}<span className="text-base font-normal text-ink-500">/100</span></p>
          </div>
          <Progress value={lead.score} tone={lead.score >= 80 ? 'success' : lead.score >= 50 ? 'warning' : 'danger'} className="h-2" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Profile fit', value: 88 },
              { label: 'Engagement', value: lead.score - 12 },
              { label: 'Purchase intent', value: 75 },
              { label: 'Source quality', value: 65 },
            ].map((f) => (
              <div key={f.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{f.label}</span>
                  <span className="font-mono text-ink-500">{f.value}%</span>
                </div>
                <Progress value={f.value} className="mt-1.5" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Tabs
        tabs={[
          { key: 'activity', label: 'Activity' },
          { key: 'notes', label: 'Notes' },
          { key: 'ai', label: 'AI insights' },
        ]}
        defaultKey={tab}
        onChange={setTab}
      />

      {tab === 'activity' && (
        <Card>
          <CardHeader title="Recent activity" />
          <CardBody className="divide-y divide-ink-100">
            {[
              { type: 'WhatsApp', text: 'Sent product comparison sheet', date: '2026-08-18' },
              { type: 'Call', text: 'Discovery call with technical team', date: '2026-08-15' },
              { type: 'Email', text: 'Followed up on the demo link', date: '2026-08-12' },
              { type: 'Lead', text: 'Captured from LinkedIn campaign', date: lead.createdAt },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <Badge tone="brand">{a.type}</Badge>
                  <p className="mt-1 text-sm">{a.text}</p>
                </div>
                <span className="text-xs text-ink-500">{a.date}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {tab === 'notes' && (
        <Card>
          <CardHeader title="Notes" />
          <CardBody>
            <p className="text-sm text-ink-700">{lead.notes}</p>
          </CardBody>
        </Card>
      )}

      {tab === 'ai' && (
        <Card>
          <CardHeader title="AI insights for this lead" />
          <CardBody className="space-y-3">
            <div className="rounded-lg bg-violet-50 p-3 text-sm text-violet-900">
              <p className="font-medium">Suggested next step</p>
              <p className="mt-1 text-violet-700/80">Send a personalized WhatsApp message with a tailored ROI calculator within the next 24 hours.</p>
            </div>
            <div className="rounded-lg border border-ink-100 p-3 text-sm">
              <p className="font-medium">Talking points</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-ink-600">
                <li>Emphasize the WhatsApp integration — competitor differentiator.</li>
                <li>Highlight the AI reply generation time savings.</li>
                <li>Propose a 14-day pilot with measurable success criteria.</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit lead" description="Update this lead in your workspace.">
        <form onSubmit={saveLead} className="space-y-4">
          <Field label="Lead name"><Input value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} required maxLength={120} /></Field>
          <Field label="Email"><Input type="email" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} required maxLength={254} /></Field>
          <Field label="Company"><Input value={editForm.company} onChange={(event) => setEditForm({ ...editForm, company: event.target.value })} required maxLength={160} /></Field>
          <Field label="Phone"><Input value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} maxLength={40} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <Select value={editForm.status} onChange={(event) => setEditForm({ ...editForm, status: event.target.value as LeadStatus })}>
                {['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Converted', 'Lost'].map((status) => <option key={status}>{status}</option>)}
              </Select>
            </Field>
            <Field label="Score">
              <Input type="number" min={0} max={100} value={editForm.score} onChange={(event) => setEditForm({ ...editForm, score: Number(event.target.value) })} required />
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete lead">
        <p className="text-sm text-ink-600">Delete {lead.name} from this workspace? This action cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn-primary bg-rose-600 hover:bg-rose-700" disabled={saving} onClick={deleteLead}>{saving ? 'Deleting…' : 'Delete lead'}</button>
        </div>
      </Modal>
    </div>
  )
}

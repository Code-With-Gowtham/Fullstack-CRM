import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Sparkles,
  PhoneCall,
  ShoppingCart,
  Edit3,
  CheckCircle2,
  XCircle,
  Send,
  Lightbulb,
  AlertTriangle,
  Trash2,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader, CardBody, StatTile } from '@/components/ui/Card'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { RiskMeter } from '@/components/ui/Progress'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { customers, churnPredictions, recommendations, interactions, tickets, purchases, conversations } from '@/mock/data'
import { apiDeleteCustomer, apiEnabled, apiGetCustomer, apiUpdateCustomer } from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'
import type { ChurnPrediction, Customer } from '@/types'

export function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | undefined>(() => apiEnabled ? undefined : customers.find((c) => c.id === id))
  const [loading, setLoading] = useState(apiEnabled)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', company: '', phone: '' })
  const prediction: ChurnPrediction | undefined =
    churnPredictions.find((p) => p.customerId === id) ??
    (customer
      ? { customerId: customer.id, probability: customer.churnProbability, risk: customer.churnRisk, factors: [], predictedAt: customer.createdAt }
      : undefined)
  const recommendation = recommendations.find((r) => r.customerId === id)
  const customerInteractions = interactions.filter((i) => i.customerId === id)
  const customerTickets = tickets.filter((t) => t.customerId === id)
  const customerPurchases = purchases.filter((p) => p.customerId === id)
  const conversation = conversations.find((v) => v.customerId === id)

  const [tab, setTab] = useState('overview')
  const [showAiModal, setShowAiModal] = useState(false)

  useEffect(() => {
    if (!apiEnabled || !id) return
    let active = true
    apiGetCustomer(id)
      .then((record) => {
        if (active) setCustomer(record)
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load this customer.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const saveCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!customer) return
    setActionError('')
    setSaving(true)
    try {
      setCustomer(await apiUpdateCustomer(customer.id, editForm))
      setShowEditModal(false)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update this customer.')
    } finally {
      setSaving(false)
    }
  }

  const deleteCustomer = async () => {
    if (!customer) return
    setActionError('')
    setSaving(true)
    try {
      await apiDeleteCustomer(customer.id)
      navigate('/customers', { replace: true })
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete this customer.')
      setShowDeleteModal(false)
    } finally {
      setSaving(false)
    }
  }

  const summary = useMemo(() => {
    if (!customer) return ''
    return `${customer.company} is a ${customer.value.toLowerCase()}-value ${customer.type.toLowerCase()} customer. Their engagement has been ${customer.sentiment.toLowerCase()} recently, with ${customerTickets.length} support interactions in the last 30 days. Current churn probability is ${customer.churnProbability}%.`
  }, [customer, customerTickets.length])

  if (loading) return <p role="status" className="text-sm text-ink-500">Loading customer…</p>
  if (loadError) return <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{loadError}</p>
  if (!customer || !prediction) {
    return (
      <div className="text-center text-ink-500">Customer not found.</div>
    )
  }

  const purchaseTrend = customerPurchases.slice(0, 6).map((p) => ({
    name: p.date.slice(5),
    amount: p.amount,
  }))

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </button>
      {actionError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{actionError}</p>}

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <Avatar name={customer.name} size="lg" className="h-14 w-14 text-lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-ink-900">{customer.company}</h2>
                  <StatusBadge status={customer.value} />
                  <Badge tone="brand">{customer.type}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-600">{customer.name} • {customer.industry} • {customer.location}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-600">
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-ink-400" /> {customer.email}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 text-ink-400" /> {customer.phone}</span>
                  <span className="inline-flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-emerald-500" /> {customer.whatsapp}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button disabled={!apiEnabled} onClick={() => { setEditForm({ name: customer.name, email: customer.email, company: customer.company, phone: customer.phone }); setShowEditModal(true) }} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"><Edit3 className="h-4 w-4" /> Edit</button>
              <button disabled={!apiEnabled} onClick={() => setShowDeleteModal(true)} className="btn-secondary text-rose-700 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Delete customer"><Trash2 className="h-4 w-4" /> Delete</button>
              <button className="btn-secondary"><PhoneCall className="h-4 w-4" /> Log call</button>
              <button onClick={() => setShowAiModal(true)} className="btn-primary"><Sparkles className="h-4 w-4" /> AI reply</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-y divide-ink-100 border-t border-ink-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            { label: 'Total Revenue', value: formatCurrency(customer.totalRevenue) },
            { label: 'Purchases', value: customer.purchaseCount.toString() },
            { label: 'Last Purchase', value: customer.lastPurchaseAt },
            { label: 'Next Follow-up', value: customer.nextFollowUpAt },
          ].map((s) => (
            <div key={s.label} className="p-4">
              <p className="text-xs uppercase tracking-wider text-ink-500">{s.label}</p>
              <p className="mt-1 text-base font-semibold text-ink-900">{s.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="AI customer summary" description="Generated from interactions, sentiment, and behavior" />
          <CardBody>
            <div className="rounded-xl bg-gradient-to-br from-violet-50 to-brand-50 p-4">
              <p className="text-sm leading-relaxed text-ink-700">{summary}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-ink-100 p-3">
                <p className="text-xs text-ink-500">Sentiment</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={customer.sentiment} />
                  <span className="text-sm text-ink-600">{Math.round(customer.sentimentScore * 100)}/100</span>
                </div>
              </div>
              <div className="rounded-lg border border-ink-100 p-3">
                <p className="text-xs text-ink-500">Churn probability</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={customer.churnRisk} />
                  <span className="text-sm text-ink-600">{customer.churnProbability}%</span>
                </div>
              </div>
              <div className="rounded-lg border border-ink-100 p-3">
                <p className="text-xs text-ink-500">Segment</p>
                <p className="mt-1.5 text-sm font-medium">{customer.segment}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Churn risk meter" description="Live prediction from ML model" />
          <CardBody>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: 'risk', value: customer.churnProbability, fill: customer.churnRisk === 'High' ? '#ef4444' : customer.churnRisk === 'Medium' ? '#f59e0b' : '#10b981' }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-32 mb-24 text-center">
              <p className="text-3xl font-semibold">{customer.churnProbability}%</p>
              <p className="text-xs text-ink-500">churn probability</p>
            </div>
            <RiskMeter probability={customer.churnProbability} />
          </CardBody>
        </Card>
      </div>

      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'ai', label: 'AI insights', count: 2 },
          { key: 'interactions', label: 'Interactions', count: customerInteractions.length },
          { key: 'tickets', label: 'Tickets', count: customerTickets.length },
          { key: 'purchases', label: 'Purchases', count: customerPurchases.length },
          { key: 'conversation', label: 'WhatsApp' },
        ]}
        defaultKey={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Purchase trend" description="Amount per recent purchase" />
            <CardBody>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={purchaseTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => formatCurrency(v as number)} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent activity" />
            <CardBody className="space-y-3">
              {customerInteractions.slice(0, 4).map((i) => (
                <div key={i.id} className="flex items-start gap-3">
                  <span className={cn('mt-1.5 h-2 w-2 rounded-full', {
                    'bg-emerald-500': i.sentiment === 'Positive',
                    'bg-ink-300': i.sentiment === 'Neutral',
                    'bg-rose-500': i.sentiment === 'Negative',
                  })} />
                  <div className="flex-1">
                    <p className="text-sm text-ink-900">{i.summary}</p>
                    <p className="text-xs text-ink-500">{i.type} • {i.date} • {i.agent}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'ai' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Explainable churn prediction"
              description="Top factors contributing to the prediction"
              action={<StatusBadge status={customer.churnRisk} />}
            />
            <CardBody>
              <div className="space-y-3">
                {prediction.factors.map((f) => (
                  <div key={f.feature}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink-700">{f.feature}</span>
                      <span className="font-mono text-ink-500">{f.contribution}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                      <div className={cn('h-full rounded-full', {
                        'bg-rose-500': f.contribution >= 25,
                        'bg-amber-500': f.contribution >= 15,
                        'bg-brand-500': f.contribution < 15,
                      })} style={{ width: `${f.contribution * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader title="Next Best Action" description="AI-recommended next step" />
            <CardBody>
              {recommendation ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 p-4 text-white">
                    <p className="text-xs uppercase tracking-wider text-white/80">Recommended action</p>
                    <p className="mt-1 text-lg font-semibold">{recommendation.recommendedAction}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge tone="violet" className="bg-white/20 text-white border-0">{recommendation.confidence}% confidence</Badge>
                      <StatusBadge status={recommendation.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Why?</p>
                    <p className="mt-2 text-sm text-ink-700">{recommendation.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Other options considered</p>
                    <ul className="mt-2 space-y-1.5">
                      {recommendation.alternatives.slice(1).map((a) => (
                        <li key={a.action} className="flex items-center justify-between text-sm">
                          <span className="text-ink-700">{a.action}</span>
                          <span className="font-mono text-ink-500">{a.score}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary flex-1 justify-center"><CheckCircle2 className="h-4 w-4" /> Approve</button>
                    <button className="btn-secondary"><XCircle className="h-4 w-4" /></button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-ink-500">No active recommendation for this customer.</p>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'interactions' && (
        <Card>
          <CardHeader title="Interaction history" />
          <CardBody className="divide-y divide-ink-100">
            {customerInteractions.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{i.summary}</p>
                    <p className="text-xs text-ink-500">{i.type} • {i.direction} • {i.agent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={i.sentiment} />
                  <span className="text-xs text-ink-500">{i.date}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {tab === 'tickets' && (
        <Card>
          <CardHeader title="Support tickets" action={<Link to="/tickets" className="text-sm text-brand-700">View all</Link>} />
          <CardBody className="divide-y divide-ink-100">
            {customerTickets.length === 0 && <p className="py-6 text-sm text-ink-500">No tickets for this customer.</p>}
            {customerTickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="text-xs text-ink-500">{t.id} • {t.assignedAgent}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warning' : 'neutral'}>{t.priority}</Badge>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {tab === 'purchases' && (
        <Card>
          <CardHeader title="Purchase history" />
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {customerPurchases.map((p) => (
                  <tr key={p.id}>
                    <td className="px-3 py-3 font-medium">{p.product}</td>
                    <td className="px-3 py-3">{formatCurrency(p.amount)}</td>
                    <td className="px-3 py-3 text-ink-500">{p.date}</td>
                    <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      {tab === 'conversation' && conversation && (
        <Card>
          <CardHeader title={`WhatsApp conversation`} description={`Assigned to ${conversation.assignedAgent}`} />
          <CardBody>
            <div className="space-y-3 rounded-xl bg-ink-50/60 p-4">
              {conversation.messages.map((m) => (
                <div key={m.id} className={cn('flex', m.from === 'customer' ? 'justify-start' : 'justify-end')}>
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                      m.from === 'customer' ? 'bg-white text-ink-900' : 'bg-brand-600 text-white',
                    )}
                  >
                    <p>{m.text}</p>
                    <div className={cn('mt-1 flex items-center gap-2 text-[11px]', m.from === 'customer' ? 'text-ink-500' : 'text-white/70')}>
                      <span>{m.timestamp}</span>
                      {m.aiGenerated && <span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI generated</span>}
                      {m.sentiment && <StatusBadge status={m.sentiment} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Input placeholder="Type a message or generate with AI..." />
              <button className="btn-secondary"><Sparkles className="h-4 w-4" /></button>
              <button className="btn-primary"><Send className="h-4 w-4" /></button>
            </div>
          </CardBody>
        </Card>
      )}

      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit customer"
        description="Update this customer in your workspace."
      >
        <form onSubmit={saveCustomer} className="space-y-4">
          <Field label="Customer name"><Input value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} required maxLength={120} /></Field>
          <Field label="Email"><Input type="email" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} required maxLength={254} /></Field>
          <Field label="Company"><Input value={editForm.company} onChange={(event) => setEditForm({ ...editForm, company: event.target.value })} required maxLength={160} /></Field>
          <Field label="Phone"><Input value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} maxLength={40} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete customer">
        <p className="text-sm text-ink-600">Delete {customer.name} from this workspace? This action cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn-primary bg-rose-600 hover:bg-rose-700" disabled={saving} onClick={deleteCustomer}>{saving ? 'Deleting…' : 'Delete customer'}</button>
        </div>
      </Modal>

      <Modal
        open={showAiModal}
        onClose={() => setShowAiModal(false)}
        title="AI Reply Generator"
        description="Draft a response based on the customer's sentiment and history."
        size="lg"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Human approval required.</span>
            </div>
            <p className="mt-1 text-amber-700/80">
              The AI draft is a suggestion. You must review and approve before sending to the customer.
            </p>
          </div>
          <Field label="Tone">
            <Select>
              <option>Empathetic</option>
              <option>Professional</option>
              <option>Friendly</option>
              <option>Concise</option>
            </Select>
          </Field>
          <Field label="Context (optional)">
            <Input placeholder="e.g. Apologize for the delivery delay and offer a discount" />
          </Field>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="label">Generated draft</span>
              <button className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-800">
                <Lightbulb className="h-3.5 w-3.5" /> Regenerate
              </button>
            </div>
            <Textarea defaultValue={`Hi ${customer.name.split(' ')[0]}, I’m really sorry for the delay with your order. I’ve checked with our logistics team and confirmed it should reach you by tomorrow afternoon. I’ve also added a small credit to your account as a thank-you for your patience. Please let me know once it arrives.`} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary">Save draft</button>
            <button className="btn-primary"><CheckCircle2 className="h-4 w-4" /> Approve & send</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

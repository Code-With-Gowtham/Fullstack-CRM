import { useState } from 'react'
import { Save, Bell, Lock, Plug, MessageSquare, Sparkles, Brain } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Field, Input, Textarea, Select } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'

const tabs = [
  { key: 'general', label: 'General', icon: Plug },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { key: 'ai', label: 'AI Engine', icon: Brain },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Lock },
]

export function SettingsPage() {
  const [tab, setTab] = useState('general')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure workspace, integrations, and AI engine behavior"
        action={<button className="btn-primary"><Save className="h-4 w-4" /> Save changes</button>}
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  tab === t.key ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          {tab === 'general' && (
            <>
              <Card>
                <CardHeader title="Workspace" description="Basic information about your company" />
                <CardBody className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Company name"><Input defaultValue="Pulse CRM Demo" /></Field>
                    <Field label="Workspace URL"><Input defaultValue="pulse-crm" /></Field>
                  </div>
                  <Field label="Description"><Textarea defaultValue="AI-Powered Customer Intelligence and Next-Best-Action CRM." /></Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Currency"><Select defaultValue="INR"><option>INR</option><option>USD</option><option>EUR</option><option>GBP</option></Select></Field>
                    <Field label="Timezone"><Select defaultValue="IST"><option>IST (UTC+5:30)</option><option>UTC</option><option>PST</option></Select></Field>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Branding" description="Customize the look of your CRM" />
                <CardBody className="grid gap-4 sm:grid-cols-3">
                  {[
                    { name: 'Brand', className: 'bg-brand-500' },
                    { name: 'Emerald', className: 'bg-emerald-500' },
                    { name: 'Violet', className: 'bg-violet-500' },
                  ].map((c, i) => (
                    <button
                      key={c.name}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border p-3 text-left hover:border-brand-300',
                        i === 0 ? 'border-brand-500 bg-brand-50/40' : 'border-ink-200',
                      )}
                    >
                      <div className={cn('h-8 w-8 rounded-lg', c.className)} />
                      <span className="text-sm font-medium">{c.name}</span>
                    </button>
                  ))}
                </CardBody>
              </Card>
            </>
          )}

          {tab === 'whatsapp' && (
            <Card>
              <CardHeader title="WhatsApp Business Integration" description="Connect your WhatsApp Business API account" />
              <CardBody className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-900">Connected to WhatsApp Business API</p>
                        <p className="text-xs text-emerald-700">+91 98765 43210 • last verified 2 days ago</p>
                      </div>
                    </div>
                    <span className="badge bg-white text-emerald-700 border border-emerald-200">Active</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone Number ID"><Input defaultValue="123456789012345" /></Field>
                  <Field label="Business Account ID"><Input defaultValue="987654321098765" /></Field>
                </div>
                <Field label="Webhook URL"><Input defaultValue="https://api.pulsecrm.com/webhooks/whatsapp" readOnly /></Field>
                <div className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                  <div>
                    <p className="text-sm font-medium">Auto-link WhatsApp to customers</p>
                    <p className="text-xs text-ink-500">Match incoming messages to customer records by phone number</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardBody>
            </Card>
          )}

          {tab === 'ai' && (
            <>
              <Card>
                <CardHeader title="AI Engine" description="Configure the ML models powering Pulse" />
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-violet-50 to-brand-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500 text-white">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">AI Engine v2.4 — Active</p>
                        <p className="text-xs text-ink-500">Last trained 3 days ago • 184 predictions today</p>
                      </div>
                    </div>
                    <button className="btn-secondary">Retrain</button>
                  </div>
                  <Field label="Churn prediction model">
                    <Select defaultValue="gradient_boost">
                      <option value="gradient_boost">Gradient Boost (recommended)</option>
                      <option value="random_forest">Random Forest</option>
                      <option value="neural">Neural Network</option>
                    </Select>
                  </Field>
                  <Field label="Sentiment model">
                    <Select defaultValue="transformer">
                      <option value="transformer">Transformer (multilingual)</option>
                      <option value="lexicon">Lexicon-based</option>
                    </Select>
                  </Field>
                  <Field label="Reply generation model">
                    <Select defaultValue="claude">
                      <option value="claude">Claude Sonnet</option>
                      <option value="gpt">OpenAI GPT-4</option>
                      <option value="local">Local LLM (self-hosted)</option>
                    </Select>
                  </Field>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="AI Behavior" description="Tune how the AI makes recommendations" />
                <CardBody className="space-y-3">
                  {[
                    { label: 'Require human approval for all AI replies', defaultChecked: true },
                    { label: 'Auto-classify incoming ticket priority', defaultChecked: true },
                    { label: 'Generate AI customer summaries automatically', defaultChecked: true },
                    { label: 'Send AI-generated messages without review', defaultChecked: false },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                      <p className="text-sm text-ink-700">{s.label}</p>
                      <Switch defaultChecked={s.defaultChecked} />
                    </div>
                  ))}
                </CardBody>
              </Card>
            </>
          )}

          {tab === 'notifications' && (
            <Card>
              <CardHeader title="Notification preferences" />
              <CardBody className="space-y-3">
                {[
                  { label: 'High churn-risk customer alerts', channel: 'Email + In-app', on: true },
                  { label: 'New leads assigned to me', channel: 'Email + WhatsApp', on: true },
                  { label: 'AI recommendation ready', channel: 'In-app', on: true },
                  { label: 'Daily performance summary', channel: 'Email', on: false },
                  { label: 'Customer replies on WhatsApp', channel: 'In-app + WhatsApp', on: true },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <div>
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-xs text-ink-500">{n.channel}</p>
                    </div>
                    <Switch defaultChecked={n.on} />
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {tab === 'security' && (
            <>
              <Card>
                <CardHeader title="Authentication" />
                <CardBody className="space-y-4">
                  <Field label="Password minimum length"><Input type="number" defaultValue="8" /></Field>
                  <div className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <div>
                      <p className="text-sm font-medium">Two-factor authentication</p>
                      <p className="text-xs text-ink-500">Require 2FA for all admins</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <div>
                      <p className="text-sm font-medium">Session timeout</p>
                      <p className="text-xs text-ink-500">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30" className="w-32">
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                      <option value="240">4 hours</option>
                    </Select>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Audit log" description="Recent security events" />
                <CardBody className="divide-y divide-ink-100">
                  {[
                    'New login from Chrome on macOS',
                    'User role changed: Ram Kumar → Manager',
                    'API key regenerated',
                    'Failed login attempt blocked',
                  ].map((e, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-ink-700">{e}</span>
                      <span className="text-xs text-ink-500">2 hours ago</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

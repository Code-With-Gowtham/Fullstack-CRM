import { useState } from 'react'
import { Search, Send, Sparkles, Phone, Video, Paperclip, Smile, CheckCheck, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { conversations, customers } from '@/mock/data'
import { cn } from '@/lib/utils'

export function WhatsAppPage() {
  const [active, setActive] = useState(conversations[0]?.id)
  const activeConv = conversations.find((c) => c.id === active)
  const activeCustomer = customers.find((c) => c.id === activeConv?.customerId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Inbox"
        description="Conversations linked to your customers with real-time AI assistance"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected to WhatsApp Business API
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid h-[640px] grid-cols-1 md:grid-cols-[320px_1fr]">
          <div className="flex flex-col border-r border-ink-100 bg-ink-50/50">
            <div className="border-b border-ink-100 p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <Input className="pl-9" placeholder="Search conversations" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => {
                const cust = customers.find((cu) => cu.id === c.customerId)!
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-ink-100 p-3 text-left transition-colors hover:bg-white',
                      active === c.id && 'bg-white',
                    )}
                  >
                    <Avatar name={cust.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-ink-900">{cust.company}</p>
                        <span className="text-[11px] text-ink-500">{c.lastMessageAt.slice(5)}</span>
                      </div>
                      <p className="truncate text-xs text-ink-500">{c.lastMessage}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusBadge status={c.status} />
                        {c.unread > 0 && <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">{c.unread}</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col bg-white">
            {activeConv && activeCustomer ? (
              <>
                <div className="flex items-center justify-between border-b border-ink-100 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={activeCustomer.name} />
                    <div>
                      <p className="text-sm font-semibold">{activeCustomer.company}</p>
                      <p className="text-xs text-ink-500">{activeCustomer.whatsapp} • {activeConv.assignedAgent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><Phone className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><Video className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/40 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={activeCustomer.sentiment} />
                    <span className="text-xs text-ink-500">Sentiment: {activeCustomer.sentiment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-500">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    {activeCustomer.churnRisk} churn risk ({activeCustomer.churnProbability}%)
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><circle cx=%221%22 cy=%221%22 r=%221%22 fill=%22%23e2e8f0%22/></svg>')] p-4">
                  {activeConv.messages.map((m) => (
                    <div key={m.id} className={cn('flex', m.from === 'customer' ? 'justify-start' : 'justify-end')}>
                      <div
                        className={cn(
                          'max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                          m.from === 'customer' ? 'bg-white text-ink-900' : 'bg-emerald-100 text-ink-900',
                        )}
                      >
                        <p>{m.text}</p>
                        <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-ink-500">
                          <span>{m.timestamp}</span>
                          {m.from === 'agent' && <CheckCheck className="h-3 w-3 text-emerald-600" />}
                          {m.aiGenerated && <span className="inline-flex items-center gap-1 text-violet-600"><Sparkles className="h-3 w-3" /> AI</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-ink-100 p-3">
                  <div className="mb-2 flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="flex-1">AI suggestions will appear here based on the conversation context.</span>
                    <button className="rounded-md bg-violet-600 px-2 py-0.5 text-white hover:bg-violet-700">Generate reply</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><Paperclip className="h-4 w-4" /></button>
                    <Input placeholder="Type a message" />
                    <button className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><Smile className="h-4 w-4" /></button>
                    <button className="btn-primary"><Send className="h-4 w-4" /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-ink-500">
                Select a conversation to start.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

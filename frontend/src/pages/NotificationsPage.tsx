import { Bell, MessageSquare, UserPlus, AlertTriangle, Target, Calendar, CheckCheck, Filter } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { notifications } from '@/mock/data'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

const iconFor = (type: Notification['type']) => {
  const map = {
    lead: <UserPlus className="h-4 w-4" />,
    churn: <AlertTriangle className="h-4 w-4" />,
    message: <MessageSquare className="h-4 w-4" />,
    'follow-up': <Calendar className="h-4 w-4" />,
    recommendation: <Target className="h-4 w-4" />,
    ticket: <Bell className="h-4 w-4" />,
  }
  return map[type]
}

const toneFor = (type: Notification['type']) => {
  const map = {
    lead: 'bg-brand-50 text-brand-700',
    churn: 'bg-rose-50 text-rose-700',
    message: 'bg-emerald-50 text-emerald-700',
    'follow-up': 'bg-amber-50 text-amber-700',
    recommendation: 'bg-violet-50 text-violet-700',
    ticket: 'bg-sky-50 text-sky-700',
  }
  return map[type]
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const list = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay on top of leads, churn risk, and AI recommendations"
        action={
          <button className="btn-secondary"><CheckCheck className="h-4 w-4" /> Mark all as read</button>
        }
      />

      <Card>
        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-3">
          <Filter className="h-4 w-4 text-ink-500" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium',
                filter === 'all' ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50',
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium',
                filter === 'unread' ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50',
              )}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>
        </div>

        <div className="divide-y divide-ink-100">
          {list.map((n) => (
            <Link
              key={n.id}
              to={n.link ?? '#'}
              className="flex items-start gap-4 px-5 py-4 hover:bg-ink-50/60"
            >
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', toneFor(n.type))}>
                {iconFor(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-900">{n.title}</p>
                  <span className="text-xs text-ink-500">{n.createdAt}</span>
                </div>
                <p className="mt-1 text-sm text-ink-600">{n.body}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-500" />}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

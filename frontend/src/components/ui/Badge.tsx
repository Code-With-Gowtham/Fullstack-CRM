import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'amber'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-sky-50 text-sky-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
}

export function Badge({ children, tone = 'neutral', className, dot }: { children: ReactNode; tone?: Tone; className?: string; dot?: boolean }) {
  return (
    <span className={cn('badge', tones[tone], className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', {
        'bg-ink-500': tone === 'neutral',
        'bg-brand-500': tone === 'brand',
        'bg-emerald-500': tone === 'success',
        'bg-amber-500': tone === 'warning' || tone === 'amber',
        'bg-rose-500': tone === 'danger',
        'bg-sky-500': tone === 'info',
        'bg-violet-500': tone === 'violet',
      })} />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Tone> = {
    New: 'info',
    Contacted: 'brand',
    Qualified: 'violet',
    Proposal: 'amber',
    Negotiation: 'warning',
    Converted: 'success',
    Lost: 'danger',
    Open: 'info',
    'In Progress': 'brand',
    Waiting: 'amber',
    Resolved: 'success',
    Closed: 'neutral',
    Pending: 'amber',
    Approved: 'brand',
    Executed: 'success',
    Rejected: 'danger',
    Successful: 'success',
    Unsuccessful: 'danger',
    Partial: 'warning',
    Hot: 'danger',
    Warm: 'warning',
    Cold: 'info',
    High: 'danger',
    Medium: 'warning',
    Low: 'success',
    Positive: 'success',
    Neutral: 'neutral',
    Negative: 'danger',
  }
  return <Badge tone={map[status] ?? 'neutral'} dot>{status}</Badge>
}

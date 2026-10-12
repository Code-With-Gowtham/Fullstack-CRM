import { cn } from '@/lib/utils'

export function Progress({ value, max = 100, tone = 'brand', className }: { value: number; max?: number; tone?: 'brand' | 'success' | 'warning' | 'danger'; className?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const fill = {
    brand: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  }[tone]
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-ink-100', className)}>
      <div className={cn('h-full rounded-full transition-all', fill)} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function RiskMeter({ probability }: { probability: number }) {
  const tone = probability >= 65 ? 'danger' : probability >= 35 ? 'warning' : 'success'
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-700">Churn probability</span>
        <span className="text-lg font-semibold text-ink-900">{probability}%</span>
      </div>
      <Progress value={probability} tone={tone} />
    </div>
  )
}

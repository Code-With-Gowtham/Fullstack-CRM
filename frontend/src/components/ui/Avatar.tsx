import { cn } from '@/lib/utils'

interface Props {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
}

export function Avatar({ name, color = 'bg-brand-500', size = 'md', className }: Props) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className={cn('inline-flex items-center justify-center rounded-full font-semibold text-white', color, sizeMap[size], className)}>
      {initials}
    </div>
  )
}

export function AvatarGroup({ names, max = 4 }: { names: string[]; max?: number }) {
  const visible = names.slice(0, max)
  const overflow = Math.max(0, names.length - max)
  return (
    <div className="flex -space-x-2">
      {visible.map((n, i) => (
        <Avatar key={i} name={n} color={['bg-brand-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'][i % 4]} size="sm" className="ring-2 ring-white" />
      ))}
      {overflow > 0 && (
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-200 text-xs font-medium text-ink-700 ring-2 ring-white">
          +{overflow}
        </div>
      )}
    </div>
  )
}

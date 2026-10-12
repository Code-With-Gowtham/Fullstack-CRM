import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
  count?: number
}

export function Tabs({ tabs, defaultKey, onChange, className }: { tabs: Tab[]; defaultKey?: string; onChange?: (key: string) => void; className?: string }) {
  const [active, setActive] = useState(defaultKey ?? tabs[0]?.key)
  return (
    <div className={cn('border-b border-ink-200', className)}>
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const isActive = t.key === active
          return (
            <button
              key={t.key}
              onClick={() => {
                setActive(t.key)
                onChange?.(t.key)
              }}
              className={cn(
                'relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'text-brand-700' : 'text-ink-600 hover:text-ink-900',
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={cn('ml-2 rounded-full px-2 py-0.5 text-xs', isActive ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-600')}>
                  {t.count}
                </span>
              )}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-600" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

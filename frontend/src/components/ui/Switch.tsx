import { cn } from '@/lib/utils'

interface Props {
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({ defaultChecked, checked, onChange, disabled, className }: Props) {
  return (
    <label className={cn('relative inline-flex h-6 w-11 cursor-pointer items-center', disabled && 'opacity-50', className)}>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />
      <span className="h-6 w-11 rounded-full bg-ink-200 transition-colors peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/30" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
    </label>
  )
}

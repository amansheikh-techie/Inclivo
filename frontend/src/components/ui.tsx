import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Check, Inbox, Info, List, Loader2, Map as MapIcon, RefreshCw } from 'lucide-react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--ink)] shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function ActionButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-action-fill="true"
      className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--action)] px-4 py-2.5 text-sm font-semibold text-[var(--action-ink)] shadow-sm transition-colors hover:bg-[var(--action-hover)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function FilterChip({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-accent-fill={active ? 'true' : undefined}
      className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'border-[var(--primary)] bg-[var(--accent)] text-[var(--accent-ink)]'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-muted)]'
      }`}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
      {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
    </button>
  )
}

export function DemoBanner() {
  const { t } = useTranslation()
  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] shadow-sm"
    >
      <span
        data-accent-fill="true"
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-[var(--accent-ink)]"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{t('states.demo_badge')}</span>
      </span>
      <span className="text-[var(--ink-muted)]">{t('states.demo_desc')}</span>
    </div>
  )
}

export function StateMessage({
  kind,
  title,
  description,
  onRetry,
}: {
  kind: 'loading' | 'empty' | 'error'
  title?: string
  description?: string
  onRetry?: () => void
}) {
  const { t } = useTranslation()

  if (kind === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center"
      >
        <Loader2 className="h-7 w-7 animate-spin text-[var(--action)]" aria-hidden="true" />
        <p className="text-sm font-semibold text-[var(--ink-muted)]">
          {title || t('states.loading')}
        </p>
      </div>
    )
  }

  const isError = kind === 'error'
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"
    >
      {isError ? (
        <AlertCircle className="h-8 w-8 text-red-700 dark:text-red-400" aria-hidden="true" />
      ) : (
        <Inbox className="h-8 w-8 text-[var(--ink-muted)]" aria-hidden="true" />
      )}
      <h3 className="text-base font-bold text-[var(--ink)]">
        {title || (isError ? t('states.error_title') : t('states.empty_title'))}
      </h3>
      <p className="max-w-md text-sm text-[var(--ink-muted)]">
        {description || t('states.empty_desc')}
      </p>
      {onRetry && (
        <SecondaryButton type="button" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span>{t('states.retry')}</span>
        </SecondaryButton>
      )}
    </div>
  )
}

export function ViewModeToggle({
  value,
  onChange,
}: {
  value: 'map' | 'list'
  onChange: (mode: 'map' | 'list') => void
}) {
  const { t } = useTranslation()
  const options: { id: 'map' | 'list'; label: string; icon: typeof MapIcon }[] = [
    { id: 'map', label: t('finder.view_map'), icon: MapIcon },
    { id: 'list', label: t('finder.view_list'), icon: List },
  ]

  return (
    <div
      role="group"
      aria-label={t('finder.view_map')}
      className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-1 self-start lg:self-auto"
    >
      {options.map(({ id, label, icon: Icon }) => {
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={`inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              active
                ? 'bg-[var(--action)] text-[var(--action-ink)] shadow-sm'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}


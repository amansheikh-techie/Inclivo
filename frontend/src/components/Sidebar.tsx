import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Accessibility, SlidersHorizontal } from 'lucide-react'
import { NAV_ITEMS } from './navConfig'

interface SidebarProps {
  onOpenSensory: () => void
  activeModeCount: number
}

export function Sidebar({ onOpenSensory, activeModeCount }: SidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <aside
      aria-label={t('nav.sidebar_label')}
      className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-[var(--border)] lg:bg-[var(--surface)]"
    >
      <div className="border-b border-[var(--border)] px-5 py-5">
        <Link to="/" className="flex items-center gap-3 rounded-xl p-1">
          <span
            data-action-fill="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm"
          >
            <Accessibility className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="block truncate text-lg font-extrabold tracking-tight text-[var(--ink)]">
              {t('brand')}
            </span>
            <span className="block truncate text-xs font-medium text-[var(--ink-muted)]">
              {t('tagline')}
            </span>
          </div>
        </Link>
      </div>

      <nav aria-label={t('nav.sidebar_label')} className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'border-l-4 border-[var(--action)] bg-[var(--surface-muted)] font-bold text-[var(--ink)]'
                  : 'font-medium text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{t(labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <button
          type="button"
          onClick={onOpenSensory}
          className="flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:opacity-90"
        >
          <span className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t('nav.sensory_settings')}</span>
          </span>
          {activeModeCount > 0 && (
            <span
              data-accent-fill="true"
              className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-bold text-[var(--accent-ink)]"
            >
              {activeModeCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}

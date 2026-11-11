import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bot, Captions, Home, MapPin, MoreHorizontal, SlidersHorizontal, X } from 'lucide-react'
import { NAV_ITEMS } from './navConfig'

interface BottomNavProps {
  onOpenSensory: () => void
}

const PRIMARY_MOBILE_ITEMS = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/places', labelKey: 'nav.places', icon: MapPin },
  { to: '/assistant', labelKey: 'nav.assistant', icon: Bot },
  { to: '/captions', labelKey: 'nav.captions', icon: Captions },
]

const MORE_ROUTES = new Set(['/washrooms', '/schemes', '/report', '/passport', '/about'])

export function BottomNav({ onOpenSensory }: BottomNavProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!moreOpen) return
    openerRef.current = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      openerRef.current?.focus()
    }
  }, [moreOpen])

  const moreItems = NAV_ITEMS.filter((item) => MORE_ROUTES.has(item.to))
  const isMoreActive = MORE_ROUTES.has(location.pathname)

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/45 lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <section
            id="mobile-more-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-more-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-2xl border-t border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--ink)] shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 id="mobile-more-title" className="text-base font-bold">
                {t('nav.more_tools')}
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label={t('nav.close')}
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label={t('nav.more_tools')} className="grid grid-cols-1 gap-2">
              {moreItems.map(({ to, labelKey, icon: Icon }) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMoreOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                      active
                        ? 'border-l-4 border-[var(--action)] bg-[var(--surface-muted)] font-bold'
                        : 'hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{t(labelKey)}</span>
                  </Link>
                )
              })}
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false)
                  onOpenSensory()
                }}
                className="mt-1 flex min-h-[44px] w-full cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)]"
              >
                <SlidersHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{t('nav.sensory_settings')}</span>
              </button>
            </nav>
          </section>
        </div>
      )}

      <nav
        aria-label={t('nav.mobile_nav_label')}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)] px-1 py-1 lg:hidden"
      >
        <div className="grid grid-cols-5 gap-1">
          {PRIMARY_MOBILE_ITEMS.map(({ to, labelKey, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] ${
                  active
                    ? 'border-t-2 border-[var(--action)] bg-[var(--surface-muted)] font-bold text-[var(--ink)]'
                    : 'font-medium text-[var(--ink-muted)]'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="max-w-full truncate">{t(labelKey)}</span>
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-expanded={moreOpen}
            aria-controls="mobile-more-sheet"
            className={`flex min-h-[52px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] ${
              isMoreActive || moreOpen
                ? 'border-t-2 border-[var(--action)] bg-[var(--surface-muted)] font-bold text-[var(--ink)]'
                : 'font-medium text-[var(--ink-muted)]'
            }`}
          >
            <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="max-w-full truncate">{t('nav.more')}</span>
          </button>
        </div>
      </nav>
    </>
  )
}

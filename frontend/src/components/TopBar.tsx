import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Accessibility, Languages, Search, SlidersHorizontal, User } from 'lucide-react'

interface TopBarProps {
  onOpenSensory: () => void
  isSensoryOpen: boolean
  activeModeCount: number
}

export function TopBar({ onOpenSensory, isSensoryOpen, activeModeCount }: TopBarProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'HI' },
    { code: 'te', label: 'TE' },
    { code: 'ta', label: 'TA' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    navigate(trimmed ? `/schemes?q=${encodeURIComponent(trimmed)}` : '/schemes')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-1.5 lg:hidden"
        >
          <span
            data-action-fill="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white"
          >
            <Accessibility className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-extrabold tracking-tight text-[var(--ink)]">
            {t('brand')}
          </span>
        </Link>

        <form
          role="search"
          onSubmit={handleSearch}
          className="relative hidden flex-1 sm:block sm:max-w-md"
        >
          <label htmlFor="topbar-search" className="sr-only">
            {t('nav.search_label')}
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]"
            aria-hidden="true"
          />
          <input
            id="topbar-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('nav.search_placeholder')}
            className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] pl-10 pr-4 text-sm font-medium text-[var(--ink)] placeholder:text-[var(--ink-muted)]"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-2.5">
            <Languages className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" aria-hidden="true" />
            <label htmlFor="topbar-lang-select" className="sr-only">
              Select Language
            </label>
            <select
              id="topbar-lang-select"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="min-h-[40px] cursor-pointer bg-transparent text-sm font-bold text-[var(--ink)] focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[var(--surface)] text-[var(--ink)]">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenSensory}
            aria-label={t('nav.sensory_settings')}
            aria-expanded={isSensoryOpen}
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm font-semibold text-[var(--ink)] hover:opacity-90"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{t('nav.sensory_settings')}</span>
            {activeModeCount > 0 && (
              <span
                data-accent-fill="true"
                className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-xs font-bold text-[var(--accent-ink)]"
              >
                {activeModeCount}
              </span>
            )}
          </button>

          <Link
            to="/passport"
            aria-label={t('nav.profile')}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
          >
            <User className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">{t('nav.profile')}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}


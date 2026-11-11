import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Loader2,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { api, useDemoData, type MatchedScheme, type Scheme } from '../lib/api'
import { SchemeCard } from '../components/SchemeCard'
import {
  ActionButton,
  Card,
  DemoBanner,
  SecondaryButton,
  StateMessage,
} from '../components/ui'

export function Schemes() {
  const { t, i18n } = useTranslation()
  const isDemo = useDemoData()

  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [matchedSchemes, setMatchedSchemes] = useState<MatchedScheme[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [disabilityFilter, setDisabilityFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')

  const [checkerOpen, setCheckerOpen] = useState(false)
  const [age, setAge] = useState('')
  const [income, setIncome] = useState('')
  const [checkerState, setCheckerState] = useState('')
  const [checkerDisability, setCheckerDisability] = useState('visual')
  const [checkerError, setCheckerError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    let active = true
    api
      .getSchemes()
      .then((data) => {
        if (active) setSchemes(data)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(false)
    api
      .getSchemes()
      .then((data) => setSchemes(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  const uniqueDisabilities = Array.from(
    new Set(schemes.map((s) => s.disability_type).filter(Boolean) as string[]),
  )
  const uniqueStates = Array.from(
    new Set(schemes.map((s) => s.state).filter(Boolean) as string[]),
  )

  const displayItems: { scheme: Scheme; reason?: string }[] = matchedSchemes
    ? matchedSchemes.map((m) => ({ scheme: m.scheme, reason: m.reason }))
    : schemes.map((scheme) => ({ scheme }))

  const filteredItems = displayItems.filter(({ scheme }) => {
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      const haystack = `${scheme.display_name} ${scheme.name} ${scheme.benefits ?? ''} ${scheme.eligibility ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (disabilityFilter && scheme.disability_type !== disabilityFilter) return false
    if (stateFilter && scheme.state !== stateFilter) return false
    return true
  })

  const hasFilters = Boolean(searchQuery || disabilityFilter || stateFilter)

  const clearFilters = () => {
    setSearchQuery('')
    setDisabilityFilter('')
    setStateFilter('')
  }

  const handleCheckEligibility = async (e: React.FormEvent) => {
    e.preventDefault()
    const numAge = Number(age)
    const numIncome = Number(income)
    if (!age.trim() || Number.isNaN(numAge) || numAge < 0 || numAge > 120) {
      setCheckerError(t('schemes_ui.validation_age'))
      return
    }
    if (!income.trim() || Number.isNaN(numIncome) || numIncome < 0) {
      setCheckerError(t('schemes_ui.validation_income'))
      return
    }
    setCheckerError(null)
    setChecking(true)
    try {
      const results = await api.matchSchemes({
        age: numAge,
        income_range: String(numIncome),
        state: checkerState.trim() || 'Central',
        disability_type: checkerDisability,
        lang: i18n.language,
      })
      setMatchedSchemes(results)
    } catch {
      setCheckerError(t('states.error_title'))
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner />}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            {t('schemes.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-1">
            {t('schemes.subtitle')}
          </p>
        </div>

        <ActionButton
          type="button"
          onClick={() => setCheckerOpen((v) => !v)}
          aria-expanded={checkerOpen}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t('schemes.eligibility_checker')}</span>
        </ActionButton>
      </header>

      {checkerOpen && (
        <Card>
          <form
            onSubmit={handleCheckEligibility}
            noValidate
            className="flex flex-col gap-4"
          >
            <h2 className="text-lg font-bold text-[var(--ink)]">
              {t('schemes.eligibility_checker')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label htmlFor="checker-age" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  {t('schemes.age')}
                </label>
                <input
                  id="checker-age"
                  type="number"
                  min={0}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t('schemes_ui.age_placeholder')}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                />
              </div>

              <div>
                <label htmlFor="checker-income" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  {t('schemes.income')}
                </label>
                <input
                  id="checker-income"
                  type="number"
                  min={0}
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder={t('schemes_ui.income_placeholder')}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                />
              </div>

              <div>
                <label htmlFor="checker-state" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  {t('schemes.state')}
                </label>
                <input
                  id="checker-state"
                  type="text"
                  value={checkerState}
                  onChange={(e) => setCheckerState(e.target.value)}
                  placeholder={t('schemes_ui.state_placeholder')}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                />
              </div>

              <div>
                <label htmlFor="checker-disability" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  {t('schemes.filter_disability')}
                </label>
                <select
                  id="checker-disability"
                  value={checkerDisability}
                  onChange={(e) => setCheckerDisability(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                >
                  <option value="visual">{t('schemes_ui.disability_visual')}</option>
                  <option value="hearing">{t('schemes_ui.disability_hearing')}</option>
                  <option value="mobility">{t('schemes_ui.disability_mobility')}</option>
                  <option value="cognitive">{t('schemes_ui.disability_cognitive')}</option>
                  <option value="all">{t('schemes_ui.disability_all')}</option>
                </select>
              </div>
            </div>

            {checkerError && (
              <p
                role="alert"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{checkerError}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <ActionButton type="submit" disabled={checking}>
                {checking ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                <span>{checking ? t('schemes_ui.checking') : t('schemes.check_btn')}</span>
              </ActionButton>

              {matchedSchemes && (
                <SecondaryButton
                  type="button"
                  onClick={() => setMatchedSchemes(null)}
                >
                  <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t('schemes_ui.clear_matches')}</span>
                </SecondaryButton>
              )}
            </div>
          </form>
        </Card>
      )}

      {matchedSchemes && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
        >
          <span className="text-sm font-semibold text-[var(--ink)] inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
            <span>{t('schemes_ui.matched_banner', { count: matchedSchemes.length })}</span>
          </span>
          <SecondaryButton
            type="button"
            onClick={() => setMatchedSchemes(null)}
            className="text-xs px-3 py-2"
          >
            {t('schemes_ui.clear_matches')}
          </SecondaryButton>
        </div>
      )}

      <Card className="p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-[var(--ink-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('schemes.search_placeholder')}
            aria-label={t('schemes.search_placeholder')}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm placeholder:text-[var(--ink-muted)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--accent-text)] shrink-0 hidden sm:block" aria-hidden="true" />

          <select
            aria-label={t('schemes.filter_disability')}
            value={disabilityFilter}
            onChange={(e) => setDisabilityFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm font-medium"
          >
            <option value="">{t('schemes_ui.all_disabilities')}</option>
            {uniqueDisabilities.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            aria-label={t('schemes.state')}
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm font-medium"
          >
            <option value="">{t('schemes_ui.all_states')}</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {hasFilters && (
            <SecondaryButton type="button" onClick={clearFilters} className="text-xs px-3 py-2">
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t('schemes_ui.clear_filters')}</span>
            </SecondaryButton>
          )}
        </div>
      </Card>

      <div aria-live="polite" className="text-sm font-medium text-[var(--ink-muted)]">
        {!loading && !error && t('schemes_ui.results_count', { count: filteredItems.length })}
      </div>

      {loading ? (
        <StateMessage kind="loading" />
      ) : error ? (
        <StateMessage kind="error" onRetry={handleRetry} />
      ) : filteredItems.length === 0 ? (
        <StateMessage
          kind="empty"
          title={t('schemes_ui.empty_title')}
          description={t('schemes_ui.empty_desc')}
          onRetry={hasFilters ? clearFilters : handleRetry}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(({ scheme, reason }) => (
            <SchemeCard key={scheme.id} scheme={scheme} matchReason={reason} />
          ))}
        </div>
      )}
    </div>
  )
}

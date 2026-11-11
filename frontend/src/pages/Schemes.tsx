import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, type Scheme } from '../lib/api'

export function Schemes() {
  const { t, i18n } = useTranslation()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDisability, setSelectedDisability] = useState('all')
  const [selectedState, setSelectedState] = useState('All')
  const [simplifiedTexts, setSimplifiedTexts] = useState<Record<string, string>>({})
  const [simplifyingId, setSimplifyingId] = useState<string | null>(null)

  // Eligibility Checker State
  const [showChecker, setShowChecker] = useState(false)
  const [checkerDisability, setCheckerDisability] = useState('locomotor')
  const [checkerAge, setCheckerAge] = useState(25)
  const [checkerState, setCheckerState] = useState('Telangana')
  const [checkerIncome, setCheckerIncome] = useState('under_2_lakh')
  const [checkerLoading, setCheckerLoading] = useState(false)

  useEffect(() => {
    api.getSchemes()
      .then((data) => setSchemes(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSimplify = async (scheme: Scheme) => {
    setSimplifyingId(scheme.id)
    try {
      const res = await api.simplifyText(scheme.eligibility + ' ' + scheme.benefits, i18n.language)
      setSimplifiedTexts((prev) => ({ ...prev, [scheme.id]: res.simplified }))
    } catch {
      setSimplifiedTexts((prev) => ({ ...prev, [scheme.id]: scheme.simplified }))
    } finally {
      setSimplifyingId(null)
    }
  }

  const handleRunEligibilityChecker = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckerLoading(true)
    try {
      const matched = await api.matchSchemes({
        disability_type: checkerDisability,
        age: checkerAge,
        state: checkerState,
        income_range: checkerIncome,
      })
      setSchemes(matched)
      setShowChecker(false)
    } finally {
      setCheckerLoading(false)
    }
  }

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.eligibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.benefits.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDisability =
      selectedDisability === 'all' || s.disability_type === 'all' || s.disability_type === selectedDisability

    const matchesState =
      selectedState === 'All' || s.state === 'All India' || s.state === selectedState

    return matchesSearch && matchesDisability && matchesState
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-100">
            {t('schemes.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            {t('schemes.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowChecker(!showChecker)}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer shadow-md flex items-center gap-2"
        >
          <span>📋</span>
          <span>{showChecker ? 'Hide Checker' : t('schemes.eligibility_checker')}</span>
        </button>
      </header>

      {/* Quick Eligibility Checker Modal / Drawer */}
      {showChecker && (
        <section
          aria-label="Eligibility Questionaire"
          className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-500 shadow-lg flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
              <span>🎯</span>
              <span>{t('schemes.eligibility_checker')}</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowChecker(false)}
              className="text-emerald-900 dark:text-emerald-200 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleRunEligibilityChecker} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="chk-disability" className="block text-xs font-bold uppercase mb-1">
                {t('schemes.filter_disability')}
              </label>
              <select
                id="chk-disability"
                value={checkerDisability}
                onChange={(e) => setCheckerDisability(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-sm font-semibold"
              >
                <option value="locomotor">Locomotor / Physical</option>
                <option value="vision">Visual Impairment</option>
                <option value="hearing">Hearing Impairment</option>
                <option value="intellectual">Intellectual Disability</option>
              </select>
            </div>

            <div>
              <label htmlFor="chk-age" className="block text-xs font-bold uppercase mb-1">
                {t('schemes.age')}
              </label>
              <input
                id="chk-age"
                type="number"
                min="1"
                max="100"
                value={checkerAge}
                onChange={(e) => setCheckerAge(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-sm font-semibold"
              />
            </div>

            <div>
              <label htmlFor="chk-state" className="block text-xs font-bold uppercase mb-1">
                {t('schemes.state')}
              </label>
              <select
                id="chk-state"
                value={checkerState}
                onChange={(e) => setCheckerState(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-sm font-semibold"
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <div>
              <label htmlFor="chk-income" className="block text-xs font-bold uppercase mb-1">
                {t('schemes.income')}
              </label>
              <select
                id="chk-income"
                value={checkerIncome}
                onChange={(e) => setCheckerIncome(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-sm font-semibold"
              >
                <option value="under_1_lakh">Below ₹1,00,000</option>
                <option value="under_2_lakh">₹1,00,000 - ₹2,50,000</option>
                <option value="above_2_lakh">Above ₹2,50,000</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-4 flex justify-end">
              <button
                type="submit"
                disabled={checkerLoading}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm cursor-pointer shadow disabled:opacity-50"
              >
                {checkerLoading ? 'Matching...' : t('schemes.check_btn')}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Search & Filter Controls */}
      <section
        aria-label="Filter welfare schemes"
        className="flex flex-wrap items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-300 dark:border-neutral-700"
      >
        <div className="flex-1 min-w-[240px]">
          <label htmlFor="search-schemes" className="sr-only">
            Search Schemes
          </label>
          <input
            id="search-schemes"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('schemes.search_placeholder')}
            className="w-full min-h-[44px] px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filter-disability-select" className="text-sm font-semibold">
            {t('schemes.filter_disability')}:
          </label>
          <select
            id="filter-disability-select"
            value={selectedDisability}
            onChange={(e) => setSelectedDisability(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm font-semibold"
          >
            <option value="all">All Disabilities</option>
            <option value="locomotor">Locomotor</option>
            <option value="vision">Vision</option>
            <option value="hearing">Hearing</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filter-state" className="text-sm font-semibold">
            {t('schemes.state')}:
          </label>
          <select
            id="filter-state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm font-semibold"
          >
            <option value="All">All Regions</option>
            <option value="All India">National / Central</option>
            <option value="Telangana">Telangana</option>
          </select>
        </div>
      </section>

      {/* Schemes Grid */}
      <section aria-labelledby="schemes-list-heading" className="flex flex-col gap-4">
        <h2 id="schemes-list-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Available Schemes ({filteredSchemes.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-500 animate-pulse">
            Loading government welfare schemes...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map((s) => (
              <article
                key={s.id}
                className="p-6 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {s.name}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap">
                      🏛️ {s.state}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 text-sm">
                    <div>
                      <strong className="text-neutral-700 dark:text-neutral-300">
                        Eligibility:
                      </strong>{' '}
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {s.eligibility}
                      </span>
                    </div>

                    <div>
                      <strong className="text-neutral-700 dark:text-neutral-300">
                        Benefits:
                      </strong>{' '}
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {s.benefits}
                      </span>
                    </div>
                  </div>

                  {simplifiedTexts[s.id] && (
                    <div
                      role="region"
                      aria-label="Simplified summary"
                      className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg text-sm text-amber-900 dark:text-amber-200"
                    >
                      <strong className="block text-xs uppercase tracking-wider mb-1">
                        ✨ Simplified Explanation:
                      </strong>
                      {simplifiedTexts[s.id]}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleSimplify(s)}
                    disabled={simplifyingId === s.id}
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer disabled:opacity-50"
                  >
                    {simplifyingId === s.id ? 'Simplifying...' : t('schemes.simplify_btn')}
                  </button>

                  <a
                    href={s.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <span>{t('schemes.apply_now')}</span>
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">, opens official portal in a new tab</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

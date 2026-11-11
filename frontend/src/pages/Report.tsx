import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, type ReportItem } from '../lib/api'
import { Toast } from '../components/Toast'
import { useGeolocation } from '../hooks/useGeolocation'

export function Report() {
  const { t } = useTranslation()
  const { coords, getLocation } = useGeolocation()
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [issueType, setIssueType] = useState('Broken Ramp')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    api.getReports()
      .then((data) => setReports(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setSubmitting(true)
    try {
      const res = await api.createReport({
        issue_type: issueType,
        description,
        lat: coords.lat,
        lng: coords.lng,
      })
      if (res.success) {
        setReports((prev) => [
          {
            id: res.id,
            issue_type: issueType,
            description,
            lat: coords.lat,
            lng: coords.lng,
            status: 'open',
            upvotes: 1,
            created_at: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ])
        setDescription('')
        setToastMessage('Report submitted successfully! Thank you for contributing.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpvote = async (id: string) => {
    await api.upvoteReport(id)
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <header>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-100">
          {t('report.title')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
          {t('report.subtitle')}
        </p>
      </header>

      {/* Report Form */}
      <section
        aria-labelledby="submit-report-heading"
        className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700 shadow-sm"
      >
        <h2 id="submit-report-heading" className="text-xl font-bold mb-4">
          Report an Accessibility Barrier
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="issue-type-select" className="block text-sm font-semibold mb-1">
              {t('report.issue_type')}
            </label>
            <select
              id="issue-type-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-sm font-medium"
            >
              <option value="Broken Ramp">Broken or Missing Ramp</option>
              <option value="Blocked Tactile Paving">Blocked Tactile Paving</option>
              <option value="Broken Elevator">Inoperative Elevator</option>
              <option value="Auditory Signal Malfunction">Auditory Crossing Signal Malfunction</option>
              <option value="Steep Step Obstacle">Entrance Lacks Wheelchair Clearance</option>
            </select>
          </div>

          <div>
            <label htmlFor="issue-desc" className="block text-sm font-semibold mb-1">
              {t('report.description')}
            </label>
            <textarea
              id="issue-desc"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact landmark and details of the obstacle..."
              className="w-full p-3 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-sm font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={getLocation}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>📍 GPS Attached: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] px-6 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : t('report.submit')}
            </button>
          </div>
        </form>
      </section>

      {/* Community Reports Feed */}
      <section aria-labelledby="community-feed-heading" className="flex flex-col gap-4">
        <h2 id="community-feed-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Recent Community Reports ({reports.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-500 animate-pulse">
            Loading community reports...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reports.map((r) => (
              <article
                key={r.id}
                className="p-5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                      {r.issue_type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold border ${
                        r.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {r.status === 'resolved' ? t('report.status_resolved') : t('report.status_open')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {r.description}
                  </p>
                  <span className="text-xs text-neutral-500 mt-1 block">
                    Reported on {r.created_at} • Coordinates: {r.lat}, {r.lng}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpvote(r.id)}
                  aria-label={`Upvote issue: ${r.issue_type}. Current upvotes: ${r.upvotes}`}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
                >
                  <span>▲</span>
                  <span>{r.upvotes}</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

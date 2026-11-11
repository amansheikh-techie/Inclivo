import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  ArrowBigUp,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  X,
} from 'lucide-react'
import { api, useDemoData, type ReportItem } from '../lib/api'
import { useGeolocation } from '../hooks/useGeolocation'
import { Toast } from '../components/Toast'
import {
  ActionButton,
  Card,
  DemoBanner,
  SecondaryButton,
  StateMessage,
} from '../components/ui'

export function Report() {
  const { t } = useTranslation()
  const { coords, getLocation } = useGeolocation()
  const isDemo = useDemoData()

  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [issueType, setIssueType] = useState('Broken / Missing Ramp')
  const [description, setDescription] = useState('')
  const [descError, setDescError] = useState<string | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  const issueOptions = [
    { value: 'Broken / Missing Ramp', label: t('report_ui.issue_broken_ramp') },
    { value: 'Elevator Out of Order', label: t('report_ui.issue_elevator_out') },
    { value: 'Blocked Tactile Path', label: t('report_ui.issue_blocked_path') },
    { value: 'Accessible Washroom Locked', label: t('report_ui.issue_washroom_locked') },
    { value: 'Faulty Audio Pedestrian Signal', label: t('report_ui.issue_audio_signal') },
    { value: 'Steep Step Obstacle', label: t('report_ui.issue_entrance') },
  ]

  useEffect(() => {
    let active = true
    api
      .getReports()
      .then((data) => {
        if (active) setReports(data)
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
      .getReports()
      .then((data) => setReports(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanDesc = description.trim()
    if (cleanDesc.length < 10) {
      setDescError(t('report_ui.validation_desc'))
      return
    }
    setDescError(null)
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('issue_type', issueType)
      formData.append('description', cleanDesc)
      formData.append('lat', String(coords.lat))
      formData.append('lng', String(coords.lng))
      if (photo) {
        formData.append('photo', photo)
      }

      const created = await api.createReport(formData)
      setReports((prev) => [created, ...prev])
      setDescription('')
      setPhoto(null)
      setToast({ message: t('report_ui.submit_success'), type: 'success' })
    } catch {
      setToast({ message: t('report_ui.submit_error'), type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpvote = async (id: string) => {
    try {
      const updated = await api.upvoteReport(id)
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: updated.upvotes } : r)),
      )
    } catch {
      setToast({ message: t('report_ui.upvote_error'), type: 'error' })
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {isDemo && <DemoBanner />}

      <header>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          {t('report.title')}
        </h1>
        <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-1">
          {t('report.subtitle')}
        </p>
      </header>

      <Card>
        <form
          onSubmit={handleSubmit}
          aria-labelledby="report-form-heading"
          noValidate
          className="flex flex-col gap-4"
        >
          <h2 id="report-form-heading" className="text-lg font-bold text-[var(--ink)]">
            {t('report_ui.form_heading')}
          </h2>

          <div>
            <label htmlFor="issue-type" className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
              {t('report.issue_type')}
            </label>
            <select
              id="issue-type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm font-medium"
            >
              {issueOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="issue-desc" className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
              {t('report.description')}
            </label>
            <textarea
              id="issue-desc"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (descError) setDescError(null)
              }}
              aria-invalid={Boolean(descError)}
              aria-describedby={descError ? 'issue-desc-error' : undefined}
              placeholder={t('report_ui.desc_placeholder')}
              className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm placeholder:text-[var(--ink-muted)]"
            />
            {descError && (
              <p
                id="issue-desc-error"
                role="alert"
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--danger-ink)]"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{descError}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="min-h-[44px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer transition-colors">
              <Camera className="w-4 h-4 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
              <span>{t('report_ui.photo_label')}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="sr-only"
              />
            </label>

            {photo && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-xs font-medium text-[var(--ink)]">
                <span className="truncate max-w-[180px]">{photo.name}</span>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  aria-label={t('report_ui.photo_remove')}
                  className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center rounded-lg hover:bg-[var(--surface)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
            <SecondaryButton type="button" onClick={getLocation} className="text-xs">
              <MapPin className="w-4 h-4 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
              <span>
                {t('report_ui.gps_attached')}: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </SecondaryButton>

            <ActionButton type="submit" disabled={submitting}>
              <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{submitting ? t('report_ui.submitting') : t('report.submit')}</span>
            </ActionButton>
          </div>
        </form>
      </Card>

      <section aria-labelledby="community-feed-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h2 id="community-feed-heading" className="text-xl font-bold text-[var(--ink)]">
            {t('report_ui.feed_heading')} ({reports.length})
          </h2>
        </div>

        {loading ? (
          <StateMessage kind="loading" />
        ) : error ? (
          <StateMessage kind="error" onRetry={handleRetry} />
        ) : reports.length === 0 ? (
          <StateMessage kind="empty" title={t('report_ui.empty_reports')} />
        ) : (
          <div className="flex flex-col gap-3">
            {reports.map((r) => {
              const resolved = r.status === 'resolved'
              return (
                <Card
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-[var(--ink)]">
                        {r.issue_type}
                      </h3>
                      <span
                        data-accent-fill={resolved ? 'true' : undefined}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          resolved
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent'
                            : 'bg-[var(--warn-bg)] text-[var(--warn-ink)] border-[var(--warn-border)]'
                        }`}
                      >
                        {resolved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        )}
                        <span>
                          {resolved ? t('report.status_resolved') : t('report.status_open')}
                        </span>
                      </span>
                    </div>

                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {r.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--ink-muted)] pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          {t('report_ui.reported_on')} {r.created_at}
                        </span>
                      </span>
                      {r.lat != null && r.lng != null && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>
                            {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <SecondaryButton
                    type="button"
                    onClick={() => void handleUpvote(r.id)}
                    aria-label={t('report_ui.upvote_aria', {
                      issue: r.issue_type,
                      count: r.upvotes,
                    })}
                    className="self-start sm:self-center shrink-0"
                  >
                    <ArrowBigUp className="w-4 h-4 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
                    <span>{r.upvotes}</span>
                  </SecondaryButton>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

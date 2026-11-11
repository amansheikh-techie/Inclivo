import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2,
  ExternalLink,
  Gift,
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { api, type Scheme } from '../lib/api'
import { Card, SecondaryButton } from './ui'

interface SchemeCardProps {
  scheme: Scheme
  matchReason?: string
}

export function SchemeCard({ scheme, matchReason }: SchemeCardProps) {
  const { t, i18n } = useTranslation()
  const [simplified, setSimplified] = useState<string | null>(null)
  const [simplifying, setSimplifying] = useState(false)

  const localizedName =
    i18n.language === 'hi' && scheme.name_hi
      ? scheme.name_hi
      : i18n.language === 'te' && scheme.name_te
        ? scheme.name_te
        : i18n.language === 'ta' && scheme.name_ta
          ? scheme.name_ta
          : scheme.display_name || scheme.name

  const handleSimplify = async () => {
    setSimplifying(true)
    try {
      const sourceText = [
        localizedName,
        scheme.benefits ? `${t('schemes_ui.benefits_label')}: ${scheme.benefits}` : '',
        scheme.eligibility ? `${t('schemes_ui.eligibility_label')}: ${scheme.eligibility}` : '',
      ]
        .filter(Boolean)
        .join('. ')
      const res = await api.simplifyText(sourceText, i18n.language)
      setSimplified(res.simplified)
    } catch {
      setSimplified(scheme.benefits || scheme.eligibility || localizedName)
    } finally {
      setSimplifying(false)
    }
  }

  return (
    <Card className="flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              {scheme.state && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--ink)]">
                  <MapPin className="w-3 h-3 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
                  <span>{scheme.state}</span>
                </span>
              )}
              {scheme.disability_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--accent-text)]">
                  {scheme.disability_type}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-[var(--ink)] leading-snug pt-0.5">
              {localizedName}
            </h3>
          </div>

          {matchReason && (
            <span
              data-accent-fill="true"
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--accent-ink)]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t('schemes_ui.eligibility_badge')}</span>
            </span>
          )}
        </div>

        {scheme.benefits && (
          <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-xs space-y-1">
            <p className="font-bold text-[var(--ink)] inline-flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
              <span>{t('schemes_ui.benefits_label')}</span>
            </p>
            <p className="text-[var(--ink-muted)] leading-relaxed">{scheme.benefits}</p>
          </div>
        )}

        {scheme.eligibility && (
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
            <strong className="text-[var(--ink)]">{t('schemes_ui.eligibility_label')}:</strong>{' '}
            {scheme.eligibility}
          </p>
        )}

        {matchReason && (
          <p className="text-xs font-medium text-[var(--accent-text)]">
            {matchReason}
          </p>
        )}

        {simplified && (
          <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--accent)] text-sm space-y-1">
            <p className="text-xs font-bold text-[var(--accent-text)] inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('schemes_ui.simple_summary')}</span>
            </p>
            <p className="text-[var(--ink)] leading-relaxed">{simplified}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
        <SecondaryButton
          type="button"
          onClick={() => void handleSimplify()}
          disabled={simplifying}
          className="flex-1 text-xs"
        >
          {simplifying ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
          ) : (
            <Sparkles className="w-4 h-4 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
          )}
          <span>
            {simplifying ? t('schemes_ui.simplifying') : t('schemes.simplify_btn')}
          </span>
        </SecondaryButton>

        {scheme.apply_url && (
          <a
            href={scheme.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--action)] hover:bg-[var(--action-hover)] text-[var(--action-ink)] text-xs font-semibold transition-colors"
          >
            <span>{t('schemes.apply_now')}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        )}
      </div>
    </Card>
  )
}

import { useTranslation } from 'react-i18next'
import {
  BadgeCheck,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Star,
  Users,
} from 'lucide-react'
import type { Washroom } from '../lib/api'
import { Card } from './ui'

interface WashroomCardProps {
  washroom: Washroom
}

export function WashroomCard({ washroom }: WashroomCardProps) {
  const { t } = useTranslation()
  const osmUrl = `https://www.openstreetmap.org/directions?to=${washroom.lat},${washroom.lng}`

  return (
    <Card className="flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[var(--ink)] leading-snug">
            {washroom.name}
          </h3>

          <span
            data-accent-fill={washroom.verified ? 'true' : undefined}
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
              washroom.verified
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent'
                : 'bg-[var(--surface-muted)] text-[var(--ink)] border-[var(--border)]'
            }`}
          >
            {washroom.verified ? (
              <BadgeCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {washroom.verified ? t('washrooms.verified') : t('washrooms.unverified')}
            </span>
          </span>
        </div>

        <p className="inline-flex items-start gap-1.5 text-xs text-[var(--ink-muted)]">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--accent-text)]" aria-hidden="true" />
          <span>{washroom.address || t('finder.address_unavailable')}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs font-semibold text-[var(--ink)]">
            <Star className="w-3.5 h-3.5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
            <span>
              {washroom.cleanliness_rating != null
                ? `${t('washrooms.rating')}: ${washroom.cleanliness_rating.toFixed(1)}/5`
                : t('finder.no_rating')}
            </span>
          </span>

          {washroom.distance_km != null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs font-medium text-[var(--ink)]">
              <Navigation className="w-3.5 h-3.5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
              <span>{t('finder.distance_away', { km: washroom.distance_km.toFixed(1) })}</span>
            </span>
          )}
        </div>

        {washroom.last_verified && (
          <p className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              {t('washrooms.last_checked')}: {washroom.last_verified}
            </span>
          </p>
        )}
      </div>

      <a
        href={osmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--action)] hover:bg-[var(--action-hover)] text-[var(--action-ink)] text-sm font-semibold transition-colors"
      >
        <span>{t('places.get_directions')}</span>
        <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
      </a>
    </Card>
  )
}

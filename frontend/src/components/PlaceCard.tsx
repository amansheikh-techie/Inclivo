import { useTranslation } from 'react-i18next'
import {
  Accessibility,
  ArrowUpDown,
  Award,
  Check,
  CircleParking,
  ExternalLink,
  MapPin,
  Navigation,
  Star,
  TrendingUp,
  VolumeX,
} from 'lucide-react'
import type { Place } from '../lib/api'
import { Card } from './ui'

interface PlaceCardProps {
  place: Place
  activeFilters?: string[]
  onToggleFeature?: (featureKey: string) => void
  isSelected?: boolean
  onSelect?: () => void
}

export function PlaceCard({
  place,
  activeFilters,
  onToggleFeature,
  isSelected,
  onSelect,
}: PlaceCardProps) {
  const { t } = useTranslation()

  const features = [
    place.wheelchair_friendly && {
      key: 'wheelchair',
      label: t('places.filter_wheelchair'),
      icon: Accessibility,
    },
    place.has_ramp && {
      key: 'ramp',
      label: t('places.filter_ramp'),
      icon: TrendingUp,
    },
    place.has_elevator && {
      key: 'elevator',
      label: t('places.filter_elevator'),
      icon: ArrowUpDown,
    },
    place.accessible_parking && {
      key: 'parking',
      label: t('places.filter_parking'),
      icon: CircleParking,
    },
    place.quiet && {
      key: 'quiet',
      label: t('places.filter_quiet'),
      icon: VolumeX,
    },
  ].filter(Boolean) as { key: string; label: string; icon: typeof Accessibility }[]

  const highScore = place.accessibility_score >= 80
  const osmUrl = `https://www.openstreetmap.org/directions?to=${place.lat},${place.lng}`

  return (
    <Card
      className={`flex flex-col justify-between gap-4 transition-all duration-150 ${
        isSelected
          ? 'ring-2 ring-[var(--action)] border-[var(--action)] shadow-lg'
          : 'hover:border-[var(--border-hover,var(--action))]'
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-text)]">
              {place.category}
            </span>
            <h3 className="text-lg font-bold text-[var(--ink)] leading-snug mt-0.5">
              {place.name}
            </h3>
          </div>

          <span
            data-accent-fill={highScore ? 'true' : undefined}
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
              highScore
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent'
                : 'bg-[var(--surface-muted)] text-[var(--ink)] border-[var(--border)]'
            }`}
            aria-label={`${t('places.accessibility_score')}: ${place.accessibility_score}/100`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{place.accessibility_score}/100</span>
          </span>
        </div>

        {(place.address || place.distance_km != null || place.rating != null) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--ink-muted)]">
            {place.address && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
                <span>{place.address}</span>
              </span>
            )}
            {place.distance_km != null && (
              <span className="inline-flex items-center gap-1 font-medium text-[var(--ink)]">
                <Navigation className="w-3.5 h-3.5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
                <span>{t('finder.distance_away', { km: place.distance_km.toFixed(1) })}</span>
              </span>
            )}
            {place.rating != null && (
              <span className="inline-flex items-center gap-1 font-medium text-[var(--ink)]">
                <Star className="w-3.5 h-3.5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
                <span>{place.rating.toFixed(1)}</span>
              </span>
            )}
          </div>
        )}

        {features.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label={t('places.accessibility_score')}>
            {features.map(({ key, label, icon: Icon }) => {
              const isHighlighted = Boolean(activeFilters?.includes(key))
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={(e) => {
                      if (onToggleFeature) {
                        e.stopPropagation()
                        onToggleFeature(key)
                      }
                    }}
                    title={onToggleFeature ? `Toggle ${label}` : label}
                    aria-pressed={isHighlighted}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isHighlighted
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] border border-[var(--primary)] shadow-sm ring-2 ring-[var(--action)] scale-[1.03]'
                        : 'bg-[var(--surface-muted)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--accent)]'
                    } ${onToggleFeature ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isHighlighted ? 'text-[var(--accent-ink)]' : 'text-[var(--accent-text)]'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                    {isHighlighted && (
                      <Check className="w-3 h-3 shrink-0 stroke-[2.5]" aria-hidden="true" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {place.score_breakdown && place.score_breakdown.length > 0 && (
          <div className="pt-1">
            <p className="text-xs font-semibold text-[var(--ink-muted)] mb-1">
              {t('finder.score_breakdown')}
            </p>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              {place.score_breakdown.join(' • ')}
            </p>
          </div>
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

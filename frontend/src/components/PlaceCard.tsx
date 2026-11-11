import { useTranslation } from 'react-i18next'
import type { Place } from '../lib/api'

interface PlaceCardProps {
  place: Place
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { t } = useTranslation()

  const osmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(
    '17.3850,78.4867'
  )}%3B${encodeURIComponent(`${place.lat},${place.lng}`)}`

  return (
    <article className="p-5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-sm flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              {place.category}
            </span>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {place.name}
            </h3>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-700"
            aria-label={`${t('places.accessibility_score')}: ${place.accessibility_score} out of 100`}
          >
            <span aria-hidden="true">★</span>
            <span>{place.accessibility_score}/100</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mt-2 font-mono">
          📍 {place.address}
        </p>

        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Available accessibility features">
          <span
            role="listitem"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border ${
              place.has_ramp
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-neutral-100 text-neutral-500 border-neutral-200 line-through dark:bg-neutral-800'
            }`}
          >
            <span>{place.has_ramp ? '✓' : '✗'}</span>
            <span>{t('places.filter_ramp')}</span>
          </span>

          <span
            role="listitem"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border ${
              place.has_elevator
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-neutral-100 text-neutral-500 border-neutral-200 line-through dark:bg-neutral-800'
            }`}
          >
            <span>{place.has_elevator ? '✓' : '✗'}</span>
            <span>{t('places.filter_elevator')}</span>
          </span>

          <span
            role="listitem"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border ${
              place.accessible_parking
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-neutral-100 text-neutral-500 border-neutral-200 line-through dark:bg-neutral-800'
            }`}
          >
            <span>{place.accessible_parking ? '✓' : '✗'}</span>
            <span>{t('places.filter_parking')}</span>
          </span>

          <span
            role="listitem"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border ${
              place.wheelchair_friendly
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-neutral-100 text-neutral-500 border-neutral-200 line-through dark:bg-neutral-800'
            }`}
          >
            <span>{place.wheelchair_friendly ? '✓' : '✗'}</span>
            <span>♿ {t('places.filter_wheelchair')}</span>
          </span>

          {place.quiet && (
            <span
              role="listitem"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200"
            >
              <span>✓ 🤫 {t('places.filter_quiet')}</span>
            </span>
          )}

          {place.distance_km != null && (
            <span
              role="listitem"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300"
            >
              📍 {place.distance_km} km away
            </span>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full px-4 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold text-sm hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span>🗺️ {t('places.get_directions')}</span>
          <span className="sr-only">, opens in new tab</span>
        </a>
      </div>
    </article>
  )
}

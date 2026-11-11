import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, type Washroom } from '../lib/api'
import { MapView } from '../components/MapView'
import { useGeolocation } from '../hooks/useGeolocation'

export function Washrooms() {
  const { t } = useTranslation()
  const { coords, loading: geoLoading, getLocation } = useGeolocation()
  const [washrooms, setWashrooms] = useState<Washroom[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'rating' | 'verified'>('rating')

  useEffect(() => {
    api.getWashrooms()
      .then((data) => setWashrooms(data))
      .finally(() => setLoading(false))
  }, [])

  const sortedWashrooms = [...washrooms].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'verified') return (b.verified ? 1 : 0) - (a.verified ? 1 : 0)
    return 0
  })

  const markers = sortedWashrooms.map((w) => ({
    id: w.id,
    lat: w.lat,
    lng: w.lng,
    title: w.name,
    subtitle: `Rating: ${w.rating}/5.0 • ${w.verified ? 'Verified' : 'Community'}`,
    badge: `★ ${w.rating}`,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-100">
            {t('washrooms.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            {t('washrooms.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-washrooms" className="text-sm font-semibold">
            Sort by:
          </label>
          <select
            id="sort-washrooms"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="min-h-[44px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold"
          >
            <option value="rating">{t('washrooms.sort_rating')}</option>
            <option value="verified">{t('washrooms.verified')}</option>
          </select>

          <button
            type="button"
            onClick={getLocation}
            disabled={geoLoading}
            className="min-h-[44px] px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>🎯</span>
            <span>{geoLoading ? 'Locating...' : 'Near Me'}</span>
          </button>
        </div>
      </header>

      {/* Map */}
      <MapView center={[coords.lat, coords.lng]} markers={markers} />

      {/* Washrooms Cards Grid */}
      <section aria-labelledby="washrooms-list-heading" className="flex flex-col gap-4">
        <h2 id="washrooms-list-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Accessible Restrooms ({sortedWashrooms.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-500 animate-pulse">
            Loading accessible restrooms...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedWashrooms.map((w) => {
              const osmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(
                '17.3850,78.4867'
              )}%3B${encodeURIComponent(`${w.lat},${w.lng}`)}`

              return (
                <article
                  key={w.id}
                  className="p-5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-sm flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {w.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        ★ {w.rating}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 mt-1 font-mono">
                      📍 {w.address}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border ${
                          w.verified
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        <span>{w.verified ? '✓' : 'ℹ️'}</span>
                        <span>{w.verified ? t('washrooms.verified') : t('washrooms.unverified')}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border bg-blue-50 text-blue-900 border-blue-200">
                        <span>♿ Wheelchair: {w.wheelchair_friendly ? 'Yes' : 'No'}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border bg-purple-50 text-purple-900 border-purple-200">
                        <span>Fee: {w.fee}</span>
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 mt-3">
                      {t('washrooms.last_checked')}: {w.last_verified}
                    </p>
                  </div>

                  <a
                    href={osmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2.5 rounded-lg bg-teal-800 text-white font-bold text-sm text-center hover:bg-teal-900 flex items-center justify-center gap-2"
                  >
                    <span>🧭 Directions (OSM)</span>
                    <span className="sr-only">, opens in new window</span>
                  </a>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

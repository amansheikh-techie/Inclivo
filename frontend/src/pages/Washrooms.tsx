import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BadgeCheck,
  LocateFixed,
  Navigation,
  RotateCcw,
  Star,
} from 'lucide-react'
import { api, useDemoData, type Washroom } from '../lib/api'
import { useGeolocation } from '../hooks/useGeolocation'
import { MapView } from '../components/MapView'
import { WashroomCard } from '../components/WashroomCard'
import {
  ActionButton,
  Card,
  DemoBanner,
  FilterChip,
  SecondaryButton,
  StateMessage,
  ViewModeToggle,
} from '../components/ui'

type SortKey = 'rating' | 'verified' | 'distance'

export function Washrooms() {
  const { t } = useTranslation()
  const { coords, hasLocation, loading: geoLoading, getLocation } = useGeolocation()
  const isDemo = useDemoData()

  const [washrooms, setWashrooms] = useState<Washroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('rating')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = hasLocation
      ? { lat: coords.lat, lng: coords.lng, radius_km: 5 }
      : undefined
    api
      .getWashrooms(params)
      .then((data) => setWashrooms(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [hasLocation, coords.lat, coords.lng])

  useEffect(() => {
    let active = true
    const params = hasLocation
      ? { lat: coords.lat, lng: coords.lng, radius_km: 5 }
      : undefined
    api
      .getWashrooms(params)
      .then((data) => {
        if (active) setWashrooms(data)
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
  }, [hasLocation, coords.lat, coords.lng])

  const filtered = washrooms
    .filter((w) => (verifiedOnly ? w.verified : true))
    .slice()
    .sort((a, b) => {
      if (sortBy === 'verified') {
        if (a.verified !== b.verified) return a.verified ? -1 : 1
        return (b.cleanliness_rating ?? 0) - (a.cleanliness_rating ?? 0)
      }
      if (sortBy === 'distance') {
        return (a.distance_km ?? 9999) - (b.distance_km ?? 9999)
      }
      return (b.cleanliness_rating ?? 0) - (a.cleanliness_rating ?? 0)
    })

  const selectedWashroom =
    filtered.find((w) => w.id === selectedId) || filtered[0] || null

  const markers = filtered.map((w) => ({
    id: w.id,
    lat: w.lat,
    lng: w.lng,
    title: w.name,
    subtitle:
      w.cleanliness_rating != null
        ? `${t('washrooms.rating')}: ${w.cleanliness_rating.toFixed(1)}/5`
        : t('finder.no_rating'),
    badge: w.verified ? t('washrooms.verified') : t('washrooms.unverified'),
  }))

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner />}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            {t('washrooms.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-1">
            {t('washrooms.subtitle')}
          </p>
        </div>

        <ActionButton
          type="button"
          onClick={() => {
            setSortBy('distance')
            getLocation()
          }}
          disabled={geoLoading}
        >
          <LocateFixed className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{geoLoading ? t('finder.locating') : t('places.near_me')}</span>
        </ActionButton>
      </header>

      {/* Filter, Sort & View Toggle Bar */}
      <section
        aria-label={t('finder.sort_label')}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 sm:p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            active={verifiedOnly}
            onClick={() => setVerifiedOnly((v) => !v)}
            icon={<BadgeCheck className="w-4 h-4" />}
            label={t('finder.verified_only')}
          />
          <FilterChip
            active={sortBy === 'rating'}
            onClick={() => setSortBy('rating')}
            icon={<Star className="w-4 h-4" />}
            label={t('washrooms.sort_rating')}
          />
          <FilterChip
            active={sortBy === 'verified'}
            onClick={() => setSortBy('verified')}
            icon={<BadgeCheck className="w-4 h-4" />}
            label={t('washrooms.verified')}
          />
          <FilterChip
            active={sortBy === 'distance'}
            onClick={() => setSortBy('distance')}
            icon={<Navigation className="w-4 h-4" />}
            label={t('washrooms.sort_distance')}
          />

          {verifiedOnly && (
            <SecondaryButton
              type="button"
              onClick={() => setVerifiedOnly(false)}
              className="px-3 py-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t('finder.clear_filters')}</span>
            </SecondaryButton>
          )}
        </div>

        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </section>

      <div aria-live="polite" className="text-sm font-medium text-[var(--ink-muted)]">
        {!loading && !error && t('finder.results_count', { count: filtered.length })}
      </div>

      {loading ? (
        <StateMessage kind="loading" />
      ) : error ? (
        <StateMessage kind="error" onRetry={handleRetry} />
      ) : filtered.length === 0 ? (
        <StateMessage
          kind="empty"
          title={t('finder.washrooms_empty')}
          onRetry={verifiedOnly ? () => setVerifiedOnly(false) : handleRetry}
        />
      ) : (
        <>
          {viewMode === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapView
                  center={[coords.lat, coords.lng]}
                  markers={markers}
                  onMarkerSelect={(id) => setSelectedId(id)}
                  ariaLabel={t('finder.map_aria')}
                />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-[var(--ink)]">
                  {t('finder.selected_location')}
                </h2>
                {selectedWashroom ? (
                  <WashroomCard washroom={selectedWashroom} />
                ) : (
                  <Card>
                    <p className="text-sm text-[var(--ink-muted)]">
                      {t('finder.select_pin_hint')}
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}

          <section aria-labelledby="all-washrooms-heading" className="flex flex-col gap-4">
            <h2
              id="all-washrooms-heading"
              className="text-xl font-bold text-[var(--ink)]"
            >
              {t('finder.all_washrooms')} ({filtered.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((w) => (
                <WashroomCard key={w.id} washroom={w} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

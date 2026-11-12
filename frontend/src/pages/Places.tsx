import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Accessibility,
  ArrowUpDown,
  CircleParking,
  LocateFixed,
  RotateCcw,
  TrendingUp,
  VolumeX,
} from 'lucide-react'
import { api, useDemoData, type Place } from '../lib/api'
import { useGeolocation } from '../hooks/useGeolocation'
import { MapView } from '../components/MapView'
import { PlaceCard } from '../components/PlaceCard'
import {
  ActionButton,
  Card,
  DemoBanner,
  FilterChip,
  SecondaryButton,
  StateMessage,
  ViewModeToggle,
} from '../components/ui'

export function Places() {
  const { t } = useTranslation()
  const { coords, hasLocation, loading: geoLoading, getLocation } = useGeolocation()
  const isDemo = useDemoData()

  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const [filterRamp, setFilterRamp] = useState(false)
  const [filterElevator, setFilterElevator] = useState(false)
  const [filterParking, setFilterParking] = useState(false)
  const [filterWheelchair, setFilterWheelchair] = useState(false)
  const [filterQuiet, setFilterQuiet] = useState(false)

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = hasLocation
      ? { lat: coords.lat, lng: coords.lng, radius_km: 5 }
      : undefined
    api
      .getPlaces(params)
      .then((data) => setPlaces(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [hasLocation, coords.lat, coords.lng])

  useEffect(() => {
    let active = true
    const params = hasLocation
      ? { lat: coords.lat, lng: coords.lng, radius_km: 5 }
      : undefined
    api
      .getPlaces(params)
      .then((data) => {
        if (active) setPlaces(data)
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

  const hasActiveFilters =
    filterWheelchair || filterRamp || filterElevator || filterParking || filterQuiet

  const clearFilters = () => {
    setFilterWheelchair(false)
    setFilterRamp(false)
    setFilterElevator(false)
    setFilterParking(false)
    setFilterQuiet(false)
  }

  const filteredPlaces = places
    .filter((p) => {
      if (filterRamp && !p.has_ramp) return false
      if (filterElevator && !p.has_elevator) return false
      if (filterParking && !p.accessible_parking) return false
      if (filterWheelchair && !p.wheelchair_friendly) return false
      if (filterQuiet && !p.quiet) return false
      return true
    })
    .slice()
    .sort((a, b) => {
      if (a.distance_km != null || b.distance_km != null) {
        return (a.distance_km ?? 9999) - (b.distance_km ?? 9999)
      }
      return 0
    })

  const selectedPlace =
    filteredPlaces.find((p) => p.id === selectedPlaceId) || filteredPlaces[0] || null

  const markers = filteredPlaces.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    title: p.name,
    subtitle: `${p.category} • ${t('places.accessibility_score')}: ${p.accessibility_score}/100`,
    badge: p.wheelchair_friendly ? t('places.filter_wheelchair') : undefined,
  }))

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner />}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            {t('places.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-1">
            {t('places.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            type="button"
            onClick={getLocation}
            disabled={geoLoading}
          >
            <LocateFixed className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{geoLoading ? t('finder.locating') : t('places.near_me')}</span>
          </ActionButton>
        </div>
      </header>

      {/* Filter & View Toggle Bar */}
      <section
        aria-label={t('finder.filter_region')}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 sm:p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            active={filterWheelchair}
            onClick={() => setFilterWheelchair((v) => !v)}
            icon={<Accessibility className="w-4 h-4" />}
            label={t('places.filter_wheelchair')}
          />
          <FilterChip
            active={filterRamp}
            onClick={() => setFilterRamp((v) => !v)}
            icon={<TrendingUp className="w-4 h-4" />}
            label={t('places.filter_ramp')}
          />
          <FilterChip
            active={filterElevator}
            onClick={() => setFilterElevator((v) => !v)}
            icon={<ArrowUpDown className="w-4 h-4" />}
            label={t('places.filter_elevator')}
          />
          <FilterChip
            active={filterParking}
            onClick={() => setFilterParking((v) => !v)}
            icon={<CircleParking className="w-4 h-4" />}
            label={t('places.filter_parking')}
          />
          <FilterChip
            active={filterQuiet}
            onClick={() => setFilterQuiet((v) => !v)}
            icon={<VolumeX className="w-4 h-4" />}
            label={t('places.filter_quiet')}
          />

          {hasActiveFilters && (
            <SecondaryButton
              type="button"
              onClick={clearFilters}
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
        {!loading && !error && t('finder.results_count', { count: filteredPlaces.length })}
      </div>

      {loading ? (
        <StateMessage kind="loading" />
      ) : error ? (
        <StateMessage kind="error" onRetry={handleRetry} />
      ) : filteredPlaces.length === 0 ? (
        <StateMessage
          kind="empty"
          title={t('places.no_results')}
          onRetry={hasActiveFilters ? clearFilters : handleRetry}
        />
      ) : (
        <>
          {viewMode === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapView
                  center={[coords.lat, coords.lng]}
                  markers={markers}
                  onMarkerSelect={(id) => setSelectedPlaceId(id)}
                  ariaLabel={t('finder.map_aria')}
                />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-[var(--ink)]">
                  {t('finder.selected_location')}
                </h2>
                {selectedPlace ? (
                  <PlaceCard place={selectedPlace} />
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

          <section aria-labelledby="all-places-heading" className="flex flex-col gap-4">
            <h2
              id="all-places-heading"
              className="text-xl font-bold text-[var(--ink)]"
            >
              {t('finder.all_places')} ({filteredPlaces.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaces.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

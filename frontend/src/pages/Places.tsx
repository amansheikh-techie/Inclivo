import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, type Place } from '../lib/api'
import { MapView } from '../components/MapView'
import { PlaceCard } from '../components/PlaceCard'
import { useGeolocation } from '../hooks/useGeolocation'

export function Places() {
  const { t } = useTranslation()
  const { coords, loading: geoLoading, getLocation } = useGeolocation()
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)

  // Filters
  const [filterRamp, setFilterRamp] = useState(false)
  const [filterElevator, setFilterElevator] = useState(false)
  const [filterParking, setFilterParking] = useState(false)
  const [filterWheelchair, setFilterWheelchair] = useState(false)
  const [filterQuiet, setFilterQuiet] = useState(false)

  useEffect(() => {
    api.getPlaces()
      .then((data) => setPlaces(data))
      .finally(() => setLoading(false))
  }, [])

  const filteredPlaces = places.filter((p) => {
    if (filterRamp && !p.has_ramp) return false
    if (filterElevator && !p.has_elevator) return false
    if (filterParking && !p.accessible_parking) return false
    if (filterWheelchair && !p.wheelchair_friendly) return false
    if (filterQuiet && !p.quiet) return false
    return true
  })

  const markers = filteredPlaces.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    title: p.name,
    subtitle: `${p.category} • Score: ${p.accessibility_score}/100`,
    badge: p.wheelchair_friendly ? '♿ Accessible' : undefined,
  }))

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || filteredPlaces[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-100">
            {t('places.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            {t('places.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={getLocation}
          disabled={geoLoading}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
        >
          <span>🎯</span>
          <span>{geoLoading ? 'Locating...' : t('places.near_me')}</span>
        </button>
      </header>

      {/* Filter toolbar */}
      <section
        aria-label="Filter accessible amenities"
        className="flex flex-wrap items-center gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-300 dark:border-neutral-700"
      >
        <button
          type="button"
          onClick={() => setFilterWheelchair(!filterWheelchair)}
          aria-pressed={filterWheelchair}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterWheelchair
              ? 'bg-blue-700 text-white border-blue-800'
              : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600'
          }`}
        >
          <span>♿</span>
          <span>{t('places.filter_wheelchair')}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterRamp(!filterRamp)}
          aria-pressed={filterRamp}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterRamp
              ? 'bg-blue-700 text-white border-blue-800'
              : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600'
          }`}
        >
          <span>↗️</span>
          <span>{t('places.filter_ramp')}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterElevator(!filterElevator)}
          aria-pressed={filterElevator}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterElevator
              ? 'bg-blue-700 text-white border-blue-800'
              : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600'
          }`}
        >
          <span>🛗</span>
          <span>{t('places.filter_elevator')}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterParking(!filterParking)}
          aria-pressed={filterParking}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterParking
              ? 'bg-blue-700 text-white border-blue-800'
              : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600'
          }`}
        >
          <span>🅿️</span>
          <span>{t('places.filter_parking')}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterQuiet(!filterQuiet)}
          aria-pressed={filterQuiet}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterQuiet
              ? 'bg-blue-700 text-white border-blue-800'
              : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600'
          }`}
        >
          <span>🤫</span>
          <span>{t('places.filter_quiet')}</span>
        </button>
      </section>

      {/* Map & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView
            center={[coords.lat, coords.lng]}
            markers={markers}
            onMarkerSelect={(id) => setSelectedPlaceId(id)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Selected Location
          </h2>
          {loading ? (
            <div className="p-8 text-center text-sm text-neutral-500 animate-pulse">
              Loading places...
            </div>
          ) : selectedPlace ? (
            <PlaceCard place={selectedPlace} />
          ) : (
            <p className="text-sm text-neutral-500 p-4 border border-dashed rounded-lg">
              {t('places.no_results')}
            </p>
          )}
        </div>
      </div>

      {/* Place list */}
      <section aria-labelledby="all-places-heading" className="flex flex-col gap-4 mt-4">
        <h2 id="all-places-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          All Accessible Places ({filteredPlaces.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </section>
    </div>
  )
}

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet icon paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MarkerItem {
  id: string
  lat: number
  lng: number
  title: string
  subtitle?: string
  badge?: string
}

interface MapViewProps {
  center: [number, number]
  zoom?: number
  markers: MarkerItem[]
  onMarkerSelect?: (id: string) => void
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export function MapView({
  center,
  zoom = 13,
  markers,
  onMarkerSelect,
}: MapViewProps) {
  return (
    <div
      role="region"
      aria-label="Interactive OpenStreetMap for Accessible Locations"
      className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 shadow-sm relative z-0"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            eventHandlers={{
              click: () => onMarkerSelect?.(m.id),
            }}
          >
            <Popup>
              <div className="p-1">
                <strong className="block text-sm font-bold text-neutral-900">
                  {m.title}
                </strong>
                {m.subtitle && (
                  <span className="block text-xs text-neutral-600 mt-1">
                    {m.subtitle}
                  </span>
                )}
                {m.badge && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-900">
                    {m.badge}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

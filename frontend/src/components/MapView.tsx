import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet icon paths in Vite
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export interface MarkerItem {
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
  ariaLabel?: string
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
  ariaLabel = 'Interactive OpenStreetMap for accessible locations',
}: MapViewProps) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="w-full h-[360px] md:h-[480px] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-muted)] shadow-sm relative z-0"
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
              <div className="p-1 text-[#172B4D]">
                <strong className="block text-sm font-bold text-[#172B4D]">
                  {m.title}
                </strong>
                {m.subtitle && (
                  <span className="block text-xs text-[#475569] mt-1">
                    {m.subtitle}
                  </span>
                )}
                {m.badge && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#24A69A] text-[#172B4D]">
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

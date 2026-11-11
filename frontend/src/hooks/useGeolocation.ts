import { useState } from 'react'

export interface Coordinates {
  lat: number
  lng: number
}

export function useGeolocation(defaultCoords: Coordinates = { lat: 17.385, lng: 78.4867 }) {
  const [coords, setCoords] = useState<Coordinates>(defaultCoords)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return { coords, loading, error, getLocation }
}

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'

export function SOSButton() {
  const { t } = useTranslation()
  const [holding, setHolding] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const holdTimerRef = useRef<number | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)

  const handlePointerDown = () => {
    if (countdown !== null) return
    setHolding(true)
    holdTimerRef.current = window.setTimeout(() => {
      setHolding(false)
      triggerCountdown()
    }, 2000)
  }

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    setHolding(false)
  }

  const triggerCountdown = () => {
    setCountdown(5)
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownIntervalRef.current!)
          dispatchEmergencyAlert()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelEmergency = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    setCountdown(null)
    setStatusMessage('Emergency alert cancelled.')
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const dispatchEmergencyAlert = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        await api.triggerSOS({ lat: latitude, lng: longitude })
        const mapsLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`
        const msg = encodeURIComponent(
          `EMERGENCY ALERT from Inclivo: I need immediate assistance at this location: ${mapsLink}`
        )
        setStatusMessage(t('sos.dispatched'))
        // Open SMS or WhatsApp emergency trigger
        window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer')
      },
      async () => {
        await api.triggerSOS({ lat: 17.385, lng: 78.4867 })
        setStatusMessage(t('sos.dispatched'))
      }
    )
  }

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [])

  return (
    <>
      <div
        role="status"
        aria-live="assertive"
        className="fixed bottom-24 right-6 z-50 pointer-events-none"
      >
        {statusMessage && (
          <div className="bg-red-900 text-white px-4 py-3 rounded-lg shadow-xl border-2 border-red-500 font-bold text-sm pointer-events-auto">
            {statusMessage}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {countdown !== null ? (
          <div className="flex flex-col items-center gap-2 bg-red-950 text-white p-4 rounded-2xl border-4 border-red-500 shadow-2xl animate-bounce">
            <span className="font-extrabold text-sm uppercase tracking-wider text-red-200">
              🚨 {t('sos.cancelling', { seconds: countdown })}
            </span>
            <button
              type="button"
              onClick={cancelEmergency}
              className="min-h-[44px] px-6 py-2 rounded-full bg-white text-red-900 font-bold hover:bg-neutral-200 focus-visible:ring-4 focus-visible:ring-yellow-400 cursor-pointer text-sm"
            >
              {t('sos.cancel')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handlePointerDown()
              }
            }}
            onKeyUp={handlePointerUp}
            aria-label="Hold for 2 seconds to send SOS emergency alert with your location"
            className={`min-h-[56px] min-w-[56px] px-5 py-3 rounded-full font-black text-base shadow-2xl flex items-center gap-2 cursor-pointer transition-transform border-2 border-white ${
              holding
                ? 'bg-red-800 text-white scale-110 ring-8 ring-red-400 animate-pulse'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <span aria-hidden="true" className="text-xl">🆘</span>
            <span>{holding ? t('sos.holding') : t('sos.button')}</span>
          </button>
        )}
      </div>
    </>
  )
}

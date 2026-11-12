import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, MessageSquare, X } from 'lucide-react'
import { api, type EmergencyContact } from '../lib/api'
import { supabase } from '../lib/supabase'

export function SOSButton() {
  const { t } = useTranslation()
  const [holding, setHolding] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [smsHref, setSmsHref] = useState<string | null>(null)

  const holdTimerRef = useRef<number | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)

  const startHold = () => {
    if (countdown !== null || holdTimerRef.current !== null) return
    setHolding(true)
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null
      setHolding(false)
      triggerCountdown()
    }, 2000)
  }

  const endHold = () => {
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
          countdownIntervalRef.current = null
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
    setStatusMessage(t('sos.cancelled'))
    setSmsHref(null)
    window.setTimeout(() => setStatusMessage(null), 5000)
  }

  const sendCoordinates = async (lat: number, lng: number, openWhatsApp: boolean) => {
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`
    let contacts: EmergencyContact[] = []
    try {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        if (data.session?.access_token) {
          const res = await api.triggerSOS({ lat, lng })
          contacts = res.contacts ?? []
        }
      }
    } catch {
      // Keep local SMS/WhatsApp sharing available even if API call fails
    }

    const firstPhone = contacts[0]?.phone?.trim() ?? ''
    const waPhone = firstPhone.replace(/\D/g, '')
    const msg = encodeURIComponent(t('sos.message', { url: mapsLink }))

    setSmsHref(`sms:${firstPhone}?body=${msg}`)
    setStatusMessage(t('sos.dispatched'))
    if (openWhatsApp) {
      window.open(`https://wa.me/${waPhone}?text=${msg}`, '_blank', 'noopener,noreferrer')
    }
  }

  const dispatchEmergencyAlert = () => {
    if (!navigator.geolocation) {
      void sendCoordinates(17.385, 78.4867, false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => void sendCoordinates(pos.coords.latitude, pos.coords.longitude, true),
      () => void sendCoordinates(17.385, 78.4867, false)
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
        className="pointer-events-none fixed bottom-36 right-4 z-50 max-w-xs lg:bottom-24 lg:right-6"
      >
        {statusMessage && (
          <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border-2 border-[var(--danger-border)] bg-[var(--danger-solid)] px-4 py-3 text-sm font-semibold text-[var(--danger-solid-ink)] shadow-xl">
            <div className="flex items-start justify-between gap-2">
              <span>{statusMessage}</span>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                aria-label={t('nav.close')}
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border border-current/30"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs font-normal opacity-95">{t('sos.disclaimer')}</p>
            {smsHref && (
              <a
                href={smsHref}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--ink)] border border-[var(--border)]"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span>{t('sos.sms_action')}</span>
              </a>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 lg:bottom-6 lg:right-6">
        {countdown !== null ? (
          <div className="flex max-w-xs flex-col items-center gap-2 rounded-2xl border-2 border-[var(--danger-border)] bg-[var(--danger-solid)] p-4 text-center text-[var(--danger-solid-ink)] shadow-2xl">
            <span className="text-sm font-extrabold uppercase tracking-wide">
              {t('sos.cancelling').replace('{seconds}', String(countdown))}
            </span>
            <p className="text-xs opacity-95">{t('sos.disclaimer')}</p>
            <button
              type="button"
              onClick={cancelEmergency}
              className="min-h-[44px] cursor-pointer rounded-full bg-[var(--surface)] px-5 py-2 text-sm font-bold text-[var(--ink)] border border-[var(--border)]"
            >
              {t('sos.cancel')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerCancel={endHold}
            onPointerLeave={endHold}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
                e.preventDefault()
                startHold()
              }
            }}
            onKeyUp={endHold}
            aria-label={`${t('sos.button')}. ${t('sos.holding')} ${t('sos.disclaimer')}`}
            className={`flex min-h-[52px] min-w-[52px] cursor-pointer items-center gap-2 rounded-full border-2 border-[var(--danger-solid-ink)] bg-[var(--danger-solid)] px-5 py-3 text-sm font-extrabold text-[var(--danger-solid-ink)] shadow-xl transition-transform ${
              holding ? 'scale-105 ring-4 ring-[var(--danger-border)]' : ''
            }`}
          >
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{holding ? t('sos.holding') : t('sos.button')}</span>
          </button>
        )}
      </div>
    </>
  )
}

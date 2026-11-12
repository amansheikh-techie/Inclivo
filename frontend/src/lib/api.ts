import { useSyncExternalStore } from 'react'
import placesMock from '../mocks/places.json'
import washroomsMock from '../mocks/washrooms.json'
import schemesMock from '../mocks/schemes.json'
import { supabase } from './supabase'
import i18n from '../i18n'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let demoMode = false
const demoListeners = new Set<() => void>()

function setDemoMode(next: boolean) {
  if (demoMode === next) return
  demoMode = next
  demoListeners.forEach((listener) => listener())
}

export function useDemoData(): boolean {
  return useSyncExternalStore(
    (listener) => {
      demoListeners.add(listener)
      return () => demoListeners.delete(listener)
    },
    () => demoMode,
    () => false
  )
}

async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const { data } = await supabase.auth.getSession()
    if (data.session?.access_token) {
      return { Authorization: `Bearer ${data.session.access_token}` }
    }
  } catch {
    // Ignore when auth not configured
  }
  return {}
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const authHeaders = await getAuthHeader()
  const headers = {
    ...authHeaders,
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`)
    }
    setDemoMode(false)
    return await res.json()
  } catch (err) {
    if (fallbackData !== undefined) {
      setDemoMode(true)
      return fallbackData
    }
    throw err
  }
}

export interface Place {
  id: string
  name: string
  category: string | null
  lat: number
  lng: number
  accessibility_score: number
  score_breakdown: string[]
  has_ramp: boolean
  has_elevator: boolean
  accessible_parking: boolean
  wheelchair_friendly: boolean
  quiet: boolean
  rating: number | null
  address: string | null
  distance_km: number | null
}

export interface Washroom {
  id: string
  name: string
  lat: number
  lng: number
  cleanliness_rating: number | null
  verified: boolean
  last_verified: string | null
  address: string | null
  distance_km: number | null
}

export interface Scheme {
  id: string
  name: string
  display_name: string
  disability_type: string | null
  state: string | null
  eligibility: string | null
  benefits: string | null
  apply_url: string | null
  name_hi: string | null
  name_te: string | null
  name_ta: string | null
}

export interface MatchedScheme {
  scheme: Scheme
  reason: string
}

export interface ReportItem {
  id: string
  issue_type: string
  description: string | null
  lat: number | null
  lng: number | null
  photo_url: string | null
  status: 'open' | 'resolved'
  upvotes: number
  created_at: string | null
}

export interface PassportData {
  mobility_needs: string | null
  vision_needs: string | null
  hearing_needs: string | null
  preferred_language: string
  font_size: string
  sensory_mode: boolean
}

export interface EmergencyContact {
  id: string
  user_id: string
  name: string
  phone: string
}

const normalizedPlacesFallback: Place[] = placesMock.map((p) => {
  const breakdown: string[] = []
  if (p.ramp) breakdown.push('Ramp (+30)')
  if (p.elevator) breakdown.push('Elevator (+25)')
  if (p.accessible_parking) breakdown.push('Accessible parking (+20)')
  if (p.wheelchair_friendly) breakdown.push('Wheelchair friendly (+25)')
  return {
    id: p.id,
    name: p.name,
    category: p.category ?? null,
    lat: p.lat,
    lng: p.lng,
    accessibility_score: p.score,
    score_breakdown: breakdown,
    has_ramp: p.ramp,
    has_elevator: p.elevator,
    accessible_parking: p.accessible_parking,
    wheelchair_friendly: p.wheelchair_friendly,
    quiet: p.quiet,
    rating: null,
    address: p.address ?? null,
    distance_km: null,
  }
})

const normalizedWashroomsFallback: Washroom[] = washroomsMock.map((w) => ({
  id: w.id,
  name: w.name,
  lat: w.lat,
  lng: w.lng,
  cleanliness_rating: w.rating ?? null,
  verified: w.verified,
  last_verified: w.last_verified ?? null,
  address: w.address ?? null,
  distance_km: null,
}))

const normalizedSchemesFallback: Scheme[] = schemesMock.map((s) => ({
  id: s.id,
  name: s.name,
  display_name: s.name,
  disability_type: s.disability_type ?? null,
  state: s.state ?? null,
  eligibility: s.eligibility ?? null,
  benefits: s.benefits ?? null,
  apply_url: s.apply_url ?? null,
  name_hi: null,
  name_te: null,
  name_ta: null,
}))

export const api = {
  getPlaces: (params?: { lat?: number; lng?: number; radius_km?: number }) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v != null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString()
      : ''
    return fetchApi<Place[]>(`/api/places${qs}`, {}, normalizedPlacesFallback)
  },

  getWashrooms: (params?: { lat?: number; lng?: number; radius_km?: number }) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v != null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString()
      : ''
    return fetchApi<Washroom[]>(`/api/washrooms${qs}`, {}, normalizedWashroomsFallback)
  },

  getSchemes: (params?: { q?: string; type?: string; state?: string; lang?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v != null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString()
      : ''
    return fetchApi<Scheme[]>(`/api/schemes${qs}`, {}, normalizedSchemesFallback)
  },

  matchSchemes: (profile: {
    disability_type: string
    age?: number
    state?: string
    income_range?: string
    lang?: string
  }) =>
    fetchApi<MatchedScheme[]>(
      '/api/schemes/match',
      { method: 'POST', body: JSON.stringify(profile) },
      normalizedSchemesFallback
        .filter((s) => {
          const typeFilter = profile.disability_type?.trim().toLowerCase()
          if (typeFilter) {
            const rowType = (s.disability_type ?? '').trim().toLowerCase()
            if (rowType !== typeFilter && rowType !== 'all') return false
          }
          const stateFilter = profile.state?.trim().toLowerCase()
          if (stateFilter) {
            const rowState = (s.state ?? '').trim().toLowerCase()
            if (rowState !== stateFilter && rowState !== 'india' && rowState !== 'all india') {
              return false
            }
          }
          return true
        })
        .map((s) => ({ scheme: s, reason: 'Matches your profile' }))
    ),

  chatAssistant: (message: string, lang = 'en') =>
    fetchApi<{ reply: string }>(
      '/api/assistant/chat',
      { method: 'POST', body: JSON.stringify({ message, lang }) },
      { reply: `Assistant received: "${message}". All Inclivo accessibility features are ready to assist you.` }
    ),

  describeImage: (file: File, lang = i18n.language || 'en') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('lang', lang)
    return fetchApi<{ description: string }>(
      '/api/assistant/describe-image',
      { method: 'POST', body: formData },
      { description: 'An accessible indoor path with dual-level handrails, bright even lighting, and clear tactile paving on the floor.' }
    )
  },

  ocrImage: (file: File, lang = i18n.language || 'en') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('lang', lang)
    return fetchApi<{ text: string; summary: string }>(
      '/api/assistant/ocr',
      { method: 'POST', body: formData },
      { text: 'Accessible Entrance: Gate 2. Elevator accessible 50m ahead on the left.', summary: '' }
    )
  },

  simplifyText: (text: string, lang = 'en') =>
    fetchApi<{ simplified: string }>(
      '/api/assistant/simplify',
      { method: 'POST', body: JSON.stringify({ text, lang }) },
      { simplified: `Simple summary: ${text.slice(0, 160)}... This scheme helps eligible applicants receive direct government assistance.` }
    ),

  getReports: () =>
    fetchApi<ReportItem[]>('/api/reports', {}, [
      { id: 'r1', issue_type: 'Broken Ramp', description: 'Steep curb with damaged asphalt near the bus shelter.', lat: 17.385, lng: 78.486, photo_url: null, status: 'open', upvotes: 14, created_at: '2026-11-10' },
      { id: 'r2', issue_type: 'Auditory Signal Malfunction', description: 'Pedestrian beeper silent at road crossing.', lat: 17.433, lng: 78.388, photo_url: null, status: 'resolved', upvotes: 27, created_at: '2026-11-05' },
    ]),

  createReport: (data: FormData) =>
    fetchApi<ReportItem>('/api/reports', { method: 'POST', body: data }),

  upvoteReport: (id: string) =>
    fetchApi<ReportItem>(`/api/reports/${id}/upvote`, { method: 'POST' }),

  getPassport: () =>
    fetchApi<PassportData>('/api/passport', {}, {
      mobility_needs: null,
      vision_needs: null,
      hearing_needs: null,
      preferred_language: 'en',
      font_size: 'medium',
      sensory_mode: false,
    }),

  savePassport: (data: PassportData) =>
    fetchApi<PassportData>('/api/passport', { method: 'PUT', body: JSON.stringify(data) }),

  getContacts: () =>
    fetchApi<EmergencyContact[]>('/api/contacts', {}),

  addContact: (contact: { name: string; phone: string }) =>
    fetchApi<EmergencyContact>('/api/contacts', { method: 'POST', body: JSON.stringify(contact) }),

  deleteContact: (id: string) =>
    fetchApi<{ deleted: boolean; id: string }>(`/api/contacts/${id}`, { method: 'DELETE' }),

  triggerSOS: (location: { lat: number; lng: number }) =>
    fetchApi<{ event_id: string; maps_url: string; contacts: EmergencyContact[] }>(
      '/api/sos',
      { method: 'POST', body: JSON.stringify(location) },
      { event_id: '', maps_url: `https://maps.google.com/?q=${location.lat},${location.lng}`, contacts: [] }
    ),
}

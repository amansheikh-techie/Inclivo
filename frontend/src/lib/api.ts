import placesMock from '../mocks/places.json'
import washroomsMock from '../mocks/washrooms.json'
import schemesMock from '../mocks/schemes.json'
import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    return await res.json()
  } catch (err) {
    if (fallbackData !== undefined) {
      return fallbackData
    }
    throw err
  }
}

export interface Place {
  id: string
  name: string
  category: string
  lat: number
  lng: number
  score: number
  ramp: boolean
  elevator: boolean
  accessible_parking: boolean
  wheelchair_friendly: boolean
  quiet: boolean
  description: string
  address: string
}

export interface Washroom {
  id: string
  name: string
  lat: number
  lng: number
  rating: number
  verified: boolean
  last_verified: string
  wheelchair_friendly: boolean
  grab_rails: boolean
  fee: string
  address: string
}

export interface Scheme {
  id: string
  name: string
  disability_type: string
  state: string
  benefit_type: string
  eligibility: string
  benefits: string
  simplified: string
  apply_url: string
}

export interface ReportItem {
  id: string
  issue_type: string
  description: string
  lat: number
  lng: number
  status: 'open' | 'resolved'
  upvotes: number
  created_at: string
}

export interface PassportData {
  mobility_needs: string[]
  vision_needs: string[]
  hearing_needs: string[]
  preferred_language: string
  font_size: string
  emergency_contacts: { name: string; phone: string; relation: string }[]
}

export const api = {
  getPlaces: () => fetchApi<Place[]>('/api/places', {}, placesMock),
  getWashrooms: () => fetchApi<Washroom[]>('/api/washrooms', {}, washroomsMock),
  getSchemes: () => fetchApi<Scheme[]>('/api/schemes', {}, schemesMock),

  matchSchemes: (profile: { disability_type: string; age: number; state: string; income_range: string }) =>
    fetchApi<Scheme[]>('/api/schemes/match', {
      method: 'POST',
      body: JSON.stringify(profile),
    }, schemesMock.filter((s) => s.state === 'All India' || s.state === profile.state)),

  chatAssistant: (message: string, lang = 'en') =>
    fetchApi<{ reply: string }>('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, lang }),
    }, {
      reply: `Assistant received: "${message}". All Inclivo accessibility features are ready to assist you.`,
    }),

  describeImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return fetchApi<{ description: string }>('/api/assistant/describe-image', {
      method: 'POST',
      body: formData,
    }, {
      description: 'An accessible indoor path with dual-level handrails, bright even lighting, and clear tactile paving on the floor.',
    })
  },

  ocrImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return fetchApi<{ text: string }>('/api/assistant/ocr', {
      method: 'POST',
      body: formData,
    }, {
      text: 'Accessible Entrance: Gate 2. Elevator accessible 50m ahead on the left.',
    })
  },

  simplifyText: (text: string, lang = 'en') =>
    fetchApi<{ simplified: string }>('/api/assistant/simplify', {
      method: 'POST',
      body: JSON.stringify({ text, lang }),
    }, {
      simplified: `Simple summary: ${text.slice(0, 160)}... This scheme helps eligible applicants receive direct government assistance.`,
    }),

  getReports: () =>
    fetchApi<ReportItem[]>('/api/reports', {}, [
      {
        id: 'r1',
        issue_type: 'Broken Ramp',
        description: 'Steep curb with damaged asphalt near the bus shelter.',
        lat: 17.385,
        lng: 78.486,
        status: 'open',
        upvotes: 14,
        created_at: '2026-11-10',
      },
      {
        id: 'r2',
        issue_type: 'Auditory Signal Malfunction',
        description: 'Pedestrian beeper silent at road crossing.',
        lat: 17.433,
        lng: 78.388,
        status: 'resolved',
        upvotes: 27,
        created_at: '2026-11-05',
      },
    ]),

  createReport: (data: FormData | Partial<ReportItem>) =>
    fetchApi<{ success: boolean; id: string }>('/api/reports', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }, { success: true, id: 'r-' + Date.now() }),

  upvoteReport: (id: string) =>
    fetchApi<{ success: boolean; upvotes: number }>(`/api/reports/${id}/upvote`, {
      method: 'POST',
    }, { success: true, upvotes: 1 }),

  getPassport: () =>
    fetchApi<PassportData>('/api/passport', {}, {
      mobility_needs: ['ramp', 'elevator'],
      vision_needs: ['large_text'],
      hearing_needs: ['captions'],
      preferred_language: 'en',
      font_size: 'normal',
      emergency_contacts: [
        { name: 'Dr. Rao', phone: '+91 98765 43210', relation: 'Physician' },
        { name: 'Priya (Sister)', phone: '+91 91234 56789', relation: 'Family' },
      ],
    }),

  savePassport: (data: PassportData) =>
    fetchApi<{ success: boolean }>('/api/passport', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, { success: true }),

  triggerSOS: (location: { lat: number; lng: number }) =>
    fetchApi<{ success: boolean; message: string }>('/api/sos', {
      method: 'POST',
      body: JSON.stringify(location),
    }, { success: true, message: 'Emergency alert dispatched to contacts.' }),
}


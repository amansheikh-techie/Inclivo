import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, type PassportData } from '../lib/api'
import { supabase } from '../lib/supabase'
import { Toast } from '../components/Toast'

export function Passport() {
  const { t, i18n } = useTranslation()
  const [sessionUser, setSessionUser] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [passport, setPassport] = useState<PassportData>({
    mobility_needs: ['ramp'],
    vision_needs: [],
    hearing_needs: [],
    preferred_language: 'en',
    font_size: 'normal',
    emergency_contacts: [
      { name: 'Primary Emergency Contact', phone: '+91 9876543210', relation: 'Family' },
    ],
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSessionUser(data.session.user.email || 'Authenticated User')
      }
    })

    api.getPassport().then((data) => {
      if (data) setPassport(data)
    })
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: emailInput })
      if (error) {
        // Fallback for demo when Supabase credentials aren't configured yet
        setSessionUser(emailInput)
        setToastMessage(`Signed in as demo user (${emailInput})`)
      } else {
        setToastMessage('Check your email for the magic login link!')
      }
    } catch {
      setSessionUser(emailInput)
      setToastMessage(`Signed in as demo user (${emailInput})`)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.savePassport(passport)
      i18n.changeLanguage(passport.preferred_language)
      setToastMessage('Accessibility Passport saved & preferences applied!')
    } finally {
      setLoading(false)
    }
  }

  const toggleNeed = (category: 'mobility_needs' | 'vision_needs' | 'hearing_needs', item: string) => {
    setPassport((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((x) => x !== item)
        : [...prev[category], item],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <header>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-100">
          {t('passport.title')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
          {t('passport.subtitle')}
        </p>
      </header>

      {/* Auth Status Card */}
      <section className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            Passport Account
          </span>
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1">
            {sessionUser ? `Signed in: ${sessionUser}` : t('passport.login_prompt')}
          </p>
        </div>

        {!sessionUser && (
          <form onSubmit={handleEmailLogin} className="flex items-center gap-2">
            <label htmlFor="auth-email" className="sr-only">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              placeholder="you@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="min-h-[44px] px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm cursor-pointer disabled:opacity-50"
            >
              Sign In
            </button>
          </form>
        )}
      </section>

      {/* Preferences Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Mobility Needs */}
        <fieldset className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700">
          <legend className="text-lg font-bold px-2 text-neutral-900 dark:text-neutral-100">
            ♿ Mobility Preferences
          </legend>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { id: 'ramp', label: 'Ramp Access Required' },
              { id: 'elevator', label: 'Elevators Only' },
              { id: 'step_free', label: 'Step-Free Paths' },
              { id: 'wide_doors', label: 'Wide Doorways (≥ 90cm)' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleNeed('mobility_needs', m.id)}
                aria-pressed={passport.mobility_needs.includes(m.id)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-bold border transition-colors cursor-pointer ${
                  passport.mobility_needs.includes(m.id)
                    ? 'bg-blue-700 text-white border-blue-800'
                    : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {passport.mobility_needs.includes(m.id) ? '✓ ' : '+ '}
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Sensory & Vision Needs */}
        <fieldset className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700">
          <legend className="text-lg font-bold px-2 text-neutral-900 dark:text-neutral-100">
            👁️ Sensory & Vision Preferences
          </legend>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { id: 'high_contrast', label: 'High Contrast Mode' },
              { id: 'large_text', label: 'Large Text (130%)' },
              { id: 'braille', label: 'Braille Signage' },
              { id: 'screen_reader', label: 'Screen Reader Optimized' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => toggleNeed('vision_needs', v.id)}
                aria-pressed={passport.vision_needs.includes(v.id)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-bold border transition-colors cursor-pointer ${
                  passport.vision_needs.includes(v.id)
                    ? 'bg-purple-700 text-white border-purple-800'
                    : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {passport.vision_needs.includes(v.id) ? '✓ ' : '+ '}
                {v.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Emergency Contacts */}
        <section className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700">
          <h2 className="text-lg font-bold mb-3 text-neutral-900 dark:text-neutral-100">
            🚨 {t('passport.contacts')}
          </h2>
          <div className="flex flex-col gap-3">
            {passport.emergency_contacts.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800"
              >
                <div>
                  <span className="font-bold text-sm block">{c.name} ({c.relation})</span>
                  <span className="text-xs text-neutral-500 font-mono">{c.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="min-h-[48px] px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg cursor-pointer self-start disabled:opacity-50"
        >
          {loading ? 'Saving...' : t('passport.save')}
        </button>
      </form>
    </div>
  )
}

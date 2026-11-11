import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, type PassportData, type EmergencyContact } from '../lib/api'
import { supabase } from '../lib/supabase'
import { Toast } from '../components/Toast'

export function Passport() {
  const { t, i18n } = useTranslation()
  const [sessionUser, setSessionUser] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const [passport, setPassport] = useState<PassportData>({
    mobility_needs: null,
    vision_needs: null,
    hearing_needs: null,
    preferred_language: 'en',
    font_size: 'medium',
    sensory_mode: false,
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSessionUser(data.session.user.email || 'Authenticated User')
      }
    })
    api.getPassport().then((data) => { if (data) setPassport(data) })
    api.getContacts().then((data) => setContacts(data)).catch(() => {})
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: emailInput })
      if (error) {
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

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newPhone) return
    try {
      const created = await api.addContact({ name: newName, phone: newPhone })
      setContacts((prev) => [...prev, created])
      setNewName('')
      setNewPhone('')
    } catch {
      setToastMessage('Could not add contact. Please sign in first.')
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      await api.deleteContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setToastMessage('Could not delete contact.')
    }
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
            <label htmlFor="auth-email" className="sr-only">Email Address</label>
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
          <textarea
            aria-label="Mobility needs description"
            rows={2}
            value={passport.mobility_needs || ''}
            onChange={(e) => setPassport((p) => ({ ...p, mobility_needs: e.target.value || null }))}
            placeholder="e.g. wheelchair, ramp access, step-free paths"
            className="mt-4 w-full px-3 py-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-sm"
          />
        </fieldset>

        {/* Vision Needs */}
        <fieldset className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700">
          <legend className="text-lg font-bold px-2 text-neutral-900 dark:text-neutral-100">
            👁️ Vision Preferences
          </legend>
          <textarea
            aria-label="Vision needs description"
            rows={2}
            value={passport.vision_needs || ''}
            onChange={(e) => setPassport((p) => ({ ...p, vision_needs: e.target.value || null }))}
            placeholder="e.g. screen reader, high contrast, large text"
            className="mt-4 w-full px-3 py-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-sm"
          />
        </fieldset>

        {/* Hearing Needs */}
        <fieldset className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700">
          <legend className="text-lg font-bold px-2 text-neutral-900 dark:text-neutral-100">
            🦻 Hearing Preferences
          </legend>
          <textarea
            aria-label="Hearing needs description"
            rows={2}
            value={passport.hearing_needs || ''}
            onChange={(e) => setPassport((p) => ({ ...p, hearing_needs: e.target.value || null }))}
            placeholder="e.g. captions, visual alerts, induction loop"
            className="mt-4 w-full px-3 py-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-sm"
          />
        </fieldset>

        {/* Display Settings */}
        <fieldset className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700 flex flex-col gap-4">
          <legend className="text-lg font-bold px-2 text-neutral-900 dark:text-neutral-100">
            ⚙️ Display Settings
          </legend>
          <div className="flex items-center gap-4 flex-wrap">
            <label htmlFor="font-size" className="text-sm font-semibold">Font Size:</label>
            <select
              id="font-size"
              value={passport.font_size}
              onChange={(e) => setPassport((p) => ({ ...p, font_size: e.target.value }))}
              className="min-h-[44px] px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <label htmlFor="lang-select" className="text-sm font-semibold">Language:</label>
            <select
              id="lang-select"
              value={passport.preferred_language}
              onChange={(e) => setPassport((p) => ({ ...p, preferred_language: e.target.value }))}
              className="min-h-[44px] px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={passport.sensory_mode}
                onChange={(e) => setPassport((p) => ({ ...p, sensory_mode: e.target.checked }))}
                className="w-5 h-5"
              />
              Sensory-Friendly Mode
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="min-h-[48px] px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg cursor-pointer self-start disabled:opacity-50"
        >
          {loading ? 'Saving...' : t('passport.save')}
        </button>
      </form>

      {/* Emergency Contacts */}
      <section className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700">
        <h2 className="text-lg font-bold mb-3 text-neutral-900 dark:text-neutral-100">
          🚨 {t('passport.contacts')}
        </h2>
        <div className="flex flex-col gap-3 mb-4">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              <div>
                <span className="font-bold text-sm block">{c.name}</span>
                <span className="text-xs text-neutral-500 font-mono">{c.phone}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteContact(c.id)}
                className="text-red-600 font-bold text-xs px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                aria-label={`Remove ${c.name}`}
              >
                Remove
              </button>
            </div>
          ))}
          {contacts.length === 0 && (
            <p className="text-sm text-neutral-500">No emergency contacts added yet.</p>
          )}
        </div>
        <form onSubmit={handleAddContact} className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Contact name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            className="min-h-[44px] px-3 py-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-sm flex-1 min-w-[140px]"
          />
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            required
            className="min-h-[44px] px-3 py-2 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-sm flex-1 min-w-[140px]"
          />
          <button
            type="submit"
            className="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer"
          >
            + Add
          </button>
        </form>
      </section>
    </div>
  )
}

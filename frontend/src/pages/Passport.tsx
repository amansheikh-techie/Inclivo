import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  IdCard,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import {
  api,
  useDemoData,
  type EmergencyContact,
  type PassportData,
} from '../lib/api'
import { supabase } from '../lib/supabase'
import { Toast } from '../components/Toast'
import {
  ActionButton,
  Card,
  DemoBanner,
  SecondaryButton,
  StateMessage,
} from '../components/ui'

export function Passport() {
  const { t } = useTranslation()
  const isDemo = useDemoData()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  const [passport, setPassport] = useState<PassportData>({
    mobility_needs: '',
    vision_needs: '',
    hearing_needs: '',
    font_size: 'normal',
    preferred_language: 'en',
    sensory_mode: false,
  })

  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactError, setContactError] = useState<string | null>(null)
  const [addingContact, setAddingContact] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  useEffect(() => {
    let active = true

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (active && data.user?.email) {
          setUserEmail(data.user.email)
        }
      })
    }

    Promise.all([api.getPassport(), api.getContacts()])
      .then(([p, c]) => {
        if (!active) return
        setPassport(p)
        setContacts(c)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(false)
    Promise.all([api.getPassport(), api.getContacts()])
      .then(([p, c]) => {
        setPassport(p)
        setContacts(c)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail.trim() || !supabase) {
      setToast({ message: t('passport_ui.otp_error'), type: 'info' })
      return
    }
    setSendingOtp(true)
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: authEmail.trim(),
      })
      if (otpErr) throw otpErr
      setToast({ message: t('passport_ui.otp_sent'), type: 'success' })
    } catch {
      setToast({ message: t('passport_ui.otp_error'), type: 'error' })
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUserEmail(null)
  }

  const handleSavePassport = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const saved = await api.savePassport(passport)
      setPassport(saved)
      setToast({ message: t('passport_ui.save_success'), type: 'success' })
    } catch {
      setToast({ message: t('passport_ui.save_error'), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName.trim() || !contactPhone.trim()) {
      setContactError(t('passport_ui.contact_validation'))
      return
    }
    setContactError(null)
    setAddingContact(true)
    try {
      const added = await api.addContact({
        name: contactName.trim(),
        phone: contactPhone.trim(),
      })
      setContacts((prev) => [...prev, added])
      setContactName('')
      setContactPhone('')
      setToast({ message: t('passport_ui.contact_added'), type: 'success' })
    } catch {
      setToast({ message: t('passport_ui.save_error'), type: 'error' })
    } finally {
      setAddingContact(false)
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      await api.deleteContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
      setToast({ message: t('passport_ui.contact_removed'), type: 'info' })
    } catch {
      setToast({ message: t('passport_ui.save_error'), type: 'error' })
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {isDemo && <DemoBanner />}

      <header className="flex items-start gap-4">
        <span
          data-accent-fill="true"
          className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <IdCard className="w-6 h-6" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            {t('nav.passport')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-1">
            {t('passport_ui.auth_desc')}
          </p>
        </div>
      </header>

      <Card>
        {userEmail ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--ink)]">
              <ShieldCheck className="w-5 h-5 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
              <span>
                {t('passport_ui.signed_in_as')}: {userEmail}
              </span>
            </div>
            <SecondaryButton type="button" onClick={() => void handleSignOut()}>
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('passport_ui.sign_out')}</span>
            </SecondaryButton>
          </div>
        ) : (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-[var(--ink)]">
              {t('passport_ui.auth_title')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder={t('passport_ui.email_placeholder')}
                aria-label={t('passport_ui.email_label')}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm placeholder:text-[var(--ink-muted)]"
              />
              <ActionButton type="submit" disabled={sendingOtp || !authEmail.trim()}>
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('passport_ui.send_otp')}</span>
              </ActionButton>
            </div>
          </form>
        )}
      </Card>

      {loading ? (
        <StateMessage kind="loading" />
      ) : error ? (
        <StateMessage kind="error" onRetry={handleRetry} />
      ) : (
        <>
          <Card>
            <form onSubmit={handleSavePassport} className="flex flex-col gap-5">
              <h2 className="text-lg font-bold text-[var(--ink)]">
                {t('passport_ui.needs_heading')}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="mobility-needs" className="block text-sm font-semibold text-[var(--ink)] mb-1">
                    {t('passport_ui.mobility_label')}
                  </label>
                  <input
                    id="mobility-needs"
                    type="text"
                    value={passport.mobility_needs ?? ''}
                    onChange={(e) =>
                      setPassport((p) => ({ ...p, mobility_needs: e.target.value }))
                    }
                    placeholder={t('passport_ui.mobility_placeholder')}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm placeholder:text-[var(--ink-muted)]"
                  />
                </div>

                <div>
                  <label htmlFor="vision-needs" className="block text-sm font-semibold text-[var(--ink)] mb-1">
                    {t('passport_ui.vision_label')}
                  </label>
                  <input
                    id="vision-needs"
                    type="text"
                    value={passport.vision_needs ?? ''}
                    onChange={(e) =>
                      setPassport((p) => ({ ...p, vision_needs: e.target.value }))
                    }
                    placeholder={t('passport_ui.vision_placeholder')}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm placeholder:text-[var(--ink-muted)]"
                  />
                </div>

                <div>
                  <label htmlFor="hearing-needs" className="block text-sm font-semibold text-[var(--ink)] mb-1">
                    {t('passport_ui.hearing_label')}
                  </label>
                  <input
                    id="hearing-needs"
                    type="text"
                    value={passport.hearing_needs ?? ''}
                    onChange={(e) =>
                      setPassport((p) => ({ ...p, hearing_needs: e.target.value }))
                    }
                    placeholder={t('passport_ui.hearing_placeholder')}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm placeholder:text-[var(--ink-muted)]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] space-y-3">
                <h3 className="text-base font-bold text-[var(--ink)]">
                  {t('passport_ui.preferences_heading')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label htmlFor="pref-font-size" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                      {t('passport_ui.font_size_label')}
                    </label>
                    <select
                      id="pref-font-size"
                      value={passport.font_size}
                      onChange={(e) =>
                        setPassport((p) => ({ ...p, font_size: e.target.value }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                    >
                      <option value="normal">{t('captions_ui.size_normal')}</option>
                      <option value="large">{t('captions_ui.size_large')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pref-language" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                      {t('passport_ui.language_label')}
                    </label>
                    <select
                      id="pref-language"
                      value={passport.preferred_language}
                      onChange={(e) =>
                        setPassport((p) => ({
                          ...p,
                          preferred_language: e.target.value,
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                  </div>

                  <label className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex items-center gap-2.5 text-sm font-semibold text-[var(--ink)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passport.sensory_mode}
                      onChange={(e) =>
                        setPassport((p) => ({
                          ...p,
                          sensory_mode: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-[var(--action)]"
                    />
                    <span>{t('passport_ui.sensory_label')}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <ActionButton type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                  ) : (
                    <Save className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{saving ? t('passport_ui.saving') : t('passport_ui.save_btn')}</span>
                </ActionButton>
              </div>
            </form>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--ink)]">
              {t('passport_ui.contacts_heading')}
            </h2>

            {contacts.length === 0 ? (
              <StateMessage
                kind="empty"
                title={t('passport_ui.contacts_empty')}
              />
            ) : (
              <ul className="space-y-2">
                {contacts.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-[var(--ink)]">{c.name}</p>
                      <p className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
                        <Phone className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
                        <span>{c.phone}</span>
                      </p>
                    </div>

                    <SecondaryButton
                      type="button"
                      onClick={() => void handleDeleteContact(c.id)}
                      aria-label={t('passport_ui.delete_contact_aria', { name: c.name })}
                      className="px-3 py-2 text-xs text-[var(--danger-ink)]"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </SecondaryButton>
                  </li>
                ))}
              </ul>
            )}

            <form
              onSubmit={handleAddContact}
              noValidate
              className="pt-3 border-t border-[var(--border)] flex flex-col gap-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    {t('passport_ui.contact_name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactName}
                    onChange={(e) => {
                      setContactName(e.target.value)
                      if (contactError) setContactError(null)
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    {t('passport_ui.contact_phone')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value)
                      if (contactError) setContactError(null)
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm"
                  />
                </div>
              </div>

              {contactError && (
                <p
                  role="alert"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--danger-ink)]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{contactError}</span>
                </p>
              )}

              <div>
                <ActionButton type="submit" disabled={addingContact}>
                  <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t('passport_ui.add_contact_btn')}</span>
                </ActionButton>
              </div>
            </form>
          </Card>
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

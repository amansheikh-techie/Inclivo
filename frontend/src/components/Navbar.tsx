import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSensoryMode, type SensoryMode } from '../hooks/useSensoryMode'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { isModeActive, toggleMode, resetModes } = useSensoryMode()
  const [isSensoryOpen, setIsSensoryOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/places', label: t('nav.places') },
    { to: '/washrooms', label: t('nav.washrooms') },
    { to: '/assistant', label: t('nav.assistant') },
    { to: '/captions', label: t('nav.captions') },
    { to: '/schemes', label: t('nav.schemes') },
    { to: '/report', label: t('nav.report') },
    { to: '/passport', label: t('nav.passport') },
    { to: '/about', label: t('nav.about') },
  ]

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'ta', label: 'தமிழ்' },
  ]

  const sensoryOptions: { mode: SensoryMode; label: string }[] = [
    { mode: 'high-contrast', label: t('sensory.high_contrast') },
    { mode: 'large-text', label: t('sensory.large_text') },
    { mode: 'reduce-motion', label: t('sensory.reduce_motion') },
    { mode: 'dyslexia', label: t('sensory.dyslexia_font') },
  ]

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-blue-700 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            >
              <span className="text-3xl" aria-hidden="true">♿</span>
              <div>
                <span className="text-2xl font-black tracking-tight text-blue-700 dark:text-blue-400 block">
                  {t('brand')}
                </span>
                <span className="text-xs text-neutral-500 font-medium block">
                  {t('tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center ${
                      isActive
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Controls: Language + Sensory mode */}
            <div className="flex items-center gap-2">
              <label htmlFor="lang-select" className="sr-only">
                Select Language
              </label>
              <select
                id="lang-select"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="min-h-[44px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold text-neutral-800 dark:text-neutral-100"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsSensoryOpen(!isSensoryOpen)}
                aria-label="Open Sensory and Display Settings"
                aria-expanded={isSensoryOpen}
                className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm font-bold flex items-center gap-1 cursor-pointer"
              >
                <span aria-hidden="true">👁️</span>
                <span className="hidden sm:inline">Sensory</span>
              </button>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 text-xl font-bold cursor-pointer"
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="lg:hidden p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2 shadow-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`min-h-[44px] px-4 py-2.5 rounded-lg text-base font-semibold flex items-center ${
                  location.pathname === link.to
                    ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Sensory Mode Dropdown Panel */}
        {isSensoryOpen && (
          <div
            role="dialog"
            aria-label={t('sensory.title')}
            className="border-t border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-4 shadow-xl"
          >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                🛠️ {t('sensory.title')}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {sensoryOptions.map((opt) => {
                  const active = isModeActive(opt.mode)
                  return (
                    <button
                      key={opt.mode}
                      type="button"
                      onClick={() => toggleMode(opt.mode)}
                      aria-pressed={active}
                      className={`min-h-[44px] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                        active
                          ? 'bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-400'
                          : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <span>{active ? '✓' : '+'}</span>
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={resetModes}
                  className="min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer underline"
                >
                  {t('sensory.reset')}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <header className="text-center flex flex-col items-center gap-3">
        <span className="text-5xl" aria-hidden="true">🌐</span>
        <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-100">
          {t('about.title')}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
          {t('about.tagline')}
        </p>
      </header>

      {/* The Problem */}
      <section className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {t('about.problem_title')}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-base">
          {t('about.problem_desc')} Most navigation apps assume full mobility, hearing, and vision, leaving millions unable to independently plan travel, access sanitary facilities, or decipher critical documents.
        </p>
      </section>

      {/* The Solution & Mission */}
      <section className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {t('about.mission_title')}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-base">
          {t('about.mission_desc')}
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
          <li><strong>Accessible Places & Washrooms:</strong> OpenStreetMap data with verified ramps, elevators, and cleanliness ratings.</li>
          <li><strong>Voice-First AI Assistant:</strong> Real-time scene description and OCR text reading with natural voice synthesis.</li>
          <li><strong>Continuous Live Captions:</strong> Accessible low-latency speech-to-text with multi-lingual support.</li>
          <li><strong>Government Schemes Matcher:</strong> Simplified eligibility checking across central and state welfare programs.</li>
          <li><strong>One-Touch SOS:</strong> Rapid location transmission to trusted emergency contacts.</li>
        </ul>
      </section>

      {/* Standards & Compliance */}
      <section className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border border-neutral-300 dark:border-neutral-700">
        <h2 className="text-xl font-bold mb-2">Compliance & Technology</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Built strictly adhering to WCAG 2.1 AA standards: 4.5:1 color contrast, fully keyboard-operable, ARIA live regions, scalable typography, and zero tracking cookies.
        </p>
      </section>
    </div>
  )
}

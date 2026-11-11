import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Home() {
  const { t } = useTranslation()

  const features = [
    {
      to: '/places',
      icon: '🗺️',
      title: t('nav.places'),
      desc: t('places.subtitle'),
      color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
    },
    {
      to: '/washrooms',
      icon: '🚻',
      title: t('nav.washrooms'),
      desc: t('washrooms.subtitle'),
      color: 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20',
    },
    {
      to: '/assistant',
      icon: '🎙️',
      title: t('nav.assistant'),
      desc: t('assistant.subtitle'),
      color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
    },
    {
      to: '/captions',
      icon: '💬',
      title: t('nav.captions'),
      desc: t('captions.subtitle'),
      color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
    },
    {
      to: '/schemes',
      icon: '🏛️',
      title: t('nav.schemes'),
      desc: t('schemes.subtitle'),
      color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
    },
    {
      to: '/report',
      icon: '📢',
      title: t('nav.report'),
      desc: t('report.subtitle'),
      color: 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20',
    },
  ]

  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 text-sm font-bold border border-blue-300 dark:border-blue-700">
          <span>🌟</span>
          <span>{t('brand')} – 48-Hour Accessibility Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
          {t('tagline')}
        </h1>

        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
          {t('hero_desc')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            to="/places"
            className="min-h-[52px] px-8 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg transition-transform focus-visible:ring-4 focus-visible:ring-blue-300 flex items-center gap-2"
          >
            <span>🧭</span>
            <span>{t('explore_features')}</span>
          </Link>
          <Link
            to="/assistant"
            className="min-h-[52px] px-8 py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base shadow-lg transition-transform focus-visible:ring-4 focus-visible:ring-purple-300 flex items-center gap-2"
          >
            <span>🎙️</span>
            <span>{t('nav.assistant')}</span>
          </Link>
        </div>
      </section>

      {/* 6 Feature Cards */}
      <section
        aria-labelledby="features-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <h2 id="features-heading" className="sr-only">
          Core Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className={`p-6 rounded-2xl border-2 ${f.color} hover:shadow-xl transition-all flex flex-col justify-between gap-4 group focus-visible:ring-4 focus-visible:ring-blue-600`}
            >
              <div>
                <span className="text-4xl block mb-3" aria-hidden="true">
                  {f.icon}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {f.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400">
                <span>Open Tool</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Bath,
  Bot,
  Captions,
  Compass,
  FileText,
  Flag,
  MapPin,
  Sparkles,
} from 'lucide-react'

export function Home() {
  const { t } = useTranslation()

  const features = [
    { to: '/places', icon: MapPin, title: t('nav.places'), desc: t('places.subtitle') },
    { to: '/washrooms', icon: Bath, title: t('nav.washrooms'), desc: t('washrooms.subtitle') },
    { to: '/assistant', icon: Bot, title: t('nav.assistant'), desc: t('assistant.subtitle') },
    { to: '/captions', icon: Captions, title: t('nav.captions'), desc: t('captions.subtitle') },
    { to: '/schemes', icon: FileText, title: t('nav.schemes'), desc: t('schemes.subtitle') },
    { to: '/report', icon: Flag, title: t('nav.report'), desc: t('report.subtitle') },
  ]

  return (
    <div className="flex flex-col gap-10 py-2">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
          <div
            data-accent-fill="true"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-sm font-bold text-[var(--accent-ink)]"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t('home.badge')}</span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            {t('tagline')}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
            {t('hero_desc')}
          </p>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/places"
              data-action-fill="true"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[var(--action)] px-6 py-3 text-base font-bold text-[var(--action-ink)] shadow-sm transition-colors hover:bg-[var(--action-hover)]"
            >
              <Compass className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{t('explore_features')}</span>
            </Link>

            <Link
              to="/assistant"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-6 py-3 text-base font-bold text-[var(--ink)] transition-colors hover:opacity-90"
            >
              <Bot className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{t('nav.assistant')}</span>
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-heading" className="flex flex-col gap-5">
        <h2 id="features-heading" className="text-2xl font-bold text-[var(--ink)]">
          {t('home.features_heading')}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <span
                  data-accent-fill="true"
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-ink)]"
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{desc}</p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent-text)]">
                <span>{t('home.open_tool')}</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

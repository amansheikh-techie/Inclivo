import { useTranslation } from 'react-i18next'
import {
  Bot,
  Captions,
  FileCheck2,
  Globe,
  MapPinned,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Card } from '../components/ui'

export function About() {
  const { t } = useTranslation()

  const solutions = [
    {
      title: t('about_ui.feat_places_title'),
      desc: t('about_ui.feat_places_desc'),
      icon: MapPinned,
    },
    {
      title: t('about_ui.feat_assistant_title'),
      desc: t('about_ui.feat_assistant_desc'),
      icon: Bot,
    },
    {
      title: t('about_ui.feat_captions_title'),
      desc: t('about_ui.feat_captions_desc'),
      icon: Captions,
    },
    {
      title: t('about_ui.feat_schemes_title'),
      desc: t('about_ui.feat_schemes_desc'),
      icon: FileCheck2,
    },
    {
      title: t('about_ui.feat_sos_title'),
      desc: t('about_ui.feat_sos_desc'),
      icon: ShieldAlert,
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span
          data-accent-fill="true"
          className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <Globe className="w-7 h-7" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            {t('about.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-1 max-w-2xl">
            {t('about.tagline')}
          </p>
        </div>
      </header>

      <Card>
        <h2 className="text-xl font-bold text-[var(--ink)] mb-2">
          {t('about.problem_title')}
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
          {t('about.problem_desc')} {t('about_ui.problem_detail')}
        </p>
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)] mb-2">
            {t('about.mission_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
            {t('about.mission_desc')}
          </p>
        </div>

        <div className="pt-2 border-t border-[var(--border)] space-y-3">
          <h3 className="text-base font-bold text-[var(--ink)]">
            {t('about_ui.solutions_heading')}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {solutions.map(({ title, desc, icon: Icon }) => (
              <li
                key={title}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]"
              >
                <Icon
                  className="w-5 h-5 shrink-0 mt-0.5 text-[var(--accent-text)]"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">{title}</p>
                  <p className="text-xs text-[var(--ink-muted)] mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="bg-[var(--surface-muted)]">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="w-6 h-6 shrink-0 mt-0.5 text-[var(--accent-text)]"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-lg font-bold text-[var(--ink)]">
              {t('about_ui.compliance_title')}
            </h2>
            <p className="text-sm text-[var(--ink-muted)] mt-1 leading-relaxed">
              {t('about_ui.compliance_desc')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

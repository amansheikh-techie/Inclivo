import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Contrast, Eye, Moon, RotateCcw, Sparkles, Type, X } from 'lucide-react'
import type { SensoryMode } from '../hooks/useSensoryMode'

interface SensoryDrawerProps {
  open: boolean
  onClose: () => void
  isModeActive: (mode: SensoryMode) => boolean
  toggleMode: (mode: SensoryMode) => void
  resetModes: () => void
}

export function SensoryDrawer({
  open,
  onClose,
  isModeActive,
  toggleMode,
  resetModes,
}: SensoryDrawerProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const options: { mode: SensoryMode; label: string; icon: typeof Moon }[] = [
    { mode: 'dark', label: t('sensory.dark_mode'), icon: Moon },
    { mode: 'high-contrast', label: t('sensory.high_contrast'), icon: Contrast },
    { mode: 'large-text', label: t('sensory.large_text'), icon: Type },
    { mode: 'reduce-motion', label: t('sensory.reduce_motion'), icon: Sparkles },
    { mode: 'dyslexia', label: t('sensory.dyslexia_font'), icon: Eye },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 p-3 sm:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sensory-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--ink)] shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <h2 id="sensory-dialog-title" className="text-base font-bold">
            {t('sensory.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('nav.close')}
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {options.map(({ mode, label, icon: Icon }) => {
            const active = isModeActive(mode)
            return (
              <button
                key={mode}
                type="button"
                onClick={() => toggleMode(mode)}
                aria-pressed={active}
                data-accent-fill={active ? 'true' : undefined}
                className={`flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-[var(--primary)] bg-[var(--accent)] text-[var(--accent-ink)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-muted)]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex justify-end border-t border-[var(--border)] pt-3">
          <button
            type="button"
            onClick={resetModes}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{t('sensory.reset')}</span>
          </button>
        </div>
      </section>
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

interface ToastProps {
  message: string | null
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const { t } = useTranslation()
  if (!message) return null

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info
  const toneClass =
    type === 'success'
      ? 'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-ink)]'
      : type === 'error'
      ? 'border-[var(--danger-border)] bg-[var(--danger-solid)] text-[var(--danger-solid-ink)]'
      : 'border-[var(--border)] bg-[var(--primary)] text-white'

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-36 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-md lg:bottom-24"
    >
      <div
        role="status"
        className={`flex items-center gap-3 rounded-2xl border-2 p-4 shadow-xl ${toneClass}`}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('nav.close')}
          className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl hover:bg-white/15"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}

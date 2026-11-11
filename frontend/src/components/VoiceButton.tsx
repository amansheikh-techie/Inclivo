import { Mic, Square } from 'lucide-react'

interface VoiceButtonProps {
  isListening: boolean
  onClick: () => void
  label?: string
  ariaLabel?: string
  disabled?: boolean
}

export function VoiceButton({
  isListening,
  onClick,
  label,
  ariaLabel = 'Activate voice input',
  disabled = false,
}: VoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={isListening}
      className={`min-h-[60px] min-w-[60px] px-7 py-4 rounded-full font-bold inline-flex items-center justify-center gap-3 transition-colors text-base shadow-md cursor-pointer ${
        isListening
          ? 'bg-[var(--danger-solid)] text-[var(--danger-solid-ink)] ring-4 ring-[var(--danger-border)]'
          : 'bg-[var(--action)] hover:bg-[var(--action-hover)] text-[var(--action-ink)]'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isListening ? (
        <Square className="w-5 h-5 shrink-0 fill-current" aria-hidden="true" />
      ) : (
        <Mic className="w-6 h-6 shrink-0" aria-hidden="true" />
      )}
      {label && <span>{label}</span>}
    </button>
  )
}

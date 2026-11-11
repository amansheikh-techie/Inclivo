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
      className={`min-h-[48px] min-w-[48px] px-5 py-3 rounded-full font-bold flex items-center justify-center gap-3 transition-colors text-base shadow-md cursor-pointer ${
        isListening
          ? 'bg-red-600 text-white ring-4 ring-red-300 animate-pulse'
          : 'bg-blue-700 text-white hover:bg-blue-800'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span aria-hidden="true" className="text-xl">
        {isListening ? '⏹' : '🎤'}
      </span>
      {label && <span>{label}</span>}
    </button>
  )
}

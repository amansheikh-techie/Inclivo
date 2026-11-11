import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CaptionBoxProps {
  transcript: string
  interimTranscript: string
  isListening: boolean
  isSupported: boolean
  onToggle: () => void
  onClear: () => void
}

export function CaptionBox({
  transcript,
  interimTranscript,
  isListening,
  isSupported,
  onToggle,
  onClear,
}: CaptionBoxProps) {
  const { t } = useTranslation()
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large')

  const fontClasses = {
    normal: 'text-lg leading-relaxed',
    large: 'text-2xl md:text-3xl leading-relaxed',
    huge: 'text-3xl md:text-5xl leading-relaxed font-semibold',
  }

  const saveTranscriptAsFile = () => {
    const textToSave = transcript + (interimTranscript ? `\n${interimTranscript}` : '')
    if (!textToSave.trim()) return

    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inclivo-transcript-${new Date().toISOString().slice(0, 10)}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section
      aria-label="Live Speech Captions Display"
      className="flex flex-col gap-4 w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            disabled={!isSupported}
            aria-pressed={isListening}
            className={`min-h-[44px] px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            } disabled:opacity-50`}
          >
            <span>{isListening ? '⏹' : '▶'}</span>
            <span>{isListening ? t('captions.stop') : t('captions.start')}</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!transcript && !interimTranscript}
            className="min-h-[44px] px-4 py-2 rounded-lg font-medium text-sm bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="caption-size-select" className="text-sm font-semibold">
            {t('captions.font_size')}:
          </label>
          <select
            id="caption-size-select"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as any)}
            className="min-h-[44px] px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm font-medium"
          >
            <option value="normal">Standard</option>
            <option value="large">Large</option>
            <option value="huge">Extra Large</option>
          </select>

          <button
            type="button"
            onClick={saveTranscriptAsFile}
            disabled={!transcript.trim()}
            className="min-h-[44px] px-4 py-2 rounded-lg font-semibold text-sm bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer disabled:opacity-40 flex items-center gap-2"
          >
            <span>💾</span>
            <span>{t('captions.save_txt')}</span>
          </button>
        </div>
      </div>

      {!isSupported && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-sm"
        >
          ⚠️ {t('captions.unsupported')}
        </div>
      )}

      <div
        role="region"
        aria-live="polite"
        aria-atomic="false"
        className="w-full min-h-[300px] max-h-[500px] overflow-y-auto p-6 rounded-2xl bg-black text-amber-300 border-4 border-amber-400 font-mono shadow-inner"
      >
        {transcript || interimTranscript ? (
          <div>
            <span className={fontClasses[fontSize]}>{transcript}</span>
            {interimTranscript && (
              <span
                className={`${fontClasses[fontSize]} text-amber-100 italic ml-2 opacity-80`}
              >
                {interimTranscript}
              </span>
            )}
          </div>
        ) : (
          <p className="text-neutral-500 italic text-base">
            {isListening ? t('captions.listening') : 'Press "Start Captions" and speak into your microphone.'}
          </p>
        )}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  Download,
  MessageSquareText,
  Mic,
  PauseCircle,
  Radio,
  Square,
  Trash2,
  Type,
} from 'lucide-react'
import { ActionButton, Card, SecondaryButton } from './ui'

interface CaptionBoxProps {
  transcript: string
  interimTranscript: string
  isListening: boolean
  isSupported: boolean
  onToggle: () => void
  onClear: () => void
}

type FontSize = 'normal' | 'large' | 'huge'

export function CaptionBox({
  transcript,
  interimTranscript,
  isListening,
  isSupported,
  onToggle,
  onClear,
}: CaptionBoxProps) {
  const { t } = useTranslation()
  const [fontSize, setFontSize] = useState<FontSize>('large')

  const fontClasses: Record<FontSize, string> = {
    normal: 'text-lg sm:text-xl leading-relaxed',
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
    <section aria-label={t('captions_ui.region_label')} className="flex flex-col gap-4 w-full">
      <Card className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggle}
            disabled={!isSupported}
            aria-pressed={isListening}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-[var(--action)] hover:bg-[var(--action-hover)] text-[var(--action-ink)]'
            }`}
          >
            {isListening ? (
              <Square className="w-4 h-4 shrink-0 fill-current" aria-hidden="true" />
            ) : (
              <Mic className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{isListening ? t('captions.stop') : t('captions.start')}</span>
          </button>

          <SecondaryButton
            type="button"
            onClick={onClear}
            disabled={!transcript && !interimTranscript}
          >
            <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t('captions_ui.clear')}</span>
          </SecondaryButton>

          <span
            data-accent-fill={isListening ? 'true' : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              isListening
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent'
                : 'bg-[var(--surface-muted)] text-[var(--ink-muted)] border-[var(--border)]'
            }`}
          >
            {isListening ? (
              <Radio className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <PauseCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {isListening ? t('captions_ui.status_live') : t('captions_ui.status_paused')}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label
            htmlFor="caption-size-select"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]"
          >
            <Type className="w-4 h-4 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
            <span>{t('captions.font_size')}:</span>
          </label>
          <select
            id="caption-size-select"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as FontSize)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm font-medium"
          >
            <option value="normal">{t('captions_ui.size_normal')}</option>
            <option value="large">{t('captions_ui.size_large')}</option>
            <option value="huge">{t('captions_ui.size_huge')}</option>
          </select>

          <ActionButton
            type="button"
            onClick={saveTranscriptAsFile}
            disabled={!transcript.trim()}
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t('captions.save_txt')}</span>
          </ActionButton>
        </div>
      </Card>

      {!isSupported && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-2xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 text-sm font-medium"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{t('captions.unsupported')}</span>
        </div>
      )}

      <div
        role="region"
        aria-label={t('captions_ui.region_label')}
        aria-live="polite"
        aria-atomic="false"
        className="w-full min-h-[320px] max-h-[520px] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-[#0B1120] text-[#FDE68A] border-2 border-[var(--accent)] shadow-inner"
      >
        {transcript || interimTranscript ? (
          <div className="space-y-2">
            <span className={fontClasses[fontSize]}>{transcript}</span>
            {interimTranscript && (
              <span
                className={`${fontClasses[fontSize]} text-[#F8FAFC] italic ml-2 opacity-85`}
              >
                {interimTranscript}
              </span>
            )}
          </div>
        ) : (
          <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center gap-3 text-[#CBD5E1]">
            <MessageSquareText className="w-9 h-9 opacity-80" aria-hidden="true" />
            <p className="text-base font-semibold text-white">
              {isListening ? t('captions.listening') : t('captions_ui.empty_title')}
            </p>
            <p className="text-sm max-w-md text-[#CBD5E1]">
              {t('captions_ui.empty_desc')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

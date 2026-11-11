import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Info } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { CaptionBox } from '../components/CaptionBox'

export function Captions() {
  const { t } = useTranslation()
  const [selectedLang, setSelectedLang] = useState('en-IN')

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: selectedLang,
  })

  const languages = [
    { code: 'en-IN', label: 'English (India)' },
    { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
    { code: 'te-IN', label: 'తెలుగు (Telugu)' },
    { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  ]

  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            {t('captions.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--ink-muted)]">
            {t('captions.subtitle')}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)]">
            <Info className="w-3.5 h-3.5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
            <span>{t('captions_ui.browser_speech_note')}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <label
            htmlFor="caption-lang-select"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]"
          >
            <Globe className="w-4 h-4 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
            <span>{t('captions_ui.audio_language')}:</span>
          </label>
          <select
            id="caption-lang-select"
            value={selectedLang}
            disabled={isListening}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm font-semibold disabled:opacity-50"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <CaptionBox
        transcript={transcript}
        interimTranscript={interimTranscript}
        isListening={isListening}
        isSupported={isSupported}
        onToggle={handleToggle}
        onClear={resetTranscript}
      />
    </div>
  )
}

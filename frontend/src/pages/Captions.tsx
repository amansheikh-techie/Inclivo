import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100">
            {t('captions.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            {t('captions.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="caption-lang-select" className="text-sm font-semibold">
            Audio Language:
          </label>
          <select
            id="caption-lang-select"
            value={selectedLang}
            disabled={isListening}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold"
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

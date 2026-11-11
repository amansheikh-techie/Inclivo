import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeak } from '../hooks/useSpeak'
import { VoiceButton } from '../components/VoiceButton'

export function Assistant() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [assistantReply, setAssistantReply] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [activeTask, setActiveTask] = useState<'chat' | 'describe' | 'ocr'>('chat')

  const { speak, stop, repeat, isSpeaking, hasSpoken } = useSpeak()
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  } = useSpeechRecognition({ continuous: false, interimResults: false })

  // Handle voice commands & queries when speech concludes
  useEffect(() => {
    if (!transcript.trim()) return

    const lower = transcript.toLowerCase()

    // Voice command dispatching
    if (lower.includes('washroom') || lower.includes('toilet') || lower.includes('restroom')) {
      const msg = 'Navigating you to accessible washrooms.'
      setAssistantReply(msg)
      speak(msg)
      setTimeout(() => navigate('/washrooms'), 1200)
      return
    }

    if (lower.includes('scheme') || lower.includes('pension') || lower.includes('welfare')) {
      const msg = 'Opening government schemes finder for you.'
      setAssistantReply(msg)
      speak(msg)
      setTimeout(() => navigate('/schemes'), 1200)
      return
    }

    if (lower.includes('place') || lower.includes('ramp') || lower.includes('map')) {
      const msg = 'Navigating to accessible places map.'
      setAssistantReply(msg)
      speak(msg)
      setTimeout(() => navigate('/places'), 1200)
      return
    }

    // Default: chat query to backend assistant
    setLoading(true)
    api.chatAssistant(transcript, i18n.language)
      .then((res) => {
        setAssistantReply(res.reply)
        speak(res.reply)
      })
      .catch(() => {
        const errorMsg = 'Could not reach assistant server. Please try again.'
        setAssistantReply(errorMsg)
        speak(errorMsg)
      })
      .finally(() => setLoading(false))
  }, [transcript, i18n.language, navigate, speak])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      if (activeTask === 'describe') {
        const res = await api.describeImage(file)
        setAssistantReply(res.description)
        speak(res.description)
      } else {
        const res = await api.ocrImage(file)
        setAssistantReply(res.text)
        speak(res.text)
      }
    } catch {
      const errMsg = 'Image processing failed. Please try another image.'
      setAssistantReply(errMsg)
      speak(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const triggerUpload = (task: 'describe' | 'ocr') => {
    setActiveTask(task)
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <header className="text-center flex flex-col items-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100">
          {t('assistant.title')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-xl">
          {t('assistant.subtitle')}
        </p>
        <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border border-purple-300">
          💡 {t('assistant.voice_commands_tip')}
        </span>
      </header>

      {/* Main Big Voice Button */}
      <section
        aria-label="Voice conversation area"
        className="flex flex-col items-center justify-center gap-6 p-8 bg-neutral-100 dark:bg-neutral-800 rounded-3xl border border-neutral-300 dark:border-neutral-700 shadow-sm text-center"
      >
        <VoiceButton
          isListening={isListening}
          onClick={isListening ? stopListening : startListening}
          label={isListening ? t('assistant.listening') : t('assistant.speak_button')}
          ariaLabel="Tap to activate voice input and speak to assistant"
          disabled={!isSupported || loading}
        />

        {!isSupported && (
          <p className="text-amber-800 dark:text-amber-300 text-xs font-medium">
            ⚠️ Web Speech API not enabled in this browser. Please use Chrome or Edge.
          </p>
        )}

        {/* Audio control actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={repeat}
            disabled={!hasSpoken}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 font-bold text-sm cursor-pointer disabled:opacity-40 flex items-center gap-2"
          >
            <span>🔁</span>
            <span>{t('assistant.repeat')}</span>
          </button>

          <button
            type="button"
            onClick={stop}
            disabled={!isSpeaking}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800 hover:bg-red-200 font-bold text-sm cursor-pointer disabled:opacity-40 flex items-center gap-2"
          >
            <span>⏹</span>
            <span>{t('assistant.stop')}</span>
          </button>
        </div>
      </section>

      {/* Vision & OCR actions */}
      <section
        aria-label="Vision assistance tools"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => triggerUpload('describe')}
          disabled={loading}
          className="min-h-[64px] p-4 rounded-2xl border-2 border-purple-400 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-left flex items-center gap-4 cursor-pointer focus-visible:ring-4 focus-visible:ring-purple-500"
        >
          <span className="text-3xl" aria-hidden="true">📷</span>
          <div>
            <h2 className="font-bold text-neutral-900 dark:text-neutral-100 text-base">
              {t('assistant.describe_scene')}
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Take photo to hear obstacle analysis
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => triggerUpload('ocr')}
          disabled={loading}
          className="min-h-[64px] p-4 rounded-2xl border-2 border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-left flex items-center gap-4 cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-500"
        >
          <span className="text-3xl" aria-hidden="true">📄</span>
          <div>
            <h2 className="font-bold text-neutral-900 dark:text-neutral-100 text-base">
              {t('assistant.read_document')}
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Read signboards, receipts, or forms aloud
            </p>
          </div>
        </button>
      </section>

      {/* Live Region for Screen Readers & Response Display */}
      <section
        aria-live="assertive"
        aria-atomic="true"
        className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 min-h-[140px] shadow-sm flex flex-col justify-between"
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            {loading ? 'Processing...' : isSpeaking ? t('assistant.status_speaking') : 'Assistant Output'}
          </span>
          <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mt-2 leading-relaxed">
            {assistantReply || t('assistant.status_idle')}
          </p>
        </div>

        {transcript && (
          <p className="text-xs text-neutral-500 mt-4 border-t pt-2 border-neutral-200 dark:border-neutral-800">
            Last heard: &ldquo;{transcript}&rdquo;
          </p>
        )}
      </section>
    </div>
  )
}

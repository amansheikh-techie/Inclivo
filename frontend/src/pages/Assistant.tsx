import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  Bot,
  Camera,
  FileText,
  Info,
  RotateCcw,
  Send,
  Sparkles,
  User,
  VolumeX,
} from 'lucide-react'
import { api, useDemoData } from '../lib/api'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeak } from '../hooks/useSpeak'
import { VoiceButton } from '../components/VoiceButton'
import {
  ActionButton,
  Card,
  DemoBanner,
  SecondaryButton,
  StateMessage,
} from '../components/ui'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  isError?: boolean
}

export function Assistant() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isDemo = useDemoData()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastTranscriptRef = useRef<string>('')
  const navTimerRef = useRef<number | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorPrompt, setErrorPrompt] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<'describe' | 'ocr'>('describe')

  const { speak, stop, repeat, isSpeaking, hasSpoken } = useSpeak()
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  } = useSpeechRecognition({ continuous: false, interimResults: false })

  const appendMessage = useCallback(
    (role: 'user' | 'assistant', text: string, isError = false) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, role, text, isError },
      ])
    },
    [],
  )

  const submitPrompt = useCallback(
    async (rawText: string) => {
      const clean = rawText.trim()
      if (!clean) return

      setErrorPrompt(null)
      appendMessage('user', clean)

      const lower = clean.toLowerCase()
      const routes: { match: boolean; msg: string; to: string }[] = [
        {
          match:
            lower.includes('washroom') ||
            lower.includes('toilet') ||
            lower.includes('restroom'),
          msg: t('assistant_ui.nav_washrooms'),
          to: '/washrooms',
        },
        {
          match:
            lower.includes('scheme') ||
            lower.includes('pension') ||
            lower.includes('welfare'),
          msg: t('assistant_ui.nav_schemes'),
          to: '/schemes',
        },
        {
          match:
            lower.includes('place') ||
            lower.includes('ramp') ||
            lower.includes('map'),
          msg: t('assistant_ui.nav_places'),
          to: '/places',
        },
      ]

      const navHit = routes.find((r) => r.match)
      if (navHit) {
        appendMessage('assistant', navHit.msg)
        speak(navHit.msg)
        if (navTimerRef.current) window.clearTimeout(navTimerRef.current)
        navTimerRef.current = window.setTimeout(() => navigate(navHit.to), 1200)
        return
      }

      setLoading(true)
      try {
        const res = await api.chatAssistant(clean, i18n.language)
        appendMessage('assistant', res.reply)
        speak(res.reply)
      } catch {
        const errMsg = t('assistant_ui.error_server')
        setErrorPrompt(clean)
        appendMessage('assistant', errMsg, true)
        speak(errMsg)
      } finally {
        setLoading(false)
      }
    },
    [appendMessage, i18n.language, navigate, speak, t],
  )

  useEffect(() => {
    const clean = transcript.trim()
    if (!clean || clean === lastTranscriptRef.current) return
    lastTranscriptRef.current = clean
    void Promise.resolve().then(() => submitPrompt(clean))
  }, [transcript, submitPrompt])

  useEffect(() => {
    return () => {
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current)
    }
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const taskLabel =
      activeTask === 'describe'
        ? t('assistant.describe_scene')
        : t('assistant.read_document')
    appendMessage('user', `${taskLabel}: ${file.name}`)
    setLoading(true)
    setErrorPrompt(null)

    try {
      if (activeTask === 'describe') {
        const res = await api.describeImage(file)
        appendMessage('assistant', res.description)
        speak(res.description)
      } else {
        const res = await api.ocrImage(file)
        appendMessage('assistant', res.text)
        speak(res.text)
      }
    } catch {
      const errMsg = t('assistant_ui.error_image')
      appendMessage('assistant', errMsg, true)
      speak(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const triggerUpload = (task: 'describe' | 'ocr') => {
    setActiveTask(task)
    fileInputRef.current?.click()
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim() || loading) return
    const q = textInput.trim()
    setTextInput('')
    void submitPrompt(q)
  }

  const suggestedPrompts = [
    t('assistant_ui.prompt_washrooms'),
    t('assistant_ui.prompt_schemes'),
    t('assistant_ui.prompt_places'),
    t('assistant_ui.prompt_help'),
  ]

  const latestAssistant = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')?.text

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner />}

      <header className="flex flex-col items-start gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          {t('assistant.title')}
        </h1>
        <p className="text-sm sm:text-base text-[var(--ink-muted)] max-w-2xl">
          {t('assistant.subtitle')}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-muted)]">
            <Info className="w-3.5 h-3.5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
            <span>{t('assistant_ui.browser_speech_note')}</span>
          </span>
          <span
            data-accent-fill="true"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-ink)]"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t('assistant.voice_commands_tip')}</span>
          </span>
        </div>
      </header>

      {/* Main Voice Hero Card */}
      <Card className="p-6 sm:p-8 flex flex-col items-center justify-center gap-5 text-center">
        <section
          aria-label={t('assistant_ui.voice_region_label')}
          className="flex flex-col items-center gap-5 w-full"
        >
          <VoiceButton
            isListening={isListening}
            onClick={isListening ? stopListening : startListening}
            label={isListening ? t('assistant.listening') : t('assistant.speak_button')}
            ariaLabel={t('assistant_ui.speak_aria')}
            disabled={!isSupported || loading}
          />

          {!isSupported && (
            <p
              role="status"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-500/40 text-amber-950 dark:text-amber-100 text-xs font-medium"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('captions.unsupported')}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SecondaryButton type="button" onClick={repeat} disabled={!hasSpoken}>
              <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('assistant.repeat')}</span>
            </SecondaryButton>

            <button
              type="button"
              onClick={stop}
              disabled={!isSpeaking}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('assistant.stop')}</span>
            </button>
          </div>
        </section>
      </Card>

      {/* Camera / Upload Vision & OCR Actions */}
      <section
        aria-label={t('assistant_ui.vision_region_label')}
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
          tabIndex={-1}
        />

        <button
          type="button"
          onClick={() => triggerUpload('describe')}
          disabled={loading}
          className="min-h-[76px] p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-left flex items-center gap-4 cursor-pointer shadow-sm transition-colors disabled:opacity-50"
        >
          <span
            data-accent-fill="true"
            className="w-12 h-12 rounded-xl bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shrink-0"
          >
            <Camera className="w-6 h-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-bold text-[var(--ink)] text-base">
              {t('assistant.describe_scene')}
            </h2>
            <p className="text-xs text-[var(--ink-muted)] mt-0.5">
              {t('assistant_ui.describe_desc')}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => triggerUpload('ocr')}
          disabled={loading}
          className="min-h-[76px] p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-left flex items-center gap-4 cursor-pointer shadow-sm transition-colors disabled:opacity-50"
        >
          <span
            data-accent-fill="true"
            className="w-12 h-12 rounded-xl bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shrink-0"
          >
            <FileText className="w-6 h-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-bold text-[var(--ink)] text-base">
              {t('assistant.read_document')}
            </h2>
            <p className="text-xs text-[var(--ink-muted)] mt-0.5">
              {t('assistant_ui.ocr_desc')}
            </p>
          </div>
        </button>
      </section>

      {/* Suggested Prompts */}
      <section aria-labelledby="suggested-prompts-heading" className="space-y-2.5">
        <h2
          id="suggested-prompts-heading"
          className="text-sm font-bold text-[var(--ink)] flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-[var(--accent-text)]" aria-hidden="true" />
          <span>{t('assistant_ui.suggested_heading')}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={loading}
              onClick={() => void submitPrompt(prompt)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-xs sm:text-sm font-semibold text-[var(--ink)] cursor-pointer transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* Chat Bubbles + Live Status + Text Input */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <h2 className="text-base font-bold text-[var(--ink)]">
            {t('assistant_ui.chat_heading')}
          </h2>
          <span className="text-xs font-semibold text-[var(--accent-text)]">
            {loading
              ? t('assistant_ui.processing')
              : isSpeaking
                ? t('assistant.status_speaking')
                : t('assistant.status_idle')}
          </span>
        </div>

        {/* Polite/assertive aria-live announcement for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {loading
            ? t('assistant_ui.processing')
            : latestAssistant || t('assistant.status_idle')}
        </div>

        {messages.length === 0 && !loading ? (
          <StateMessage
            kind="empty"
            title={t('assistant_ui.empty_chat_title')}
            description={t('assistant_ui.empty_chat_desc')}
          />
        ) : (
          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {messages.map((m) => {
              const isUser = m.role === 'user'
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      isUser
                        ? 'bg-[var(--action)] text-[var(--action-ink)] border-transparent'
                        : 'bg-[var(--surface-muted)] text-[var(--accent-text)] border-[var(--border)]'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </span>

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? 'bg-[var(--action)] text-[var(--action-ink)]'
                        : m.isError
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 border border-red-400'
                          : 'bg-[var(--surface-muted)] text-[var(--ink)] border border-[var(--border)]'
                    }`}
                  >
                    <p className="text-xs font-bold mb-1 opacity-85">
                      {isUser
                        ? t('assistant_ui.user_label')
                        : t('assistant_ui.assistant_label')}
                    </p>
                    <p>{m.text}</p>
                  </div>
                </div>
              )
            })}

            {loading && (
              <StateMessage kind="loading" title={t('assistant_ui.processing')} />
            )}
          </div>
        )}

        {errorPrompt && !loading && (
          <StateMessage
            kind="error"
            title={t('states.error_title')}
            description={t('assistant_ui.error_server')}
            onRetry={() => void submitPrompt(errorPrompt)}
          />
        )}

        <form onSubmit={handleTextSubmit} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[var(--border)]">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t('assistant_ui.input_placeholder')}
            aria-label={t('assistant_ui.input_placeholder')}
            disabled={loading}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-sm placeholder:text-[var(--ink-muted)]"
          />
          <ActionButton type="submit" disabled={loading || !textInput.trim()}>
            <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t('assistant_ui.send')}</span>
          </ActionButton>
        </form>
      </Card>
    </div>
  )
}

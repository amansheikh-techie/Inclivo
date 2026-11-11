import { useCallback, useEffect, useRef, useState } from 'react'

interface SpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
}

// Window typing for Web Speech API
type SpeechRecognitionType = any

export function useSpeechRecognition({
  continuous = false,
  interimResults = false,
  lang = 'en-IN',
}: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' '
        } else {
          interim += event.results[i][0].transcript
        }
      }

      if (final) {
        setTranscript((prev) => (continuous ? prev + final : final))
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [continuous, interimResults, lang])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      setTranscript('')
      setInterimTranscript('')
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      // Ignore if already active
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}

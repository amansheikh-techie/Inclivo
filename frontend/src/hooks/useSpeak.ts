import { useCallback, useEffect, useState } from 'react'

export function useSpeak() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastSpoken, setLastSpoken] = useState<string>('')

  const speak = useCallback((text: string, lang = 'en-IN') => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.95

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setLastSpoken(text)
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const repeat = useCallback(() => {
    if (lastSpoken) {
      speak(lastSpoken)
    }
  }, [lastSpoken, speak])

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return { speak, stop, repeat, isSpeaking, hasSpoken: !!lastSpoken }
}

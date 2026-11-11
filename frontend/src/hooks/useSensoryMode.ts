import { useEffect, useState } from 'react'

export type SensoryMode =
  | 'dark'
  | 'high-contrast'
  | 'large-text'
  | 'reduce-motion'
  | 'dyslexia'

const STORAGE_KEY = 'inclivo_sensory_modes'

export function useSensoryMode() {
  const [activeModes, setActiveModes] = useState<SensoryMode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (activeModes.length > 0) {
      document.documentElement.setAttribute('data-mode', activeModes.join(' '))
    } else {
      document.documentElement.removeAttribute('data-mode')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeModes))
  }, [activeModes])

  const toggleMode = (mode: SensoryMode) => {
    setActiveModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    )
  }

  const resetModes = () => {
    setActiveModes([])
  }

  const isModeActive = (mode: SensoryMode) => activeModes.includes(mode)

  return { activeModes, toggleMode, resetModes, isModeActive }
}

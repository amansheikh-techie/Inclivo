import { useSyncExternalStore } from 'react'

export type SensoryMode =
  | 'dark'
  | 'high-contrast'
  | 'large-text'
  | 'reduce-motion'
  | 'dyslexia'

const STORAGE_KEY = 'inclivo_sensory_modes'
const listeners = new Set<() => void>()

function readInitialModes(): SensoryMode[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function applyModesToDom(modes: SensoryMode[]) {
  if (modes.length > 0) {
    document.documentElement.setAttribute('data-mode', modes.join(' '))
  } else {
    document.documentElement.removeAttribute('data-mode')
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(modes))
}

let activeModes: SensoryMode[] = readInitialModes()
applyModesToDom(activeModes)

function updateModes(next: SensoryMode[]) {
  activeModes = next
  applyModesToDom(activeModes)
  listeners.forEach((listener) => listener())
}

const toggleMode = (mode: SensoryMode) => {
  updateModes(
    activeModes.includes(mode)
      ? activeModes.filter((m) => m !== mode)
      : [...activeModes, mode]
  )
}

const setMode = (mode: SensoryMode, enabled: boolean) => {
  const has = activeModes.includes(mode)
  if (enabled === has) return
  updateModes(enabled ? [...activeModes, mode] : activeModes.filter((m) => m !== mode))
}

const resetModes = () => {
  updateModes([])
}

const isModeActive = (mode: SensoryMode) => activeModes.includes(mode)

export function useSensoryMode() {
  const modes = useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => activeModes,
    () => []
  )

  return { activeModes: modes, toggleMode, setMode, resetModes, isModeActive }
}

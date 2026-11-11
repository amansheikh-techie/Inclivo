interface ToastProps {
  message: string | null
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  if (!message) return null

  const bgStyles =
    type === 'success'
      ? 'bg-emerald-800 text-white border-emerald-500'
      : type === 'error'
      ? 'bg-red-800 text-white border-red-500'
      : 'bg-neutral-900 text-white border-neutral-700'

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md shadow-2xl rounded-lg"
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border-2 ${bgStyles}`}
        role="status"
      >
        <span className="font-medium text-sm flex-1">{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </aside>
  )
}

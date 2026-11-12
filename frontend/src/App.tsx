import { Suspense, lazy, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BottomNav } from './components/BottomNav'
import { SensoryDrawer } from './components/SensoryDrawer'
import { Sidebar } from './components/Sidebar'
import { SOSButton } from './components/SOSButton'
import { TopBar } from './components/TopBar'
import { useSensoryMode } from './hooks/useSensoryMode'
import { Home } from './pages/Home'

const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Assistant = lazy(() => import('./pages/Assistant').then((m) => ({ default: m.Assistant })))
const Captions = lazy(() => import('./pages/Captions').then((m) => ({ default: m.Captions })))
const Passport = lazy(() => import('./pages/Passport').then((m) => ({ default: m.Passport })))
const Places = lazy(() => import('./pages/Places').then((m) => ({ default: m.Places })))
const Report = lazy(() => import('./pages/Report').then((m) => ({ default: m.Report })))
const Schemes = lazy(() => import('./pages/Schemes').then((m) => ({ default: m.Schemes })))
const Washrooms = lazy(() => import('./pages/Washrooms').then((m) => ({ default: m.Washrooms })))

export default function App() {
  const { t } = useTranslation()
  const { activeModes, toggleMode, resetModes, isModeActive } = useSensoryMode()
  const [isSensoryOpen, setIsSensoryOpen] = useState(false)

  return (
    <Router>
      <a
        href="#main-content"
        data-action-fill="true"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-[var(--action)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-[var(--action-ink)] focus:shadow-lg"
      >
        {t('nav.skip_to_content')}
      </a>

      <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <Sidebar
          onOpenSensory={() => setIsSensoryOpen(true)}
          activeModeCount={activeModes.length}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            onOpenSensory={() => setIsSensoryOpen(true)}
            isSensoryOpen={isSensoryOpen}
            activeModeCount={activeModes.length}
          />

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-10"
          >
            <Suspense
              fallback={
                <div
                  role="status"
                  aria-live="polite"
                  className="py-12 text-center text-sm font-medium text-[var(--ink-muted)]"
                >
                  {t('common.loading', 'Loading...')}
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/places" element={<Places />} />
                <Route path="/washrooms" element={<Washrooms />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/captions" element={<Captions />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/report" element={<Report />} />
                <Route path="/passport" element={<Passport />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </main>

          <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-6 pb-24 text-center text-sm text-[var(--ink-muted)] lg:pb-6">
            <p>{t('footer.copyright')}</p>
          </footer>
        </div>
      </div>

      <BottomNav onOpenSensory={() => setIsSensoryOpen(true)} />
      <SOSButton />

      <SensoryDrawer
        open={isSensoryOpen}
        onClose={() => setIsSensoryOpen(false)}
        isModeActive={isModeActive}
        toggleMode={toggleMode}
        resetModes={resetModes}
      />
    </Router>
  )
}

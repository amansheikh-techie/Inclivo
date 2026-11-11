import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { SOSButton } from './components/SOSButton'
import { Home } from './pages/Home'
import { Places } from './pages/Places'
import { Washrooms } from './pages/Washrooms'
import { Assistant } from './pages/Assistant'
import { Captions } from './pages/Captions'
import { Schemes } from './pages/Schemes'
import { Report } from './pages/Report'
import { Passport } from './pages/Passport'
import { About } from './pages/About'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
        <Navbar />

        <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
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
        </main>

        <SOSButton />

        <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 px-4 text-center text-sm text-neutral-500">
          <p>© 2026 Inclivo. Built for 48-Hour Hackathon. WCAG 2.1 AA Compliant.</p>
        </footer>
      </div>
    </Router>
  )
}

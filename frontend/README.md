# Inclivo Frontend (Accessibility Platform)

> **"Accessibility Without Boundaries"**  
> Built for the 48-Hour Hackathon. WCAG 2.1 AA Compliant.

## 🌟 Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (v4) with high-contrast & sensory theme engine
- **Mapping:** Leaflet & React-Leaflet with OpenStreetMap (OSM)
- **Internationalization:** i18next + react-i18next (English, हिन्दी, తెలుగు, தமிழ்)
- **Assistive Speech:** Web Speech API (`SpeechRecognition` + `SpeechSynthesis`)
- **Authentication & Backend:** Supabase Auth + FastAPI client (`src/lib/api.ts`)

---

## 🚀 Key Features

### 1. Accessible Place Finder (`/places`)
- OpenStreetMap centered on Hyderabad with real-time accessibility markers.
- Multi-filter toggle: ramps, elevators, accessible parking, wheelchair paths, quiet zones.
- Detailed place cards with accessibility score (0–100) and one-click OSM turn-by-turn routing.
- Geolocation "Near Me" instant detection.

### 2. Accessible Washroom Finder (`/washrooms`)
- Verified and community-reported accessible public restrooms.
- Cleanliness star ratings, last-checked verification date, fee indicators.
- Distance and rating sorting.

### 3. Voice-First AI Assistant (`/assistant`)
- Hands-free conversation for blind and low-vision users via Web Speech recognition and synthesis.
- Built-in natural voice commands:
  - *"find washroom"* → Navigates to `/washrooms`
  - *"scheme for blind"* → Navigates to `/schemes`
  - *"read this"* → Triggers OCR text reader
- Vision tools: scene analysis (`/describe-image`) and optical character recognition (`/ocr`).
- Live assertive ARIA regions for screen-reader compatibility.

### 4. Real-Time Captions (`/captions`)
- Continuous speech-to-text with interim and finalized transcript streaming.
- Adjustable font sizes (Standard, Large, Extra Large) with high-contrast text rendering.
- Multilingual capture (`en-IN`, `hi-IN`, `te-IN`, `ta-IN`).
- Single-click transcript export to `.txt`.

### 5. Government Schemes & Eligibility Checker (`/schemes`)
- Directory of central and state welfare programs for persons with disabilities.
- "Explain in Simple Words" AI summarization.
- 4-question interactive eligibility matcher (`POST /api/schemes/match`).
- Direct official portal links with security attributes (`rel="noopener noreferrer"`).

### 6. Accessibility Passport (`/passport`)
- Stores user mobility needs, sensory preferences, and emergency contacts.
- Auto-syncs preferences with Supabase authentication.

### 7. Emergency SOS (`/`)
- Universal floating emergency SOS button present on all pages.
- 2-second hold trigger with a 5-second cancellation grace window.
- Auto-fetches GPS coordinates, sends emergency alert to backend (`POST /api/sos`), and launches SMS/WhatsApp broadcast to trusted contacts.

### 8. Sensory & Display Modes
- High contrast (yellow/black), Large text (130%), Reduced motion, Dyslexia-friendly font.
- Persisted in `localStorage` and toggled via CSS variables and `data-mode` HTML attributes.

---

## 🛠️ Local Development

### 1. Prerequisites
- Node.js LTS (v20+)
- npm

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create `.env` from `.env.example`:
```bash
cp .env.example .env
```
Fill in:
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 5. Production Build
```bash
npm run build
```
Type check and production bundle will be generated in `dist/`.

---

## ♿ Accessibility (WCAG 2.1 AA) Compliance
- **Keyboard Navigation:** Full focus ring visibility, logical tab order, skip-to-content anchor.
- **Contrast & Color:** Minimum 4.5:1 ratio across all elements. Never uses color alone to convey state.
- **Screen Readers:** Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`), descriptive `aria-label` tags, and `aria-live` status regions.
- **Touch Targets:** All interactive controls have a minimum bounding box of 44×44px.

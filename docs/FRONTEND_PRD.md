# Inclivo Frontend PRD

## Goals
- Provide a unified, WCAG 2.1 AA-oriented web interface for discovering accessible places, washrooms, government schemes, community reports, and assistive AI/speech tools.
- Support multilingual access (`en`, `hi`, `te`, `ta`) and customizable sensory/display modes (`dark`, `high-contrast`, `large-text`, `reduce-motion`, `dyslexia`).
- Keep core finders usable even if the backend is offline via built-in mock fallback data (`frontend/src/mocks/*.json`).

## Target Users
- Wheelchair and mobility-impaired users looking for ramps, elevators, accessible parking, and accessible washrooms.
- Blind and low-vision users using voice-first AI chat, scene description, OCR text reading, and screen-reader/TTS output.
- Deaf and hard-of-hearing users needing real-time browser speech-to-text captions and transcript export.
- Neurodivergent and sensory-sensitive users needing quiet places, reduced motion, high contrast, or dyslexia-friendly typography.
- Caregivers and community members reporting accessibility barriers and saving emergency contacts.

## Pages & Routes (`frontend/src/App.tsx`)
- `/` (`Home.tsx`) – Overview, quick navigation cards, and entry point to core tools.
- `/places` (`Places.tsx`) – Leaflet/OSM map and list of accessible places with accessibility score (0–100), feature filters (`has_ramp`, `has_elevator`, `accessible_parking`, `wheelchair_friendly`, `quiet`), geolocation distance sorting (`radius_km` default 5), and OSM routing links.
- `/washrooms` (`Washrooms.tsx`) – Accessible washroom map and cards with cleanliness ratings, verification status/date, geolocation distance sorting, and OSM routing links.
- `/assistant` (`Assistant.tsx`) – Voice-first AI chat (`POST /api/assistant/chat`), image description (`POST /api/assistant/describe-image`), OCR (`POST /api/assistant/ocr`), Web Speech recognition/synthesis, and voice navigation commands.
- `/captions` (`Captions.tsx`) – Real-time Web Speech API captions (`en-IN`, `hi-IN`, `te-IN`, `ta-IN`), adjustable text size, and `.txt` transcript download.
- `/schemes` (`Schemes.tsx`) – Searchable and filterable (`?q=` URL sync) government schemes directory, plain-language AI simplifier (`POST /api/assistant/simplify`), and 4-question eligibility matcher (`POST /api/schemes/match`).
- `/report` (`Report.tsx`) – Community accessibility issue reporting with optional photo upload (`POST /api/reports`), status filtering, and one-upvote-per-user (`POST /api/reports/{id}/upvote` with `409` duplicate toast).
- `/passport` (`Passport.tsx`) – Supabase OTP email sign-in, saved accessibility preferences (`preferred_language`, `font_size`, `sensory_mode` synced to `i18n` and `useSensoryMode`), and emergency contacts CRUD.
- `/about` (`About.tsx`) – Platform overview, accessibility commitments, and limitations.

## Key Shared Components & Hooks
- `TopBar.tsx`, `Sidebar.tsx`, `BottomNav.tsx` – Responsive navigation, global scheme search (`/schemes?q=...`), language switcher, and sensory drawer trigger.
- `SensoryDrawer.tsx` + `useSensoryMode.ts` – Toggles `dark`, `high-contrast`, `large-text` (125%), `reduce-motion`, and `dyslexia` via `html[data-mode]` and `localStorage` (`inclivo_sensory_modes`).
- `SOSButton.tsx` – Floating 2-second-hold SOS trigger with 5-second cancel countdown, GPS lookup, `POST /api/sos` when signed in, and `sms:` / `https://wa.me/` links using the first saved emergency contact (or generic location message fallback).
- `MapView.tsx` – Shared Leaflet + OpenStreetMap marker map.
- `api.ts` – Fetch wrapper attaching Supabase JWTs and providing offline fallback data for places, washrooms, schemes, and reports.

## Client Data Model (`frontend/src/lib/api.ts`)
- `Place` – `id`, `name`, `category`, `lat`, `lng`, `address`, `has_ramp`, `has_elevator`, `accessible_parking`, `wheelchair_friendly`, `quiet`, `rating`, `accessibility_score`, `score_breakdown`, `distance_km`.
- `Washroom` – `id`, `name`, `lat`, `lng`, `address`, `cleanliness_rating`, `verified`, `last_verified`, `distance_km`.
- `Scheme` – `id`, `name`, `display_name`, `description`, `eligibility`, `benefits`, `disability_type`, `state`, `apply_url`.
- `ReportItem` – `id`, `issue_type`, `description`, `lat`, `lng`, `photo_url`, `status`, `upvotes`, `created_at`.
- `PassportData` – `mobility_needs`, `vision_needs`, `hearing_needs`, `preferred_language`, `font_size`, `sensory_mode`.
- `EmergencyContact` – `id`, `user_id`, `name`, `phone`.

## Accessibility Requirements
- Target WCAG 2.1 AA contrast ratios and never convey state by color alone.
- Minimum `44×44px` interactive touch targets across buttons, inputs, and links.
- Skip-to-content link (`#main-content`), semantic landmarks (`header`, `nav`, `main`, `footer`), keyboard navigation, and visible focus rings.
- `aria-live` regions for SOS status, assistant responses, and toast notifications.

## Future Scope
- Full PWA service worker and offline mutation queue.
- Turn-by-turn indoor navigation and voice-guided routing inside venues.
- Additional regional Indian languages and offline speech recognition fallback.


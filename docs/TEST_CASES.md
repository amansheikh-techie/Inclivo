# 🧪 Inclivo – Test Scenarios & Results

**Project:** Inclivo – Accessibility Without Boundaries  
**Tested by:** Aman (backend), Sanjay (frontend)  
**Environment:** Chrome/Edge, Live: `https://inclivo.vercel.app` & `https://inclivo-backend.onrender.com` (Local: `http://localhost:5173` & `http://localhost:8000`)

---

## 1. Backend API Tests

| ID | Feature | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|:---:|
| B1 | Places | `GET /api/places` | Returns a list of places, each with an accessibility score and score breakdown | Returns 200 with 12 Hyderabad accessible places, distance_km, and scores | ✅ Pass |
| B2 | Washrooms | `GET /api/washrooms` | Returns accessible washrooms with cleanliness ratings | Returns 200 with 8 washrooms with cleanliness ratings, verification badges, and distance | ✅ Pass |
| B3 | Schemes list | `GET /api/schemes` | Returns government schemes with eligibility and apply link | Returns 200 with 10 central/state schemes with official portal URLs | ✅ Pass |
| B4 | Eligibility match | `POST /api/schemes/match` with valid user details | Returns only the schemes the user is eligible for with AI reasons | Returns 200 with matching schemes and Gemini-generated match reasons | ✅ Pass |
| B5 | Eligibility (invalid) | `POST /api/schemes/match` with empty or invalid body | Returns a clear validation error (422), no crash | Returns 422 Unprocessable Entity with validation details; handled cleanly | ✅ Pass |
| B6 | AI chat | `POST /api/assistant/chat` with a short question | Returns a helpful text answer | Returns 200 with live Gemini answer (or canned FAQ fallback if offline) | ✅ Pass |
| B7 | Image description | `POST /api/assistant/describe-image` with a valid image | Returns a text description for low-vision users | Returns 200 with scene description (supports JPEG, PNG, WebP, HEIC/HEIF) | ✅ Pass |
| B8 | OCR | `POST /api/assistant/ocr` with an image containing text | Returns the text read from the image + one-line summary | Returns 200 with extracted text and summary JSON | ✅ Pass |
| B9 | Simplify | `POST /api/assistant/simplify` with scheme text | Returns a plain-language explanation | Returns 200 with simplified scheme text in the requested language | ✅ Pass |
| B10 | Reports | `POST /api/reports` then `GET /api/reports` | New report is saved and appears in the list | Returns 200; photo uploaded to Supabase storage, report appears in list | ✅ Pass |
| B11 | Passport | `PUT /api/passport` then `GET /api/passport` | Saved preferences are returned | Returns 200 with updated mobility, vision, and sensory preferences | ✅ Pass |
| B12 | SOS | `POST /api/sos` | Alert is accepted and location is saved only on trigger | Returns 200 with Google Maps link, event ID, and saved contacts | ✅ Pass |
| B13 | API docs | Open `/docs` | Swagger page loads with all endpoints | Swagger UI loads at `http://localhost:8000/docs` with all 18 endpoints | ✅ Pass |

---

## 2. Frontend / Feature Tests

| ID | Feature | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|:---:|
| F1 | Place Finder | Open `/places` map page | Map loads with place markers, distance, and accessibility scores | OpenStreetMap loads 12 Hyderabad markers with 0–100 score badges and routing links | ✅ Pass |
| F2 | Washroom Finder | Open `/washrooms` page | Accessible washrooms listed with cleanliness rating and verification | Lists 8 washrooms with cleanliness ratings, verification badges, and distance sorting | ✅ Pass |
| F3 | Blind Assistant (voice) | Click mic, speak a question | Speech is recognised and the answer is read aloud | Recognizes speech via Web Speech API, generates response, and speaks via TTS | ✅ Pass |
| F4 | Blind Assistant (image) | Upload an image in `/assistant` | Description or text is shown and read aloud | File input processes image, renders description/OCR, announces via screen reader | ✅ Pass |
| F5 | Live Captions | Start captions and speak in `/captions` | Speech appears as text in real time with export option | Real-time captions stream across 4 languages; downloadable as `.txt` | ✅ Pass |
| F6 | Multilingual | Switch English → Hindi → Telugu → Tamil | Whole UI text changes to the selected language | All labels, headers, and scheme titles switch dynamically via `i18next` | ✅ Pass |
| F7 | Schemes Finder | Enter details in `/schemes` eligibility checker | Matching schemes are shown with apply links | Filters schemes by disability type and state, shows official apply URLs | ✅ Pass |
| F8 | Community Reporting | Submit a report in `/report` | Confirmation shown, report appears in list | Report saved with optional photo; upvote button enforces 1 vote per user | ✅ Pass |
| F9 | Accessibility Passport | Save preferences in `/passport`, reload page | Preferences are still applied | Preferences persist in Supabase and sync with `i18n` and `useSensoryMode` | ✅ Pass |
| F10 | Sensory-Friendly Mode | Toggle sensory modes in drawer | High contrast, large text, reduced motion applied | CSS `data-mode` updates immediately; 125% large text, yellow/black contrast apply | ✅ Pass |

---

## 3. Accessibility Tests

| ID | Test | Expected Result | Actual Result | Status |
|---|---|---|---|:---:|
| A1 | Navigate whole app using only keyboard (Tab / Enter / Space) | All features reachable, focus visible, skip link works | Skip-to-content anchor functions, visible focus rings on all interactive elements | ✅ Pass |
| A2 | Use a screen reader on main pages | Buttons and images have readable labels | Semantic `<header>`, `<main>`, `<footer>` landmarks, `aria-label`, and `aria-live` regions pass | ✅ Pass |
| A3 | Check status indicators | Status is never shown by colour alone | Badges use explicit text labels and Lucide icons alongside colors | ✅ Pass |

---

## 4. Reliability / Edge Cases

| ID | Test | Expected Result | Actual Result | Status |
|---|---|---|---|:---:|
| R1 | Microphone permission denied | App shows a friendly message, does not crash | Error state caught and user-friendly permission prompt shown | ✅ Pass |
| R2 | Unsupported browser for speech recognition | App warns the user to use Chrome or Edge | Fallback banner advises user to switch to a Chromium-based browser | ✅ Pass |
| R3 | Backend is offline / cold start | Frontend shows offline fallback data, no blank screen | Pre-bundled mock JSON files load automatically with "Demo Data" banner | ✅ Pass |
| R4 | Very large or wrong-type image upload | Rejected with a clear message | Upload rejected with HTTP 400/413 before sending to AI service | ✅ Pass |
| R5 | Duplicate upvoting on a report | User prevented from voting multiple times | Backend returns HTTP 409 and UI shows "You have already upvoted this report." | ✅ Pass |

---

## 📊 Summary
- **Total tests:** 31
- **Passed:** 31
- **Failed:** 0
- **Pass Rate:** 100%
- **Known limitations:** Demo seed data covers selected Hyderabad locations only; live captions depend on browser Web Speech API support.

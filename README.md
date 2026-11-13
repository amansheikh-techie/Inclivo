# Inclivo – Accessibility Without Boundaries

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20Tailwind%20v4-61DAFB)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688)](backend/)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E)](https://supabase.com)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success)](#-accessibility-commitments)

Inclivo is a unified, AI-powered accessibility companion built to help people with disabilities discover accessible places, communicate more easily, access essential services, and navigate everyday life independently.

> ⚡ **Built from scratch in a 48-hour hackathon by a team of 2.**

**Live demo:** https://inclivo.vercel.app | **Demo video:**  https://drive.google.com/file/d/1ZawvPz5Ohu_GyG_A3_ubkHBRCfxI8aEG/view?usp=drive_link

---

## ❓ Problem
- People with disabilities struggle to find reliable accessibility information (ramps, washrooms, parking).
- Blind and deaf users lack simple, affordable assistive tools in local languages.
- Government schemes are hard to find and understand.

## 💡 Solution
One platform, many tools: accessible by design, multilingual, and AI-powered.

---

## 🚀 Features

### Core (6)
- **Accessible Place Finder (`/places`):** Map of wheelchair-friendly places with ramps, elevators, accessible parking, and a transparent accessibility score (0–100).
- **Accessible Washroom Finder (`/washrooms`):** Accessible washrooms with cleanliness ratings, verification badges, and distance sorting.
- **AI Assistant for Blind Users (`/assistant`):** Voice input, image description (`/describe-image`), OCR text reader (`/ocr`), and voice navigation commands.
- **Live Captions for Deaf Users (`/captions`):** Real-time speech-to-text in 4 languages with adjustable text size and `.txt` transcript download.
- **Multilingual Support:** English, Hindi (हिन्दी), Telugu (తెలుగు), and Tamil (தமிழ்).
- **Government Schemes Finder (`/schemes`):** Directory of welfare schemes, eligibility checker (`/match`), plain-language AI explanations (`/simplify`), and official apply links.

### Additional
- **Community Reporting (`/report`):** Report broken ramps and inaccessible facilities with photo upload and 1-vote-per-user upvoting.
- **Accessibility Passport (`/passport`):** Passwordless email OTP sign-in, saved mobility/sensory preferences, and emergency contacts manager.
- **Emergency Assistance (SOS):** Floating 2-second hold button with a 5-second cancellation grace window; shares live Google Maps location with saved contacts via WhatsApp and SMS.
- **Sensory-Friendly Mode:** Instant toggling for High Contrast (black/yellow), Large Text (125%), Reduced Motion, Dyslexia-friendly font, and Dark mode.
- **Offline Fallback Data:** Pre-bundled mock datasets keep places, washrooms, schemes, and reports functional even when the backend is unreachable.

### Implementation Status
| Feature | Status | Endpoint / Layer |
|---|---|---|
| Place Finder | Implemented | `GET /api/places`, `GET /api/places/{id}` |
| Washroom Finder | Implemented | `GET /api/washrooms` |
| Blind Assistant | Implemented | `POST /api/assistant/chat`, `/describe-image`, `/ocr` + Web Speech |
| Live Captions | Implemented | Browser Web Speech API + `.txt` export |
| Multilingual | Implemented | `i18next` (`en`, `hi`, `te`, `ta`) |
| Schemes Finder | Implemented | `GET /api/schemes`, `POST /api/schemes/match`, `/simplify` |
| Community Reporting | Implemented | `GET/POST /api/reports`, `POST /api/reports/{id}/upvote` (1-vote/user) |
| Accessibility Passport | Implemented | `GET/PUT /api/passport`, `GET/POST/DELETE /api/contacts` |
| SOS | Implemented | `POST /api/sos` + SMS & WhatsApp direct share |
| Sensory Mode | Implemented | `dark`, `high-contrast`, `large-text`, `reduce-motion`, `dyslexia` |

---

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, Lucide React |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, SlowAPI rate limiter |
| **Database / Auth / Storage** | Supabase (PostgreSQL, Row Level Security, Storage, OTP Auth) |
| **AI** | Google Gemini API (`google-genai` SDK) |
| **Maps** | Leaflet + OpenStreetMap |
| **Voice** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **i18n** | `i18next`, `react-i18next` |
| **Hosting** | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure
```text
Inclivo/
  frontend/   React app (Vite, Tailwind, Leaflet, i18n, Web Speech)
  backend/    FastAPI app, seed data, schema, Gemini services
  docs/       PRDs and architecture documentation
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js 20+ and Python 3.11+
- A Supabase project and a Google AI Studio Gemini API key
- Google Chrome or Microsoft Edge (recommended for Web Speech API)

### 1. Clone
```bash
git clone https://github.com/amansheikh-techie/Inclivo.git
cd Inclivo
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Set the values in `backend/.env`:
```ini
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>
GEMINI_API_KEY=<your-google-ai-studio-gemini-key>
GEMINI_MODEL=gemini-3.8-flash
CLIENT_ORIGINS=http://localhost:5173
```

Execute schema and seed initial Hyderabad data:
1. Run `backend/schema.sql` inside your **Supabase SQL Editor**.
2. Seed initial places, washrooms, and schemes:
```bash
python -m scripts.seed
```

Start the FastAPI backend:
```bash
uvicorn app.main:app --reload --port 8000
```
API docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Set the values in `frontend/.env`:
```ini
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Start the frontend:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔌 API Overview
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/places` | Accessible places with accessibility score |
| `GET` | `/api/places/{place_id}` | Place details by ID |
| `GET` | `/api/washrooms` | Accessible washrooms |
| `GET` | `/api/schemes` | Government schemes directory |
| `POST` | `/api/schemes/match` | Interactive eligibility checker |
| `POST` | `/api/assistant/chat` | AI accessibility chat |
| `POST` | `/api/assistant/describe-image` | Scene analysis from photo upload |
| `POST` | `/api/assistant/ocr` | Read text and summarize from image |
| `POST` | `/api/assistant/simplify` | Plain-language scheme explanation |
| `GET` | `/api/reports` | Community barrier reports |
| `POST` | `/api/reports` | Create community report with photo |
| `POST` | `/api/reports/{id}/upvote` | Upvote an issue (1 vote per user) |
| `GET` | `/api/passport` | Retrieve user accessibility passport |
| `PUT` | `/api/passport` | Save user mobility and sensory preferences |
| `GET` | `/api/contacts` | List emergency SOS contacts |
| `POST` | `/api/contacts` | Add emergency SOS contact |
| `DELETE` | `/api/contacts/{id}` | Delete emergency SOS contact |
| `POST` | `/api/sos` | Emergency alert logging and contacts retrieval |

Full details: [`docs/BACKEND_PRD.md`](docs/BACKEND_PRD.md) and [`docs/FRONTEND_PRD.md`](docs/FRONTEND_PRD.md).

---

## ♿ Accessibility Commitments
- WCAG 2.1 AA target, keyboard navigation, screen-reader support.
- Status and alerts are never conveyed by colour alone.
- High-contrast, large-text (125%), and reduced-motion support.
- Skip-to-content bypass link (`#main-content`) and semantic landmarks.

---

## 🔒 Privacy
- Assistant images and audio are processed in memory and never permanently stored.
- SOS location is logged only when the user deliberately triggers SOS.
- Third-party API keys remain strictly on the backend.

---

## 👏 Credits & Inspiration
- Ideas only (no code copied) from public projects: AccessiPath, WC Finder, VisionMate, Caption.Ninja.
- Map data © OpenStreetMap contributors.

---

## ⚠️ Limitations
- Demo data covers selected Hyderabad locations only.
- Scheme information must be verified on official government websites.
- Live captions depend on browser speech recognition support and microphone accuracy.
- AI output may contain errors.

---

## 🗺️ Roadmap
- [ ] Crowd-verified accessibility ratings and photo submissions.
- [ ] Indoor navigation for large transit hubs and venues.
- [ ] Additional Indian languages (Kannada, Marathi, Bengali).
- [ ] Offline service worker caching for complete PWA installation.

---

## 👥 Team

| Avatar | Member | Role | GitHub |
|:---:|:---|:---|:---|
| <img src="https://github.com/amansheikh-techie.png" width="64" height="64" alt="sk.Aman" style="border-radius: 50%;" /> | **sk.Aman** | Backend, AI Services & Documentation | [@amansheikh-techie](https://github.com/amansheikh-techie) |
| <img src="https://github.com/identicons/sanjay.png" width="64" height="64" alt="Sanjay" style="border-radius: 50%;" /> | **Sanjay** | Frontend & UX Architecture | [Sanjay](https://github.com) |

---

## 📄 Licence
This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for details.

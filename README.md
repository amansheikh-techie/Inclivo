# Inclivo – Accessibility Without Boundaries

Inclivo is a unified AI-powered accessibility companion that helps people with disabilities discover accessible places, communicate more easily, access essential services and navigate everyday life independently.

> Built from scratch in a 48-hour hackathon.

**Live demo:** _add URL_ | **Demo video:** _add link_

---

## Problem
- People with disabilities struggle to find reliable accessibility information (ramps, washrooms, parking).
- Blind and deaf users lack simple, affordable assistive tools in local languages.
- Government schemes are hard to find and understand.

## Solution
One platform, many tools: accessible by design, multilingual and AI-powered.

## Features

### Core (6)
- **Accessible Place Finder** – map of wheelchair-friendly places with ramps, elevators, accessible parking and a transparent accessibility score.
- **Accessible Washroom Finder** – accessible washrooms with cleanliness ratings and verification info.
- **AI Assistant for Blind Users** – voice input, image description, OCR and text-to-speech, with voice commands.
- **Live Captions for Deaf Users** – real-time speech-to-text.
- **Multilingual Support** – English, Hindi, Telugu, Tamil.
- **Government Schemes Finder** – schemes, eligibility, benefits, official apply links, plain-language explanations and an eligibility checker.

### Additional
- **Community Reporting** – report broken ramps and inaccessible facilities.
- **Accessibility Passport** – saved preferences for personalised results.
- **Emergency Assistance (SOS)** – share live location with trusted contacts.
- **Sensory-Friendly Mode** – high contrast, large text (125%), reduced motion, dyslexia font, quiet places filter.
- **Offline fallback data for core finders** – built-in mock fallback data for places, washrooms, schemes, and reports when the backend is unreachable.

| Feature | Status |
|---|---|
| Place Finder | Implemented (`GET /api/places`, map + filters + geolocation sorting) |
| Washroom Finder | Implemented (`GET /api/washrooms`, ratings + verification + geolocation sorting) |
| Blind Assistant | Implemented (`POST /api/assistant/chat`, `/describe-image`, `/ocr` + Web Speech) |
| Live Captions | Implemented (Browser Web Speech API + `.txt` export) |
| Multilingual | Implemented (`en`, `hi`, `te`, `ta` UI + scheme/assistant localization) |
| Schemes Finder | Implemented (`GET /api/schemes`, `POST /api/schemes/match`, `POST /api/assistant/simplify`) |
| Community Reporting | Implemented (`GET/POST /api/reports`, `POST /api/reports/{id}/upvote` with 1-vote/user) |
| Accessibility Passport | Implemented (`GET/PUT /api/passport` + Supabase OTP auth + preference sync) |
| SOS | Implemented (`POST /api/sos` + SMS/WhatsApp share with saved contact & fallback) |
| Sensory Mode | Implemented (`dark`, `high-contrast`, `large-text`, `reduce-motion`, `dyslexia`) |

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Database / Auth / Storage | Supabase |
| AI | Gemini API |
| Maps | Leaflet + OpenStreetMap |
| Voice | Web Speech API |
| i18n | i18next |
| Hosting | Vercel/Netlify (frontend), Render/Railway (backend) |

## Project Structure
```
inclivo-app/
  frontend/   React app
  backend/    FastAPI app, seed data, schema
  docs/       PRDs and screenshots
```

## Getting Started

### Prerequisites
- Node.js 20+ and Python 3.11+
- A Supabase project and a Gemini API key
- Chrome or Edge (best Web Speech API support)

### 1. Clone
```bash
git clone <your-repo-url>
cd inclivo-app
```

### 2. Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # fill in values
# run schema.sql in the Supabase SQL editor, then:
python -m scripts.seed
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

`.env`:
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=
CLIENT_ORIGINS=http://localhost:5173
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

`.env`:
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Open http://localhost:5173

## API Overview
| Endpoint | Purpose |
|---|---|
| `GET /api/places` | Accessible places with accessibility score |
| `GET /api/washrooms` | Accessible washrooms |
| `GET /api/schemes` | Government schemes |
| `POST /api/schemes/match` | Eligibility checker |
| `POST /api/assistant/chat` | AI chat |
| `POST /api/assistant/describe-image` | Image description |
| `POST /api/assistant/ocr` | Read text from image |
| `POST /api/assistant/simplify` | Plain-language explanation |
| `GET/POST /api/reports` | Community reports |
| `GET/PUT /api/passport` | Accessibility passport |
| `POST /api/sos` | Emergency alert |

Full details: [`docs/BACKEND_PRD.md`](docs/BACKEND_PRD.md) and [`docs/FRONTEND_PRD.md`](docs/FRONTEND_PRD.md).

## Accessibility Commitments
- WCAG 2.1 AA target, keyboard navigation, screen-reader support.
- Status is never shown by colour alone.
- High-contrast, large-text and reduced-motion support.

## Privacy
- Assistant images and audio are not stored.
- SOS location is saved only when the user triggers SOS.
- API keys stay on the server.

## Credits & Inspiration
- Ideas only (no code copied) from public projects: AccessiPath, WC Finder, VisionMate, Caption.Ninja.
- Map data © OpenStreetMap contributors.

## Limitations
- Demo data covers selected Hyderabad locations only.
- Scheme information must be verified on official government websites.
- Live captions depend on browser speech recognition support and accuracy.
- AI output may contain errors.

## Roadmap
- Crowd-verified accessibility ratings.
- Indoor navigation.
- More Indian languages.
- Partnerships with NGOs and local authorities.

## Team

| Avatar | Member | Role | GitHub |
|:---:|:---|:---|:---|
| <img src="https://github.com/amansheikh-techie.png" width="64" height="64" alt="sk.Aman" style="border-radius: 50%;" /> | **sk.Aman** | Backend, AI Services & Documentation | [@amansheikh-techie](https://github.com/amansheikh-techie) |
| <img src="https://github.com/identicons/sanjay.png" width="64" height="64" alt="Sanjay" style="border-radius: 50%;" /> | **Sanjay** | Frontend & UX Architecture | [Sanjay](https://github.com) |

## Licence
This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for details.

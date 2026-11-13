# 📝 Problem Statement & Team Contributions

**Project:** Inclivo – Accessibility Without Boundaries  
**Event:** ASCEND Week-2 Project Showcase (Open Innovation)  
**Team size:** 2 | **College:** Geethanjali College of Engineering and Technology (GCET)

---

## ❗ Problem Addressed
- People with disabilities struggle to find reliable accessibility information (ramps, lifts, accessible washrooms, parking).
- Blind and deaf users lack simple, affordable assistive tools in local languages.
- Government schemes for persons with disabilities are hard to find and hard to understand.
- Existing tools are scattered across many apps, so users must constantly switch between them.

## 💡 Proposed Solution
Inclivo is a unified, accessible-by-design, AI-powered platform bringing these tools together into one single interface:
- **Accessible Place Finder (`/places`):** Map of wheelchair-friendly places with ramps, elevators, accessible parking, quiet zones, distance calculation, and a transparent accessibility score (0–100).
- **Accessible Washroom Finder (`/washrooms`):** Verified public restrooms with cleanliness ratings, verification badges, and direct navigation.
- **AI Assistant for Blind Users (`/assistant`):** Hands-free voice chat, scene description (`/describe-image`), OCR text reader (`/ocr`), and voice navigation commands.
- **Live Captions for Deaf Users (`/captions`):** Real-time Web Speech recognition in 4 languages with adjustable font size and `.txt` transcript download.
- **Multilingual Support:** English, Hindi (हिन्दी), Telugu (తెలుగు), and Tamil (தமிழ்) across UI, schemes, and assistant prompts.
- **Government Schemes Finder (`/schemes`):** Directory of central/state welfare programs, 4-question eligibility checker (`/match`), plain-language AI explanations (`/simplify`), and official apply links.
- **Additional Tools:** Community barrier reporting with photo upload and deduplicated upvoting, Accessibility Passport with Supabase OTP auth, emergency SOS button with WhatsApp/SMS location sharing, Sensory-Friendly Mode (High Contrast, 125% Large Text, Reduced Motion, Dyslexia font), and offline fallback data.

## 🛠️ Technology Used
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend:** Python 3.11+, FastAPI, Uvicorn, SlowAPI rate limiter
- **Database / Auth / Storage:** Supabase (PostgreSQL, Row Level Security, Storage, OTP Auth)
- **AI:** Google Gemini API (`google-genai` SDK, `gemini-3.8-flash`)
- **Maps:** Leaflet + OpenStreetMap
- **Voice:** Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **i18n:** `i18next`, `react-i18next`

## 🎯 Impact
- Helps persons with disabilities navigate public spaces and transit with greater independence.
- Drastically reduces time and effort spent searching for accessible amenities and welfare schemes.
- Democratizes assistive technology in regional Indian languages.
- Built to meet strict WCAG 2.1 AA criteria (full keyboard navigation, screen-reader landmarks & `aria-live` status regions, 44×44px touch targets, and zero color-only status indicators).

## 👥 Team Contributions

| Member | Role | Contribution |
|---|---|---|
| **Aman** (Roll No: 25r11a67b8, DS-B) | Backend, AI Services & Documentation | Built FastAPI REST APIs (18 endpoints across places, washrooms, schemes, assistant, reports, passport, SOS); implemented Supabase database schema, RLS policies, storage bucket, and seed data; integrated Gemini AI (multilingual chat, vision scene description, OCR extraction, scheme simplifier, and eligibility ranking); implemented scoring algorithms; authored PRDs, API specs, and project documentation. |
| **Sanjay** | Frontend & UX Architecture | Built React 19 + Tailwind CSS UI and responsive layouts; integrated Leaflet / OpenStreetMap for place and washroom discovery with distance sorting; integrated Web Speech API for voice assistant and live captions; built multilingual i18n switcher (`en`, `hi`, `te`, `ta`); created sensory drawer engine (high contrast, 125% large text, reduced motion, dyslexia font); built Accessibility Passport and SOS button components. |

## 🔗 Links
- **GitHub:** https://github.com/amansheikh-techie/Inclivo
- **Live Demo:** https://inclivo.vercel.app
- **Backend API:** https://inclivo-backend.onrender.com (Docs: https://inclivo-backend.onrender.com/docs)
- **Demo Video:** <TODO: Add demo video link>

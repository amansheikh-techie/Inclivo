# Inclivo Backend PRD

## Goals
- Expose a FastAPI REST API backing accessible place/washroom discovery, AI assistive tools, government scheme matching, community reporting, Accessibility Passport preferences, and SOS logging.
- Keep secrets (`SUPABASE_SERVICE_KEY`, `GEMINI_API_KEY`) strictly on the server while verifying Supabase user JWTs on protected routes.
- Degrade gracefully with fallback responses when Gemini is unavailable or unconfigured.

## Target Users
- Frontend web client (`frontend/`) consuming `/api/*` endpoints with optional Supabase Bearer tokens.
- Authenticated users managing their Accessibility Passport, emergency contacts, community reports, upvotes, and SOS events.
- Anonymous/public visitors browsing places, washrooms, schemes, reports, and AI assistant tools.

## Features & Endpoints (`backend/app/main.py`, `backend/app/routers/*`)
- **Health**
  - `GET /api/health` – Service health check (`{"status": "ok"}`).
- **Places (`/api/places`)**
  - `GET /api/places` – List places with optional `has_ramp`, `has_elevator`, `accessible_parking`, `wheelchair_friendly`, `quiet`, `lat`, `lng`, `radius_km` filters; computes `accessibility_score`, `score_breakdown`, and `distance_km` (Haversine).
  - `GET /api/places/{place_id}` – Retrieve a single place by ID.
- **Washrooms (`/api/washrooms`)**
  - `GET /api/washrooms` – List accessible washrooms with optional `verified`, `lat`, `lng`, `radius_km`, and `min_rating` filters plus `distance_km`.
- **Schemes (`/api/schemes`)**
  - `GET /api/schemes` – List schemes with optional `q`, `disability_type`, `state` (case-insensitive, treating `"All India"` and `"India"` as national matches), and `lang` (`en`, `hi`, `te`, `ta`) localization.
  - `POST /api/schemes/match` – Filter candidate schemes and rank/explain matches via Gemini (`match_schemes_ai`) with deterministic fallback reasons.
- **AI Assistant (`/api/assistant`, rate-limited 10/min via `slowapi`)**
  - `POST /api/assistant/chat` – Multilingual accessibility chat via Gemini.
  - `POST /api/assistant/describe-image` – Multipart image upload (`jpeg`, `png`, `webp`, `heic`, `heif`, max 5 MB) + `lang` form field, described by Gemini.
  - `POST /api/assistant/ocr` – Multipart image upload + `lang` form field; extracts visible text and a one-line summary as JSON.
  - `POST /api/assistant/simplify` – Plain-language explanation of scheme text in `lang`.
- **Community Reports (`/api/reports`)**
  - `GET /api/reports` – List community reports ordered by `created_at` descending, with optional `status` filter.
  - `POST /api/reports` *(auth required)* – Create report with optional validated image upload to Supabase Storage (`report-photos`).
  - `POST /api/reports/{report_id}/upvote` *(auth required)* – Insert `(report_id, user_id)` into `report_upvotes`, return `409` if already upvoted, and update `reports.upvotes` from exact row count.
- **Accessibility Passport (`/api/passport`, auth required)**
  - `GET /api/passport` – Fetch or return default passport preferences for the authenticated user.
  - `PUT /api/passport` – Upsert `mobility_needs`, `vision_needs`, `hearing_needs`, `preferred_language`, `font_size`, and `sensory_mode`.
- **SOS & Emergency Contacts (`/api/contacts`, `/api/sos`, auth required)**
  - `GET /api/contacts`, `POST /api/contacts`, `DELETE /api/contacts/{contact_id}` – Manage user emergency contacts.
  - `POST /api/sos` – Log `lat`/`lng` in `sos_events`, build a Google Maps link, and return saved emergency contacts.

## Data Model (`backend/schema.sql`)
- `places` – `id`, `name`, `category`, `lat`, `lng`, `address`, `has_ramp`, `has_elevator`, `accessible_parking`, `wheelchair_friendly`, `quiet`, `rating`, `created_at`.
- `washrooms` – `id`, `name`, `lat`, `lng`, `address`, `cleanliness_rating`, `verified`, `last_verified`, `created_at`.
- `schemes` – `id`, `name`, `description`, `eligibility`, `benefits`, `disability_type`, `state`, `apply_url`, `name_hi`, `name_te`, `name_ta`.
- `reports` – `id`, `user_id`, `issue_type`, `description`, `lat`, `lng`, `photo_url`, `status`, `upvotes`, `created_at` (RLS enabled).
- `report_upvotes` – `report_id`, `user_id`, `created_at`, composite primary key `(report_id, user_id)` (RLS enabled).
- `passports` – `user_id` (PK), `mobility_needs`, `vision_needs`, `hearing_needs`, `preferred_language`, `font_size`, `sensory_mode`, `updated_at` (RLS enabled).
- `emergency_contacts` – `id`, `user_id`, `name`, `phone` (RLS enabled).
- `sos_events` – `id`, `user_id`, `lat`, `lng`, `created_at` (RLS enabled).
- Storage bucket: `report-photos` (public read).

## Security & Accessibility Requirements
- CORS restricted to `CLIENT_ORIGINS` (`http://localhost:5173` by default).
- Supabase JWT verification (`get_current_user`) on `/api/passport`, `/api/contacts`, `/api/sos`, `POST /api/reports`, and `POST /api/reports/{id}/upvote`.
- Upload validation (`validate_image_upload`) enforces allowed MIME types and 5 MB limit; Gemini errors fall back to safe user-facing messages.
- Multilingual prompt support (`en`, `hi`, `te`, `ta`) across AI assistant and scheme endpoints.

## Future Scope
- Automated pytest integration suite and CI checks.
- PostGIS spatial indexing for large-scale nationwide place/washroom queries.
- Crowd-verified moderation workflow for resolving community reports.


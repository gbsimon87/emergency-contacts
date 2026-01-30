# Emergency Contacts (Global)

A mobile-first web app that helps people quickly find the correct emergency contact numbers (police, ambulance, fire) anywhere in the world — especially while traveling.

The focus is **speed, clarity, and reliability**, not advanced features.

---

## Project Status Overview

This document acts as a **living checklist**:

- What works today
- What we’ve intentionally completed
- What comes next — in priority order

It intentionally avoids technical jargon.

---

## ✅ What’s Completed

### Foundation

- [x] Project initialized and version controlled
- [x] Frontend and backend separated but deployed together
- [x] App runs locally without errors
- [x] Ready for deployment to Render

### Frontend (Client)

- [x] React app created
- [x] Tailwind CSS installed and working
- [x] Mobile-first UI renders correctly
- [x] Country picker works
- [x] Country search works
- [x] Last selected country is remembered
- [x] Supports multiple emergency numbers per service (distinct call buttons)
- [x] Confirm-before-call protection to avoid accidental dialing
- [x] Copy all emergency numbers
- [x] Share emergency numbers for the selected country
- [x] Clear offline behavior (still usable with last-known data)
- [x] Location detection is optional and never blocks the app
- [x] Location permission states are shown accurately (granted / denied / timed out / unavailable)
- [x] Country auto-detection never overrides the user without confirmation
- [x] “What to say” micro-guidance included for each emergency service
- [x] Nearby help options shown (hospitals + embassies/consulates) as read-only links
- [x] First-aid micro-cards included as secondary guidance

### Backend (Server)

- [x] Express server running
- [x] Health check endpoint available
- [x] Server correctly serves the frontend in production
- [x] Read-only API endpoints return emergency numbers
  - [x] List countries: `/api/countries`
  - [x] Country details: `/api/countries/:iso2`
- [x] Nearby facilities endpoint supported (read-only lookup)
- [x] Server-side input validation for location-based requests (safe lat/lon + bounded radius)
- [x] External API requests are guarded against failures (timeouts + safe fallbacks)

### Data

- [x] Expanded dataset covering major global travel destinations
- [x] Services labeled clearly (general / police / ambulance / fire)
- [x] Supports multiple numbers per service (array + single value)
- [x] Metadata added to country data
  - [x] Data source (internal)
  - [x] Last verified date
- [x] Server-side validation and normalization of country data
- [x] Bad or incomplete data fails safely (no crashes, no broken call buttons)

### Reliability & Stress Reduction

- [x] Graceful handling of network/API failures
- [x] Clear error messaging with retry option
- [x] Last-known emergency numbers remain visible during failures
- [x] Offline-friendly experience for repeat use (cache-based, read-only)
- [x] No accounts, no setup, no distractions — fast access under stress

### Security & Hardening

- [x] Security headers enabled (baseline protection)
- [x] Public endpoints protected with rate limiting
- [x] CORS locked down intentionally (not open by default)
- [x] Dependency audit performed and high-severity issues addressed
- [x] External lookups protected against request storms (timeouts + caching)

### Deployment & Source Control

- [x] Project pushed to GitHub
- [x] Render web service created and connected to GitHub
- [x] App deployed live on Render
- [x] Production build serves the frontend successfully
- [x] Health endpoint works in production (`/api/health`)

---

## 🟢 Phase 0 MVP — Status: **Complete**

### What Phase 0 Delivered (Plain English)

> A real user can:
>
> 1. Open the app on any device
> 2. Select a country (even under poor connectivity)
> 3. Immediately see accurate emergency phone numbers
> 4. Call, copy, or share those numbers in under 30 seconds
>
> With no accounts, no setup, and no distractions.

Phase 0 is intentionally **feature-light but reliability-heavy**.  
The app does one thing, and it does it well — even when conditions are bad.

---

## 🟢 Phase 1 — Reliability & Stress Reduction — Status: **Complete**

### What Phase 1 Delivered (Plain English)

> A stressed or disoriented user can:
>
> 1. Still access emergency numbers when offline or on poor networks
> 2. Get help selecting the right country automatically (without being forced)
> 3. Avoid accidental calls while acting quickly
> 4. See clear guidance on what to say when calling emergency services
> 5. Find secondary help options if calling isn’t enough

Phase 1 focused on **reducing cognitive load under stress**.  
Everything added was optional, conservative, and designed to fail safely.

---

## 🟣 Phase 3 — Security, Correctness & Hardening — Status: **Complete**

Phase 3 focused on making the app **trustworthy under real-world conditions**:

- resistant to common web attacks
- predictable when permissions are granted/denied
- safe around third-party APIs
- stable as the dataset grows

This phase focused on **fixing issues and reducing risk**, not adding features.

---

### 1) Permissions & Location Correctness (Highest Priority)

**Goal:** If a user grants permission, the app must behave correctly and never show misleading states.

- [x] Fix bug: user accepts location permission but UI still shows “declined”
- [x] Add a clear location state machine:
  - [x] Not requested
  - [x] Requesting
  - [x] Granted (coords available)
  - [x] Denied
  - [x] Unavailable / timed out
- [x] Prevent confusing copy:
  - [x] “Denied” only when the browser explicitly denies
  - [x] “Timed out” when it times out
  - [x] “Unavailable” when device doesn’t support it
- [x] Add “Try again” action for location
- [x] Never auto-switch country without a confirmation prompt after detection

**Why this matters:**  
Location is high-impact and high-risk. Misreporting permission status breaks trust immediately.

---

### 2) Security Baseline (Web App Hardening)

**Goal:** Reduce attack surface and enforce safe defaults.

- [x] Add security headers on the server (Helmet):
  - [x] Content Security Policy (CSP) (minimal but real)
  - [x] X-Content-Type-Options
  - [x] Referrer-Policy
  - [x] Permissions-Policy (explicitly define geolocation usage)
- [x] Add server-side rate limiting on public endpoints (especially `/api/nearby`)
- [x] Add input validation + bounds:
  - [x] `/api/nearby`: validate `lat/lon` ranges and clamp radius
  - [x] reject non-numeric or extreme values early
- [x] Ensure external fetches are safe:
  - [x] timeouts / abort controllers for Overpass + geocoding
  - [x] caching strategy to prevent request storms
- [x] Lock down CORS intentionally (don’t allow `*` unless truly needed)
- [x] Dependency audit:
  - [x] run `npm audit` and address high severity items
  - [x] pin/upgrade vulnerable deps

**Why this matters:**  
Even “simple” apps are targets. Hardening is mostly cheap now and expensive later.

---

### 3) Data Integrity & Output Safety

**Goal:** Bad data should never crash the UI or produce misleading call actions.

- [x] Extend server-side validation rules:
  - [x] ensure every served country has a valid ISO2 and name
  - [x] ensure services are string or string[]
  - [x] drop invalid service entries safely
- [x] Frontend hardening:
  - [x] never render `tel:` links for non-string values
  - [x] normalize and display arrays cleanly everywhere
  - [x] always show a “—” for missing values (no blank UI)
- [x] Add a lightweight “data health” check during build/boot:
  - [x] log invalid entries clearly for easy fixes

**Why this matters:**  
As the dataset grows, mistakes will happen. The app must fail safely.

---

## 🧭 Next Roadmap (Ordered by Real User Value)

These items are **not commitments**, but a prioritised guide for future work.  
They are ordered by _impact in real emergencies_, not by technical interest.

### 1. Offline-First Support (Already Delivered)

**Goal:** The app should still work when connectivity disappears.

- [x] Cache last-used country and emergency numbers for offline use
- [x] Clear offline indicator (“Using last saved data”)
- [x] No background sync or complexity — read-only cache

**Why this matters:** Emergencies often happen where connectivity is weak or unavailable.

### 2. Automatic Location Detection (Already Delivered)

**Goal:** Reduce friction when the user is disoriented.

- [x] Attempt to detect country automatically
- [x] Always allow manual override
- [x] Never block usage on location permission
- [x] “Use my location” button (geolocation + reverse lookup)

**Why this matters:** Helpful when it works, dangerous if it’s wrong — must be conservative.

### 3. “What to Say” Micro-Guidance (Already Delivered)

**Goal:** Help users communicate clearly under stress.

- [x] Short checklist per service:
  - [x] “State emergency”
  - [x] “Give location”
  - [x] “Answer questions”
- [ ] (Optional, later) Local-language phrases (only for top languages)

**Why this matters:** Knowing _what to say_ can be as important as knowing _who to call_.

### 4. Nearby Emergency Facilities (Already Delivered)

**Goal:** Provide secondary help options.

- [x] Nearby hospitals
- [x] Embassies / consulates
- [x] Links only — no navigation logic

**Why this matters:** Useful when calling isn’t enough or not possible.

### 5. First-Aid Micro-Cards (Already Delivered)

**Goal:** Immediate guidance while help is on the way.

- [x] Bleeding
- [x] Choking
- [x] Unconscious / Not Responding
- [x] CPR
- [x] Heart Attack
- [x] Stroke
- [x] Seizure
- [x] Severe Allergic Reaction

**Why this matters:** High value, but only after calling is addressed.

---

## 🔵 Phase 4 — Personal Safety & Offline Readiness (Planned)

Phase 4 focuses on **helping others help the user** — especially when the user is injured, panicked, or unable to interact normally.

These features prioritize **offline access, clarity, and trust**, not automation or complexity.

---

### 1) Personal Emergency Contacts (ICE) — Highest Priority

**Goal:** Allow responders or bystanders to contact someone the user trusts.

- [ ] Add personal emergency contacts (“ICE”):
  - [ ] Name
  - [ ] Phone number
  - [ ] Relationship (optional)
- [ ] One-tap call buttons
- [ ] Clear separation from emergency services
- [ ] Fully available offline
- [ ] Stored locally by default (account sync optional later)

**Why this matters:**  
Emergency services aren’t always enough. Reaching a trusted person can be critical.

---

### 2) Emergency Info Card (Lock-Screen Friendly)

**Goal:** Provide critical personal information when the user cannot speak.

- [ ] Single emergency info card:
  - [ ] Name (optional)
  - [ ] Home country (optional)
  - [ ] ICE contacts
  - [ ] Medical notes (allergies, conditions, medications)
- [ ] One-tap “Show full screen”
- [ ] One-tap “Share”
- [ ] Works completely offline
- [ ] Clear disclaimer: user-provided information only

**Why this matters:**  
This information is often needed when the user is least able to provide it.

---

### 3) Offline Emergency Mode

**Goal:** Make offline usage explicit, calm, and reliable.

- [ ] Dedicated emergency-focused view
- [ ] Clearly indicates offline state without alarm
- [ ] Prioritizes offline-safe features:
  - [ ] Emergency numbers
  - [ ] ICE contacts
  - [ ] Emergency info card
- [ ] No background sync or retry loops
- [ ] No blocking states caused by connectivity loss

**Why this matters:**  
Emergencies are chaotic. The app must feel stable even when the network is not.

---

### Phase 4 Summary (Plain English)

> Even if the user:
>
> - has no internet
> - cannot speak clearly
> - cannot navigate complex UI
>
> The app still helps others:
>
> - know who to call
> - understand basic medical context
> - take the next correct step calmly

Phase 4 strengthens the app’s role as a **personal safety tool**, not just an information lookup.

---

## 🚀 Guiding Principle (Always)

> In an emergency, fewer features save more time.

Every future decision should support that.

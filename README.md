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
- [x] Basic UI renders correctly
- [x] Country picker works
- [x] Country search works
- [x] Last selected country is remembered
- [x] Supports multiple emergency numbers per service (distinct call buttons)
- [x] Confirm-before-call protection to avoid accidental dialing
- [x] Copy all emergency numbers
- [x] Share emergency numbers for the selected country

### Backend (Server)

- [x] Express server running
- [x] Health check endpoint available
- [x] Server correctly serves the frontend in production
- [x] Read-only API endpoints return emergency numbers
  - [x] List countries: `/api/countries`
  - [x] Country details: `/api/countries/:iso2`

### Data

- [x] Expanded dataset covering major global travel destinations
- [x] Services labeled clearly (general / police / ambulance / fire)
- [x] Supports multiple numbers per service (array + single value)
- [x] Metadata added to country data
  - [x] Data source (internal)
  - [x] Last verified date

### Reliability

- [x] Graceful handling of network/API failures
- [x] Clear error messaging with retry option
- [x] Last-known emergency numbers remain visible during failures
- [x] Server-side validation and normalization of country data

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

## 🧭 Post–Phase 1 Roadmap (Ordered by Real User Value)

These items are **not commitments**, but a prioritised guide for future work.  
They are ordered by _impact in real emergencies_, not by technical interest.

### 1. Offline-First Support (Highest Value)

**Goal:** The app should still work when connectivity disappears.

- [x] Cache last-used country and emergency numbers for offline use
- [x] Clear offline indicator (“Using last saved data”)
- [x] No background sync or complexity — read-only cache

**Why this matters:** Emergencies often happen where connectivity is weak or unavailable.

### 2. Automatic Location Detection (Optional, Fallback-Based)

**Goal:** Reduce friction when the user is disoriented.

- [x] Attempt to detect country automatically
- [x] Always allow manual override
- [x] Never block usage on location permission
- [x] “Use my location” button (geolocation + reverse lookup)

**Why this matters:** Helpful when it works, dangerous if it’s wrong — must be conservative.

### 3. “What to Say” Micro-Guidance

**Goal:** Help users communicate clearly under stress.

- [x] Short checklist per service:
  - “State emergency”
  - “Give location”
  - “Answer questions”
- [ ] Optional local-language phrases (very limited)

**Why this matters:** Knowing _what to say_ can be as important as knowing _who to call_.

### 4. Nearby Emergency Facilities (Read-Only)

**Goal:** Provide secondary help options.

- [x] Nearby hospitals
- [x] Embassies / consulates
- [x] Links only — no navigation logic

**Why this matters:** Useful when calling isn’t enough or not possible.

### 5. First-Aid Micro-Cards (Strictly Secondary)

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

## 🚀 Guiding Principle (Always)

> In an emergency, fewer features save more time.

Every future decision should support that.

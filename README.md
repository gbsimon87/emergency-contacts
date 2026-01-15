# Emergency Contacts (Global)

A mobile-first web app that helps people quickly find the correct emergency contact numbers (police, ambulance, fire) anywhere in the world — especially while traveling.

The focus is **speed, clarity, and reliability**, not advanced features.

---

## Project Status Overview

This document acts as a **living checklist**:

- What works today
- What we’re building next
- What comes later

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

### Reliability

- [x] Graceful handling of network/API failures
- [x] Clear error messaging with retry option
- [x] Last-known emergency numbers remain visible during failures

### Deployment & Source Control

- [x] Project pushed to GitHub
- [x] Render web service created and connected to GitHub
- [x] App deployed live on Render
- [x] Production build serves the frontend successfully
- [x] Health endpoint works in production (`/api/health`)

---

## 🟡 Phase 0 MVP — Highest-Value Next Steps

These are ordered by **user trust and speed under stress**, not technical interest.

---

### 1. Trust & Credibility (Top Priority)

**Goal:** Users should trust the numbers instantly.

- [ ] Add metadata fields to emergency data:
  - [x] Data source (e.g. government / telecom / standards body)
  - [ ] Last verified date
- [ ] Display this information in a subtle, non-intrusive way

**Why this matters:**  
In an emergency, uncertainty causes hesitation.

---

### 2. Speed & Visual Clarity

**Goal:** Reduce thinking and hesitation.

- [ ] Keep selected country clearly visible at all times
- [ ] Improve disclaimer wording and placement (short, calm, readable)
- [ ] Improve loading state (simple placeholder or skeleton)

**Why this matters:**  
The app should feel calm, obvious, and reassuring.

---

### 3. Data Coverage (Incremental)

**Goal:** Make the app useful for more people.

- [ ] Continue expanding dataset country-by-country
- [ ] Prioritize:
  - High travel volume countries
  - Regions with non-obvious emergency numbers

**Why this matters:**  
Coverage increases usefulness without adding UI complexity.

---

## 🎯 Phase 0 MVP Goal (Plain English)

> A user should be able to:
>
> 1. Select a country
> 2. Immediately see the correct emergency phone numbers
> 3. Tap a number and call it
>
> No accounts, no clutter, no distractions.

---

## 🔜 After Phase 0 (Explicitly Not Yet)

These are intentionally postponed until Phase 0 is clearly successful:

- [ ] Automatic location detection
- [ ] Offline-first support
- [ ] Nearby hospitals / embassies
- [ ] Medical profiles
- [ ] User accounts
- [ ] Crowdsourced edits
- [ ] Advanced UI polish

---

## 🚀 Definition of “MVP Complete”

Phase 0 is complete when:

- A real user can open the app
- Pick a country
- See accurate emergency numbers
- Call them in under 30 seconds
- Even with poor connectivity or momentary failures

---

## Guiding Principle

> In an emergency, fewer features save more time.

Every future decision should support that.

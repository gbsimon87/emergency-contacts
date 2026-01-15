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

- [x] Starter dataset of emergency numbers exists (small set of countries)
- [x] Services labeled clearly (general / police / ambulance / fire)

### Deployment & Source Control

- [x] Project pushed to GitHub
- [x] Render web service created and connected to GitHub
- [x] App deployed live on Render
- [x] Production build serves the frontend successfully
- [x] Health endpoint works in production (`/api/health`)

---

## 🟡 Phase 0 MVP — What We Are Building Next

### Safety & Clarity

- [x] Add a “confirm before calling” step (to avoid accidental taps)
- [ ] Keep country selection clearly visible at all times
- [ ] Improve disclaimer wording and placement

### Usability

- [x] Add search in the country picker (needed once the list grows)
- [ ] Improve error state when API is unavailable (retry + fallback behavior)
- [ ] Add a better loading state (simple skeleton or placeholder)

### Data Quality (still Phase 0)

- [ ] Expand dataset to more countries (start with top travel destinations)
- [ ] Add metadata fields:
  - [ ] Data source (where the number came from)
  - [ ] Last verified date

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

## 🔜 Next After MVP (Not Yet)

These are intentionally postponed until the MVP is solid:

- [ ] Automatic location detection
- [ ] Offline support
- [ ] Nearby hospitals / embassies
- [ ] Medical profiles
- [ ] User accounts
- [ ] Crowdsourced edits
- [ ] Advanced UI polish

---

## 🚀 Definition of “MVP Complete”

Phase 0 is considered done when:

- A real user can open the app
- Pick a country
- See accurate emergency numbers
- Call them in under 30 seconds

Everything else is secondary.

---

## Guiding Principle

> In an emergency, fewer features save more time.

Every future decision should support that.

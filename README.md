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

### Backend (Server)

- [x] Express server running
- [x] Health check endpoint available
- [x] Server correctly serves the frontend in production

### Deployment & Source Control

- [x] Project pushed to GitHub
- [x] Render web service created and connected to GitHub
- [x] App deployed live on Render
- [x] Production build serves the frontend successfully
- [x] Health endpoint works in production (`/api/health`)

## 🟡 What We Are Building Now (MVP)

### MVP Core

- [ ] Add a small starter dataset of emergency numbers (a few countries)
- [ ] Create API endpoints to retrieve emergency numbers
- [ ] Build the “panic screen” UI (big buttons: police/ambulance/fire)
- [ ] Add country picker + remember selection

### Reliability (after core works)

- [ ] Add caching / offline basics
- [ ] Add source + “last verified” metadata for trust

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

## 🟡 Phase 0 MVP — What We Are Building Now

### 1. Emergency Numbers Data (Core)

- [ ] Decide on a simple, human-readable data format
- [ ] Create an initial list of emergency numbers for a small set of countries
- [ ] Clearly label services:
  - Police
  - Ambulance
  - Fire
- [ ] Include a “general emergency” number where applicable

**Why:** The app is useless without trustworthy data.

---

### 2. Backend API (Minimal)

- [ ] Create an API endpoint that returns emergency numbers
- [ ] Endpoint should support:
  - Fetching all countries
  - Fetching a single country by code or name
- [ ] Keep the API read-only for now

**Why:** This allows the frontend to stay simple and flexible.

---

### 3. Country Selection (Frontend)

- [ ] Display a list of available countries
- [ ] Allow the user to manually select a country
- [ ] Remember the last selected country during the session

**Why:** Manual selection is reliable and avoids location complexity early on.

---

### 4. Emergency “Panic Screen” UI

- [ ] Show the selected country clearly
- [ ] Display large, easy-to-tap buttons for:
  - Police
  - Ambulance
  - Fire
- [ ] Buttons should:
  - Clearly show the phone number
  - Trigger a phone call on tap (where supported)

**Why:** This screen is the entire product.

---

### 5. Basic Safety & Clarity

- [ ] Add a short disclaimer (e.g. “Verify before calling if possible”)
- [ ] Confirm country selection is visible at all times
- [ ] Avoid accidental calls (simple confirmation if needed)

---

## 🔜 Next After MVP (Not Yet)

These are **intentionally postponed** until the MVP is usable:

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

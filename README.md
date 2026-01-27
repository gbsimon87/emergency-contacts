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
- [x] Supports multiple emergency numbers per service (distinct call buttons)
- [x] Confirm-before-call protection to avoid accidental dialing

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
  - [x] Data source
  - [x] Last verified date

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

## 🟡 Phase 0 MVP — Honest Prioritisation (Checklist)

This is the **authoritative Phase 0 priority list**.  
Items are ordered by **real-world user impact during emergencies**.

---

### 1. Visual Clarity & Reassurance Under Stress (Highest Priority)

- [x] Make the selected country impossible to miss
  - Prominent country display near call actions
- [x] Calm, human wording for disclaimers
- [x] Reassuring loading messages
- [x] Reduce visual noise on call cards (numbers dominate)

**Why this matters:**  
In an emergency, users need instant reassurance they’re looking at the right information.

---

### 2. Trust Signals (Subtle, Non-Intrusive)

- [x] Store verification metadata in data model
- [ ] Display “last verified” date in a subtle way
- [ ] Optional source attribution (small, secondary text)

**Why this matters:**  
Users hesitate if they’re unsure whether numbers are current or trustworthy.

---

### 3. Quick Utility Actions

- [ ] One-tap “Copy all numbers”
- [ ] Share emergency numbers for the selected country

**Why this matters:**  
Travelers often need to share information quickly with others.

---

### 4. Data Guardrails

- [ ] Validate incoming country data (`iso2`, services shape)
- [ ] Fail gracefully on malformed or incomplete data

**Why this matters:**  
Prevents silent failures as the dataset grows.

---

### 5. Incremental Data Expansion

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
- [ ] “What to say” micro-script (local phrasing + address tips)
- [ ] First-aid micro-articles (bleeding, choking, CPR)
- [ ] Share/copy flows for group travel

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

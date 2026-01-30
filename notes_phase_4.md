Excellent — this fits your README really well.
Below I’ll do **two things**, cleanly and precisely:

1. **Tight product specs** for:
   - Personal Emergency Contacts (ICE)
   - Emergency Info Card
   - Offline Emergency Mode
     (written in the same “plain English, no fluff” style you’ve used)

2. **Add them as Phase 4** to your README, fully written and ready to paste.

No code, no architecture diagrams, no hand-waving.

---

# Tight Feature Specs

## Feature 1: Personal Emergency Contacts (ICE)

### Problem

In emergencies, responders or bystanders often need to contact someone the user trusts — especially if the user cannot speak or make decisions.

### Goal

Allow users to define **personal emergency contacts** that can be called quickly, even under stress or offline.

### Scope (MVP)

- Users can add one or more contacts:
  - Name
  - Phone number
  - Relationship (optional)

- Contacts are clearly labeled **“ICE — In Case of Emergency”**
- One-tap call buttons
- Works offline
- Stored locally (account sync optional, later)

### Explicit Non-Goals

- Messaging automation
- Contact syncing from device
- Background access to contacts

### Acceptance Criteria

- ICE contacts are accessible within 1–2 taps
- Phone numbers are validated before enabling call actions
- Contacts remain available when offline
- UI clearly distinguishes personal contacts from emergency services
- Removing a contact is always possible

---

## Feature 2: Emergency Info Card (Lock-Screen Friendly)

### Problem

Emergency responders may need critical information when the user is unconscious, injured, or unable to interact.

### Goal

Provide a **single, readable emergency information card** that can be shown or shared quickly.

### Scope (MVP)

- User-editable fields:
  - Full name (optional)
  - Home country (optional)
  - Emergency contacts (from ICE list)
  - Medical notes (free text: allergies, conditions, medications)

- One-tap:
  - “Show full screen”
  - “Share” (text or image)

- Works fully offline

### Explicit Non-Goals

- Medical diagnosis or advice
- Validation of medical data
- OS-level lock screen integration (later consideration)

### Acceptance Criteria

- Card is readable at arm’s length
- Card is accessible without network access
- Sharing does not require an account
- Clear disclaimer that information is user-provided
- User can clear or edit all fields at any time

---

## Feature 3: Offline Emergency Mode

### Problem

Emergencies often happen when connectivity is poor, unstable, or nonexistent — which increases user anxiety and confusion.

### Goal

Make offline behavior **intentional, visible, and reassuring**.

### Scope (MVP)

- A dedicated “Emergency Mode” view that:
  - Prioritizes offline-safe features:
    - Emergency numbers
    - ICE contacts
    - Emergency Info Card

  - Clearly indicates offline status

- No background sync
- No automatic retries or spinners

### Explicit Non-Goals

- Background location tracking
- Automatic refresh logic
- Offline data downloads beyond what’s already cached

### Acceptance Criteria

- User always understands whether data is live or cached
- No empty states caused purely by loss of connectivity
- App never blocks emergency numbers due to network state
- UI avoids alarming or technical language (“offline” ≠ “broken”)

---

# README.md — Phase 4 Addition

Below is the **exact section** to append to your README.

---

```md
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
```

---

## Why this fits your project exceptionally well

- No feature creep
- No new legal exposure
- No continuous permissions
- No background processing
- Strong alignment with your guiding principle:

  > _In an emergency, fewer features save more time._

If you want next, I can:

- sanity-check this Phase 4 against your current UI layout,
- help you decide which Phase 4 feature to build _first_ (there is a clear winner), or
- help you word the Emergency Info Card disclaimer perfectly (important but easy to overdo).

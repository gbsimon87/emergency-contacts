Perfect — let’s lock this down cleanly and keep it lightweight, product-first, and shippable.

Below is a **concise product spec**, followed by a **minimal data model + API surface** that fits your current architecture and values (speed, reliability, low friction).

---

# Product Spec: Home Country & Embassy Support

## Problem Statement

When traveling abroad, users may need to contact **their own country’s embassy or consulate** for help (lost passport, arrest, medical issues, evacuation, etc.).

Today, the app can show _nearby diplomatic offices_, but it cannot tell users **which one represents their home country**.

## Goal

Allow users to set a **home country**, and when they are abroad, surface **the nearest embassy/consulate representing that country**, with clear fallbacks when data is incomplete.

## Non-Goals (for this phase)

- Supporting multiple home countries
- Tracking travel history
- Guaranteeing embassy accuracy (best-effort only)
- Providing legal or consular advice

---

## Core User Stories

### 1. Set Home Country (Guest)

**As a user**,
I want to choose my home country,
so that the app knows which embassy or consulate applies to me.

**Acceptance Criteria**

- User can select one country as “Home country”
- Selection persists across sessions on the same device
- Home country is independent from the currently selected emergency-number country
- No sign-in is required

---

### 2. See My Embassy When Abroad

**As a user traveling abroad**,
I want to quickly see my country’s embassy or consulate near me,
so I can contact them if needed.

**Acceptance Criteria**

- When home country is set and location is granted:
  - App attempts to show nearby diplomatic offices representing the user’s home country

- Results show:
  - Name
  - Distance
  - Address (if available)
  - Call / Website / Open in Maps actions (when available)

- Results are sorted by distance
- Limit results (e.g. top 1–3)

---

### 3. Graceful Fallback When Data Is Missing

**As a user**,
I want the app to still help me even if embassy data is incomplete.

**Acceptance Criteria**

- If no matching embassy/consulate is found:
  - App clearly states that none were found via available data
  - App suggests a fallback (e.g. “Search ‘[Home Country] embassy near me’ in Maps”)

- The existing generic “Embassies / consulates nearby” list remains available

---

### 4. Signed-In User: Sync Home Country Across Devices

**As a signed-in user**,
I want my home country to follow me across devices,
so I don’t have to set it again.

**Acceptance Criteria**

- User can sign in with Google
- Home country is stored server-side
- On sign-in:
  - If server value exists → it is used
  - If only local value exists → user is prompted to save it to their account

- User can update their home country later

---

### 5. Privacy & Control

**As a user**,
I want to understand what data is stored and have control over it.

**Acceptance Criteria**

- Home country is the only profile field stored
- Location is never stored server-side
- App clearly states that location is only used for nearby lookups
- User can clear or overwrite their home country at any time

---

## UX Notes (Non-functional)

- “Your embassy / consulate” appears as a **dedicated section**, not mixed into the generic list
- If user is currently in their home country:
  - Section is hidden or shows a subtle note (“You’re in your home country”)

- Copy avoids guarantees (“based on available data”)

---

# Minimal Data Model

This is intentionally tiny.

## User (server-side)

```
User
- id (string)            // internal or provider ID
- provider ("google")
- providerUserId (string)
- homeCountryIso2 (string | null)
- createdAt (timestamp)
- updatedAt (timestamp)
```

Notes:

- No email storage required (unless needed for auth)
- No location data stored
- No travel history

---

## Local Storage (client)

```
homeCountryIso2: string | null
homeCountrySource: "local" | "account"
```

Used to:

- Support guest mode
- Resolve conflicts on sign-in

---

# Minimal API Endpoints

These align with your existing `/api` structure and security posture.

## Authentication

(Exact implementation TBD — provider-dependent)

```
POST /api/auth/google
→ verifies Google ID token
→ returns session / auth context
```

---

## User Profile

### Get current user profile

```
GET /api/me
```

Response:

```
{
  "homeCountryIso2": "GB"
}
```

- Requires authentication
- Returns only what the app needs

---

### Update home country

```
PUT /api/me/home-country
```

Request:

```
{
  "iso2": "GB"
}
```

Response:

```
{ "ok": true }
```

Rules:

- ISO2 must be valid
- Overwrites previous value
- Does not affect current emergency-number country

---

## Nearby: Home-Country Diplomatic

You have two viable shapes; either is fine.

### Option A: Extend existing nearby endpoint

```
GET /api/nearby?type=diplomatic&home=GB
```

Behavior:

- Server filters diplomatic results to those representing `home`
- Uses best-effort OSM tags
- Falls back to empty list if no matches

### Option B: Dedicated type (clearer intent)

```
GET /api/nearby?type=my_diplomatic&home=GB
```

Behavior:

- Same as above, but explicit and cache-friendly

Response (same structure you already use):

```
{
  "items": [
    {
      "id": "...",
      "name": "...",
      "lat": ...,
      "lon": ...,
      "distanceM": ...,
      "address": "...",
      "phone": "...",
      "website": "..."
    }
  ]
}
```

---

## Error & Fallback Expectations

- 200 + empty list is valid and expected
- Errors only for:
  - invalid parameters
  - provider timeouts

- Client is responsible for user-facing fallback messaging

---

## Why This Spec Works Well for Your App

- Fits your **mobile-first, low-friction** philosophy
- Adds **real traveler value** without bloating the app
- Degrades gracefully when open data is incomplete
- Introduces auth only when it clearly benefits the user
- Keeps backend complexity minimal and auditable

If you want, next we can:

- map this directly onto your existing Nearby UI,
- design the “Home country” settings UX, or
- pressure-test the embassy data reliability and tagging strategy before committing.

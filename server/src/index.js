import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import countries from "./data/countries.json" with { type: "json" };

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

function isValidIso2(value) {
  return typeof value === "string" && /^[A-Z]{2}$/.test(value);
}

function normalizeServiceValue(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  if (Array.isArray(value)) {
    const cleaned = value
      .filter((v) => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean);

    return cleaned.length ? cleaned : null;
  }

  return null;
}

function validateAndNormalizeCountries(raw) {
  const errors = [];
  const normalized = [];
  const seenIso2 = new Set();

  for (const [idx, c] of raw.entries()) {
    const path = `countries[${idx}]`;

    const iso2Raw = c?.iso2;
    const iso2 = typeof iso2Raw === "string" ? iso2Raw.toUpperCase() : iso2Raw;

    if (!isValidIso2(iso2)) {
      errors.push(
        `${path}: invalid iso2 "${iso2Raw}" (expected 2-letter code like "BE")`,
      );
      continue;
    }

    if (seenIso2.has(iso2)) {
      errors.push(`${path}: duplicate iso2 "${iso2}"`);
      continue;
    }
    seenIso2.add(iso2);

    const name = c?.name;
    if (typeof name !== "string" || !name.trim()) {
      errors.push(`${path}: invalid name "${name}"`);
      continue;
    }

    if (!c?.services || typeof c.services !== "object") {
      errors.push(`${path}: missing/invalid services object`);
      continue;
    }

    const services = {};
    for (const key of ["general", "police", "ambulance", "fire"]) {
      const normalizedValue = normalizeServiceValue(c.services[key]);
      if (normalizedValue !== null) services[key] = normalizedValue;
    }

    normalized.push({
      ...c,
      iso2,
      name: name.trim(),
      services,
    });
  }

  return { normalized, errors };
}

const { normalized: COUNTRY_DATA, errors: COUNTRY_DATA_ERRORS } =
  validateAndNormalizeCountries(countries);

if (COUNTRY_DATA_ERRORS.length) {
  console.warn("⚠️ Country data validation warnings:");
  for (const e of COUNTRY_DATA_ERRORS) console.warn(" -", e);
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is healthy" });
});

// List all countries (minimal fields for picker)
app.get("/api/countries", (req, res) => {
  const list = COUNTRY_DATA.map((c) => ({ iso2: c.iso2, name: c.name })).sort(
    (a, b) => a.name.localeCompare(b.name),
  );
  res.json(list);
});

// Fetch one country by ISO2
app.get("/api/countries/:iso2", (req, res) => {
  const iso2 = String(req.params.iso2 || "").toUpperCase();
  const country = COUNTRY_DATA.find((c) => c.iso2 === iso2);

  if (!country) {
    return res.status(404).json({ error: "Country not found" });
  }

  res.json(country);
});

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Simple in-memory cache (Phase 1 MVP)
const nearbyCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheGet(key) {
  const entry = nearbyCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    nearbyCache.delete(key);
    return null;
  }
  return entry.value;
}

function cacheSet(key, value) {
  nearbyCache.set(key, { time: Date.now(), value });
}

// Haversine distance (meters)
function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function buildOverpassQuery(type, lat, lon) {
  // radius in meters
  const radius = type === "diplomatic" ? 20000 : 10000;

  if (type === "hospitals") {
    return `
[out:json][timeout:25];
(
  node(around:${radius},${lat},${lon})["amenity"="hospital"];
  way(around:${radius},${lat},${lon})["amenity"="hospital"];
  relation(around:${radius},${lat},${lon})["amenity"="hospital"];
);
out center tags;
`.trim();
  }

  if (type === "diplomatic") {
    return `
[out:json][timeout:25];
(
  node(around:${radius},${lat},${lon})["amenity"="embassy"];
  way(around:${radius},${lat},${lon})["amenity"="embassy"];
  relation(around:${radius},${lat},${lon})["amenity"="embassy"];

  node(around:${radius},${lat},${lon})["office"="diplomatic"];
  way(around:${radius},${lat},${lon})["office"="diplomatic"];
  relation(around:${radius},${lat},${lon})["office"="diplomatic"];
);
out center tags;
`.trim();
  }

  return null;
}

app.get("/api/nearby", async (req, res) => {
  try {
    const type = String(req.query.type || "");
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!["hospitals", "diplomatic"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: "Invalid lat/lon" });
    }

    // Round coords for cache key
    const key = `${type}:${lat.toFixed(3)}:${lon.toFixed(3)}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    const query = buildOverpassQuery(type, lat, lon);
    if (!query) return res.status(400).json({ error: "Invalid type" });

    const overpassRes = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
    });

    if (!overpassRes.ok) {
      return res.status(502).json({ error: "Failed to fetch nearby places" });
    }

    const data = await overpassRes.json();

    const items = (data.elements || [])
      .map((el) => {
        const t = el.tags || {};
        const pLat = el.lat ?? el.center?.lat;
        const pLon = el.lon ?? el.center?.lon;
        if (!Number.isFinite(pLat) || !Number.isFinite(pLon)) return null;

        const addressParts = [
          t["addr:housenumber"],
          t["addr:street"],
          t["addr:city"] || t["addr:town"] || t["addr:village"],
          t["addr:postcode"],
        ].filter(Boolean);

        return {
          id: `${el.type}/${el.id}`,
          name:
            t.name ||
            (type === "hospitals" ? "Hospital" : "Embassy / Consulate"),
          lat: pLat,
          lon: pLon,
          distanceM: Math.round(distanceMeters(lat, lon, pLat, pLon)),
          address: addressParts.join(", ") || null,
          phone: t.phone || t["contact:phone"] || null,
          website: t.website || t["contact:website"] || null,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distanceM - b.distanceM)
      .slice(0, 10);

    const payload = { type, lat, lon, items };

    cacheSet(key, payload);
    res.json(payload);
  } catch {
    res.status(500).json({ error: "Unexpected error" });
  }
});

const clientDistPath = path.resolve(__dirname, "../../client/dist");

// Only serve the built client when running in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));

  // SPA fallback for non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

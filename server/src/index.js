import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countries = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/countries.json"), "utf8"),
);

app.use(express.json());

// --- Security headers ---
app.use(
  helmet({
    // Keep it minimal and compatible for now.
    // If you later add external assets, we’ll whitelist them.
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "https:"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "script-src": ["'self'"],
        "connect-src": [
          "'self'",
          "https://overpass-api.de",
          "https://nominatim.openstreetmap.org",
        ],
      },
    },
    crossOriginEmbedderPolicy: false, // avoid breaking common embeds
  }),
);

// --- Explicit Permissions-Policy (geolocation only when user triggers it client-side) ---
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(self)");
  next();
});

// --- CORS lockdown ---
// In production, set CLIENT_ORIGIN to your deployed frontend origin, e.g. https://yourapp.onrender.com
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

const ALLOWED_ORIGINS = (CLIENT_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (process.env.NODE_ENV !== "production") return cb(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET"],
  }),
);

app.use((err, req, res, next) => {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS blocked" });
  }
  next(err);
});

// --- Rate limiting ---
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const nearbyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function isValidLatLon(lat, lon) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

app.use("/api", apiLimiter);
app.use("/api/nearby", nearbyLimiter);

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
    const at = `countries[${idx}]`;

    const iso2Raw = c?.iso2;
    const iso2 = typeof iso2Raw === "string" ? iso2Raw.toUpperCase() : iso2Raw;

    if (!isValidIso2(iso2)) {
      errors.push(`${at}: invalid iso2 "${iso2Raw}" (expected "BE")`);
      continue;
    }

    if (seenIso2.has(iso2)) {
      errors.push(`${at}: duplicate iso2 "${iso2}"`);
      continue;
    }
    seenIso2.add(iso2);

    const name = c?.name;
    if (typeof name !== "string" || !name.trim()) {
      errors.push(`${at}: invalid name "${name}"`);
      continue;
    }

    if (!c?.services || typeof c.services !== "object") {
      errors.push(`${at}: missing/invalid services object`);
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

async function fetchWithTimeout(url, options, timeoutMs = 10_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
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

// Simple in-memory cache
const nearbyCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

const inFlightNearby = new Map(); // key -> Promise<payload>

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

function safeHttpUrl(url) {
  if (typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {}
  return null;
}

function buildOverpassQuery(type, lat, lon, radius) {
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
  const type = String(req.query.type || "");
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  try {
    if (!["hospitals", "diplomatic"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }
    if (!isValidLatLon(lat, lon)) {
      return res.status(400).json({ error: "Invalid lat/lon" });
    }

    // Optional radius override (safe bounds)
    const defaultRadius = type === "diplomatic" ? 20000 : 10000;
    const radiusRaw = req.query.radiusM;
    const radiusNum =
      radiusRaw === undefined ? defaultRadius : Number(radiusRaw);

    if (!Number.isFinite(radiusNum)) {
      return res.status(400).json({ error: "Invalid radiusM" });
    }

    const radius = clamp(Math.round(radiusNum), 500, 50000);

    // Round coords for cache key
    const key = `${type}:${radius}:${lat.toFixed(3)}:${lon.toFixed(3)}`;

    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    // If already fetching, await same promise
    const existing = inFlightNearby.get(key);
    if (existing) {
      const payload = await existing;
      return res.json(payload);
    }

    // Create and register in-flight promise
    const p = (async () => {
      const query = buildOverpassQuery(type, lat, lon, radius);
      if (!query) {
        const err = new Error("Invalid type");
        err.statusCode = 400;
        throw err;
      }

      const overpassRes = await fetchWithTimeout(
        OVERPASS_URL,
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: query,
        },
        15_000,
      );

      if (!overpassRes.ok) {
        const err = new Error("Failed to fetch nearby places");
        err.statusCode = 502;
        throw err;
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
            // website: t.website || t["contact:website"] || null,
            website: safeHttpUrl(t.website || t["contact:website"]) || null,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distanceM - b.distanceM)
        .slice(0, 10);

      const payload = { type, lat, lon, radius, items };
      cacheSet(key, payload);
      return payload;
    })();

    inFlightNearby.set(key, p);

    try {
      const payload = await p;
      return res.json(payload);
    } finally {
      // Ensure cleanup even if res.json throws (rare) or promise rejects
      inFlightNearby.delete(key);
    }
  } catch (err) {
    const status = err?.statusCode || (err?.name === "AbortError" ? 504 : 500);
    const msg =
      err?.name === "AbortError"
        ? "Nearby provider timed out"
        : err?.message || "Unexpected error";
    return res.status(status).json({ error: msg });
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

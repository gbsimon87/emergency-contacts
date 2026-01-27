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

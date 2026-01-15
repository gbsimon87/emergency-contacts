import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import countries from "./data/countries.json" with { type: "json" };

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is healthy" });
});

// List all countries (minimal fields for picker)
app.get("/api/countries", (req, res) => {
  const list = countries
    .map((c) => ({ iso2: c.iso2, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  res.json(list);
});

// Fetch one country by ISO2
app.get("/api/countries/:iso2", (req, res) => {
  const iso2 = String(req.params.iso2 || "").toUpperCase();
  const country = countries.find((c) => c.iso2 === iso2);

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

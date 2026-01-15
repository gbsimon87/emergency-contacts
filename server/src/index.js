import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is healthy" });
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

import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "ec_selected_country_iso2";

function CallButton({ label, number }) {
  const disabled = !number;
  const href = number ? `tel:${number}` : undefined;

  return (
    <a
      href={href}
      className={[
        "block w-full rounded-2xl border p-4 text-left",
        "active:scale-[0.99] transition",
        disabled ? "opacity-50 pointer-events-none" : "hover:bg-black/5",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">{label}</div>
          <div className="text-2xl font-bold tracking-tight">
            {number || "—"}
          </div>
        </div>
        <div className="text-sm font-medium rounded-full border px-3 py-1">
          Call
        </div>
      </div>
    </a>
  );
}

export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedIso2, setSelectedIso2] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "GB"
  );
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [error, setError] = useState("");

  // Load country list for picker
  useEffect(() => {
    (async () => {
      try {
        setError("");
        const res = await fetch("/api/countries");
        if (!res.ok) throw new Error("Failed to load countries");
        const data = await res.json();
        setCountries(data);
      } catch (e) {
        setError(e.message || "Something went wrong");
      }
    })();
  }, []);

  // Load selected country details
  useEffect(() => {
    (async () => {
      try {
        setLoadingCountry(true);
        setError("");
        const res = await fetch(`/api/countries/${selectedIso2}`);
        if (!res.ok) throw new Error("Failed to load country details");
        const data = await res.json();
        setSelectedCountry(data);
        localStorage.setItem(STORAGE_KEY, selectedIso2);
      } catch (e) {
        setError(e.message || "Something went wrong");
        setSelectedCountry(null);
      } finally {
        setLoadingCountry(false);
      }
    })();
  }, [selectedIso2]);

  const services = useMemo(
    () => selectedCountry?.services || {},
    [selectedCountry]
  );

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-lg space-y-4">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Emergency Contacts
          </h1>
          <p className="text-sm opacity-80">
            Select a country to see emergency numbers. Tap to call.
          </p>
        </header>

        <section className="rounded-2xl border p-4 space-y-3">
          <label className="block text-sm font-medium">Country</label>
          <select
            value={selectedIso2}
            onChange={(e) => setSelectedIso2(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            {countries.map((c) => (
              <option key={c.iso2} value={c.iso2}>
                {c.name}
              </option>
            ))}
          </select>

          {loadingCountry && (
            <p className="text-sm opacity-70">Loading numbers…</p>
          )}

          {selectedCountry && (
            <p className="text-sm opacity-70">
              Showing numbers for{" "}
              <span className="font-medium">{selectedCountry.name}</span>
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </section>

        <section className="space-y-3">
          <CallButton label="General Emergency" number={services.general} />
          <CallButton label="Police" number={services.police} />
          <CallButton label="Ambulance" number={services.ambulance} />
          <CallButton label="Fire" number={services.fire} />
        </section>

        <footer className="rounded-2xl border p-4 text-xs opacity-80">
          <p className="font-medium">Disclaimer</p>
          <p>
            Emergency numbers can vary by region and may change. If you are
            able, confirm you selected the correct country before calling.
          </p>
        </footer>
      </div>
    </main>
  );
}

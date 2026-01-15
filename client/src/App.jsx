import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "ec_selected_country_iso2";

function CallButton({ label, number }) {
  const disabled = !number;

  function handleClick(e) {
    if (disabled) return;
    const ok = window.confirm(`Call ${label}: ${number}?`);
    if (!ok) e.preventDefault();
  }

  return (
    <a
      href={number ? `tel:${number}` : undefined}
      onClick={handleClick}
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
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function fetchCountries() {
    try {
      setError("");
      const res = await fetch("/api/countries");
      if (!res.ok) throw new Error("Failed to load countries");
      const data = await res.json();
      setCountries(data);
    } catch {
      setError("Can't reach the server right now. Please try again.");
    }
  }

  async function fetchCountryDetails(iso2) {
    try {
      setLoadingCountry(true);
      setError("");
      const res = await fetch(`/api/countries/${iso2}`);
      if (!res.ok) throw new Error("Failed to load country details");
      const data = await res.json();
      setSelectedCountry(data);
      localStorage.setItem(STORAGE_KEY, iso2);
    } catch {
      setError(
        "Can't load updated numbers right now. Showing last available info."
      );
      // Keep selectedCountry as-is (last known numbers)
    } finally {
      setLoadingCountry(false);
    }
  }

  // Load country list for picker
  useEffect(() => {
    fetchCountries();
  }, []);

  // Load selected country details
  useEffect(() => {
    fetchCountryDetails(selectedIso2);
  }, [selectedIso2]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;

    const q = search.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, search]);

  // Keep selectedIso2 in sync with the filtered list.
  // If the selected country disappears due to search filtering,
  // automatically pick the first match so numbers update.
  useEffect(() => {
    if (!filteredCountries.length) return;

    const stillVisible = filteredCountries.some((c) => c.iso2 === selectedIso2);
    if (!stillVisible && search.trim()) {
      setSelectedIso2(filteredCountries[0].iso2);
    }
  }, [filteredCountries, selectedIso2, search]);

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

          <input
            type="text"
            placeholder="Search country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />

          <select
            value={selectedIso2}
            onChange={(e) => setSelectedIso2(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            {filteredCountries.map((c) => (
              <option key={c.iso2} value={c.iso2}>
                {c.name}
              </option>
            ))}
          </select>

          {filteredCountries.length === 0 && (
            <p className="text-sm opacity-70">
              No countries match your search.
            </p>
          )}

          {loadingCountry && (
            <p className="text-sm opacity-70">Loading numbers…</p>
          )}

          {selectedCountry && (
            <p className="text-sm opacity-70">
              Showing numbers for{" "}
              <span className="font-medium">{selectedCountry.name}</span>
            </p>
          )}

          {error && (
            <div className="rounded-xl border p-3 space-y-2">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => {
                  fetchCountries();
                  fetchCountryDetails(selectedIso2);
                }}
                className="w-full rounded-xl border px-3 py-2 text-sm font-medium hover:bg-black/5"
              >
                Retry
              </button>
            </div>
          )}
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

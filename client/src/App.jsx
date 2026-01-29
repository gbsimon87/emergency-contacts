import { useEffect, useMemo, useState } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import "./App.css";

const STORAGE_KEY = "ec_selected_country_iso2";
const CACHE_COUNTRIES_KEY = "ec_cached_countries_v1";
const CACHE_COUNTRY_DETAILS_PREFIX = "ec_cached_country_v1_"; // + ISO2
const STORAGE_MANUAL_KEY = "ec_country_manually_set";

function WhatToSay({ service }) {
  const labels = {
    general: "General Emergency",
    police: "Police",
    ambulance: "Ambulance",
    fire: "Fire",
  };

  const firstLine = {
    general: "I need emergency help.",
    police: "I need the police.",
    ambulance: "I need an ambulance.",
    fire: "There is a fire. I need the fire service.",
  };

  const example = {
    general: "Someone is hurt / there's danger.",
    police: "There's a crime / I feel unsafe.",
    ambulance: "Someone is unconscious / injured / bleeding.",
    fire: "A building / vehicle / area is on fire.",
  };

  return (
    <details className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
      <summary className="cursor-pointer select-none text-xs font-semibold text-slate-700 hover:underline focus:outline-none">
        What should I say?
      </summary>

      <div className="mt-2 space-y-2 text-xs text-slate-700">
        <div className="font-semibold">
          Quick script for {labels[service] || "emergency"}:
        </div>

        <ol className="list-decimal pl-5 space-y-1">
          <li>
            Say the emergency clearly:{" "}
            <span className="font-semibold">“{firstLine[service]}”</span>
          </li>
          <li>
            Give your location:{" "}
            <span className="font-semibold">
              address, landmark, or nearby place
            </span>
          </li>
          <li>
            Describe what's happening:{" "}
            <span className="font-semibold">{example[service]}</span>
          </li>
          <li>Answer questions and stay on the line.</li>
          <li>
            If you can't speak:{" "}
            <span className="font-semibold">“Please send help.”</span>
          </li>
        </ol>

        <p className="text-[11px] text-slate-500">
          Tip: If English isn't understood, repeat the service name (police /
          ambulance / fire) and your location slowly.
        </p>
      </div>
    </details>
  );
}

function FirstAidGuidance() {
  const cards = [
    {
      key: "bleeding",
      title: "Bleeding",
      priority: "Call first, then act",
      tone: "call",
      steps: [
        "Apply firm pressure with a clean cloth or your hand.",
        "Raise the injured area if possible.",
        "Do not remove objects stuck in the wound.",
        "Keep pressure until help arrives.",
      ],
      note: "Stop if the situation becomes unsafe.",
    },
    {
      key: "choking",
      title: "Choking",
      priority: "Act immediately, then call",
      tone: "act",
      steps: [
        "Ask: “Can you breathe or cough?”",
        "If not, perform abdominal thrusts (Heimlich).",
        "If the person becomes unresponsive, start CPR.",
        "Call emergency services as soon as possible.",
      ],
      note: "If unsure, act and call for help.",
    },
    {
      key: "unresponsive",
      title: "Unconscious / Not Responding",
      priority: "Call first, then act",
      tone: "call",
      steps: [
        "Check if the person responds when you speak or tap them.",
        "Call emergency services immediately.",
        "Check if they are breathing.",
        "If breathing, place them on their side.",
        "If not breathing, start CPR.",
      ],
      note: "Do not leave the person alone.",
    },
    {
      key: "cpr",
      title: "CPR",
      priority: "Call first, then act",
      tone: "call",
      steps: [
        "Call emergency services (or ask someone else to call).",
        "Place hands in the center of the chest.",
        "Push hard and fast (about 2 pushes per second).",
        "Continue until help arrives or the person responds.",
      ],
      note: "Any attempt is better than none.",
    },
    {
      key: "heart-attack",
      title: "Heart Attack",
      priority: "Call first",
      tone: "call",
      steps: [
        "Call emergency services immediately.",
        "Help the person sit or lie down comfortably.",
        "Loosen tight clothing.",
        "Stay with them and monitor their condition.",
      ],
      note: "Chest pain, pressure, or discomfort can be serious.",
    },
    {
      key: "stroke",
      title: "Stroke",
      priority: "Call first",
      tone: "call",
      steps: [
        "Check for face drooping.",
        "Ask them to raise both arms.",
        "Listen for slurred or unclear speech.",
        "Call emergency services immediately.",
      ],
      note: "Act fast — early treatment saves lives.",
    },
    {
      key: "seizure",
      title: "Seizure",
      priority: "Act first, then call",
      tone: "act",
      steps: [
        "Move objects away to prevent injury.",
        "Protect their head if possible.",
        "Do not restrain them.",
        "Do not put anything in their mouth.",
        "Call emergency services if the seizure lasts more than a few minutes.",
      ],
      note: "Stay calm and stay with them.",
    },
    {
      key: "allergic-reaction",
      title: "Severe Allergic Reaction",
      priority: "Call first, then act",
      tone: "call",
      steps: [
        "Call emergency services immediately.",
        "Use an epinephrine auto-injector if available.",
        "Lay the person flat and raise their legs if possible.",
        "If breathing is difficult, help them sit up.",
      ],
      note: "If in doubt, use the injector and call for help.",
    },
  ];

  function badgeClasses(tone) {
    if (tone === "act") {
      return "border-amber-200 bg-amber-50 text-amber-900";
    }
    return "border-red-200 bg-red-50 text-red-900";
  }

  return (
    <section className="rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
      <details className="group">
        <summary className="cursor-pointer select-none focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                First-aid guidance
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Short steps while help is on the way. Always call emergency
                services first when possible.
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              View
            </span>
          </div>
        </summary>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.key}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">
                  {c.title}
                </div>
                <span
                  className={[
                    "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                    badgeClasses(c.tone),
                  ].join(" ")}
                >
                  {c.priority}
                </span>
              </div>

              <ol className="mt-3 list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
                {c.steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>

              <div className="mt-3 text-[11px] text-slate-600">
                <span className="font-semibold">Reminder:</span> {c.note}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-[11px] text-slate-500">
          This is not medical training. If you are unsure, prioritize calling
          emergency services and keeping the scene safe.
        </div>
      </details>
    </section>
  );
}

function safeTelHref(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const cleaned = trimmed.replace(/[^\d+().\-\s]/g, "");
  const normalized = cleaned.replace(/\s+/g, " ").trim();
  if (!normalized) return null;

  return `tel:${normalized}`;
}

function safeHttpUrl(value) {
  if (typeof value !== "string") return null;

  try {
    const u = new URL(value);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return u.toString();
    }
  } catch {
    // Invalid URL — ignore safely
  }

  return null;
}

function SingleCallButton({ label, number, badge }) {
  const telHref = safeTelHref(number);
  const disabled = !telHref;

  function handleClick(e) {
    if (disabled) return;
    const ok = window.confirm(`Call ${label}: ${number}?`);
    if (!ok) e.preventDefault();
  }

  return (
    <a
      href={telHref || undefined}
      onClick={handleClick}
      className={[
        "group block w-full rounded-2xl bg-white",
        "border border-slate-200/70 shadow-sm",
        "p-4 sm:p-5",
        "transition will-change-transform",
        disabled
          ? "opacity-50 pointer-events-none"
          : "hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-slate-900">{label}</div>
            {badge && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {badge}
              </span>
            )}
          </div>

          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {typeof number === "string" && number.trim() ? number : "—"}
          </div>
        </div>

        <div
          className={[
            "shrink-0 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
            disabled
              ? "border border-slate-200 text-slate-500"
              : "bg-slate-900 text-white shadow-sm group-hover:shadow",
          ].join(" ")}
        >
          Call
        </div>
      </div>
    </a>
  );
}

// Supports number as string OR array of strings
function CallButton({ label, number }) {
  if (Array.isArray(number)) {
    return (
      <div className="grid gap-3">
        {number.map((n, idx) => (
          <SingleCallButton
            key={`${label}-${n}-${idx}`}
            label={label}
            number={n}
            badge={idx === 0 ? "Primary" : `Alt ${idx}`}
          />
        ))}
      </div>
    );
  }

  return <SingleCallButton label={label} number={number} />;
}

function guessCountryFromTimeZone(tz) {
  // MVP mapping: small, safe, and only where it's fairly unambiguous.
  // You can expand later without changing UI.
  const map = {
    "Europe/London": "GB",
    "Europe/Dublin": "IE",
    "Europe/Paris": "FR",
    "Europe/Berlin": "DE",
    "Europe/Madrid": "ES",
    "Europe/Rome": "IT",
    "Europe/Amsterdam": "NL",
    "Europe/Brussels": "BE",
    "Europe/Zurich": "CH",
    "Europe/Vienna": "AT",
    "America/New_York": "US",
    "America/Los_Angeles": "US",
    "America/Chicago": "US",
    "America/Toronto": "CA",
    "America/Vancouver": "CA",
    "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU",
    "Pacific/Auckland": "NZ",
    "Asia/Tokyo": "JP",
    "Asia/Seoul": "KR",
  };

  return map[tz] || null;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "";
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function mapsLink(lat, lon) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedIso2, setSelectedIso2] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "GB",
  );
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [autoSuggested, setAutoSuggested] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState("");
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [nearbyDiplomatic, setNearbyDiplomatic] = useState([]);
  const { location, requestOnce: requestLocationOnce } = useGeolocation();
  const [detectedIso2, setDetectedIso2] = useState(null);
  const [detectingCountry, setDetectingCountry] = useState(false);
  const [appError, setAppError] = useState("");

  async function fetchCountries() {
    try {
      setAppError("");
      const res = await fetch("/api/countries");
      if (!res.ok) throw new Error("Failed to load countries");
      const data = await res.json();

      setCountries(data);
      localStorage.setItem(CACHE_COUNTRIES_KEY, JSON.stringify(data));
    } catch {
      // Fallback: cached country list
      const cached = localStorage.getItem(CACHE_COUNTRIES_KEY);
      if (cached) {
        try {
          setCountries(JSON.parse(cached));
          setAppError("Offline — using last saved country list.");
          return;
        } catch {
          // ignore JSON parse errors
        }
      }

      setAppError("Can't reach the server right now. Please try again.");
    }
  }

  async function fetchCountryDetails(iso2) {
    const cacheKey = `${CACHE_COUNTRY_DETAILS_PREFIX}${iso2}`;

    try {
      setLoadingCountry(true);
      setAppError("");

      const res = await fetch(`/api/countries/${iso2}`);
      if (!res.ok) throw new Error("Failed to load country details");
      const data = await res.json();

      setSelectedCountry(data);
      localStorage.setItem(STORAGE_KEY, iso2);
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      // Fallback: cached country details
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setSelectedCountry(JSON.parse(cached));
          setAppError("Offline — using last saved emergency numbers.");
          return;
        } catch {
          // ignore JSON parse errors
        }
      }

      setAppError(
        "Can't load updated numbers right now. Showing last available info.",
      );
      // Keep selectedCountry as-is (last known numbers)
    } finally {
      setLoadingCountry(false);
    }
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchCountryDetails(selectedIso2);
  }, [selectedIso2]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, search]);

  useEffect(() => {
    if (!filteredCountries.length) return;
    const stillVisible = filteredCountries.some((c) => c.iso2 === selectedIso2);
    if (!stillVisible && search.trim()) {
      setSelectedIso2(filteredCountries[0].iso2);
    }
  }, [filteredCountries, selectedIso2, search]);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const manuallySet = localStorage.getItem(STORAGE_MANUAL_KEY) === "1";
    if (manuallySet) return;

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const guess = guessCountryFromTimeZone(tz);

      // Only auto-set if we have a guess and it's different.
      if (guess && guess !== selectedIso2) {
        setSelectedIso2(guess);
        setAutoSuggested(true);
        window.setTimeout(() => setAutoSuggested(false), 2500);
      }
    } catch {
      // Do nothing — never block usage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const services = useMemo(
    () => selectedCountry?.services || {},
    [selectedCountry],
  );

  function formatServiceValue(value) {
    if (!value) return "—";
    return Array.isArray(value) ? value.join(" / ") : value;
  }

  function buildShareText() {
    if (!selectedCountry) return "";

    const lines = [
      `Emergency numbers — ${selectedCountry.name}`,
      `General: ${formatServiceValue(services.general)}`,
      `Police: ${formatServiceValue(services.police)}`,
      `Ambulance: ${formatServiceValue(services.ambulance)}`,
      `Fire: ${formatServiceValue(services.fire)}`,
    ];

    return lines.join("\n");
  }

  async function copyAllNumbers() {
    if (!selectedCountry) return;

    const lines = [
      selectedCountry.name,
      `General: ${formatServiceValue(services.general)}`,
      `Police: ${formatServiceValue(services.police)}`,
      `Ambulance: ${formatServiceValue(services.ambulance)}`,
      `Fire: ${formatServiceValue(services.fire)}`,
    ];

    const text = lines.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback (older browsers)
      window.prompt("Copy the emergency numbers:", text);
    }
  }

  async function shareNumbers() {
    if (!selectedCountry) return;

    const text = buildShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Emergency numbers — ${selectedCountry.name}`,
          text,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 1500);
        return;
      }

      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      setShared(true);
      window.setTimeout(() => setShared(false), 1500);
    } catch {
      // Last-resort fallback
      window.prompt("Copy the emergency numbers:", text);
    }
  }

  async function useMyLocation() {
    setAppError("");

    let coords = null;

    try {
      setDetectingCountry(true);

      // If this fails, the hook will set location.status/errorMessage
      coords = await requestLocationOnce();

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}`,
      );

      if (!res.ok)
        throw new Error("Could not determine country from location.");

      const data = await res.json();
      const iso2 = data?.address?.country_code?.toUpperCase();

      if (iso2 && /^[A-Z]{2}$/.test(iso2)) {
        setDetectedIso2(iso2);
      } else {
        setAppError(
          "Could not determine your country. Please select manually.",
        );
      }
    } catch (e) {
      // Only use global appError when geocoding failed AFTER coords were obtained.
      if (coords) {
        setAppError(
          e?.message ||
            "Could not determine your country. Please select manually.",
        );
      }
      // If coords are null, it was a location permission/unavailable/timeout issue,
      // and the location status box will already show the right message.
    } finally {
      setDetectingCountry(false);
    }
  }

  async function loadNearby() {
    try {
      setNearbyError("");
      setNearbyLoading(true);

      const coords = await requestLocationOnce();
      const lat = coords.lat;
      const lon = coords.lon;

      const [hRes, dRes] = await Promise.all([
        fetch(`/api/nearby?type=hospitals&lat=${lat}&lon=${lon}`),
        fetch(`/api/nearby?type=diplomatic&lat=${lat}&lon=${lon}`),
      ]);

      if (!hRes.ok || !dRes.ok)
        throw new Error("Could not load nearby places.");

      const h = await hRes.json();
      const d = await dRes.json();

      setNearbyHospitals(h.items || []);
      setNearbyDiplomatic(d.items || []);
    } catch (e) {
      const status = e?.status || location?.status;

      // If location failed, show a nearby-specific message, not another "Denied" box.
      if (status === "denied") {
        setNearbyError(
          "Location permission is denied. Enable it to use Nearby help.",
        );
      } else if (status === "timed_out") {
        setNearbyError("Location timed out. Try again.");
      } else if (status === "unavailable") {
        setNearbyError("Location is unavailable on this device right now.");
      } else {
        setNearbyError(e?.message || "Could not load nearby places.");
      }
    } finally {
      setNearbyLoading(false);
    }
  }

  function iso2ToFlag(iso2) {
    return iso2
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt()),
      );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {/* Top header bar */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Emergency Contacts
            </h1>
            <p className="text-sm text-slate-600">
              Select a country to see emergency numbers. Tap to call.
            </p>
          </div>
        </header>

        {/* Main content layout */}
        <div className="mt-6 grid gap-4 md:grid-cols-[360px,1fr] md:items-start">
          {/* Picker card */}
          <section className="rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Country</div>
                <div className="mt-1 text-xs text-slate-500">
                  Search, then choose from the list.
                </div>
              </div>

              {loadingCountry && (
                <p className="text-sm opacity-70">
                  Fetching local emergency numbers…
                </p>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-600">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search country…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={[
                    "w-full rounded-2xl border border-slate-200 bg-slate-50",
                    "px-3 py-2.5 text-sm",
                    "placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-300",
                  ].join(" ")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-600">
                  Country list
                </label>
                <select
                  value={selectedIso2}
                  onChange={(e) => {
                    const iso2 = e.target.value;
                    setSelectedIso2(iso2);
                    localStorage.setItem(STORAGE_MANUAL_KEY, "1");
                  }}
                  className={[
                    "w-full rounded-2xl border border-slate-200 bg-white",
                    "px-3 py-2.5 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-300",
                  ].join(" ")}
                >
                  {filteredCountries.map((c) => (
                    <option key={c.iso2} value={c.iso2}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {autoSuggested && (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                    We selected a country automatically — please confirm it's
                    correct.
                  </div>
                )}
                {/* <button
                  type="button"
                  onClick={useMyLocation}
                  className={[
                    "w-full rounded-2xl px-3 py-2.5 text-sm font-semibold",
                    "border border-slate-200 bg-white",
                    "hover:bg-slate-50 active:scale-[0.99] transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  ].join(" ")}
                >
                  Use my location
                </button> */}
                <button
                  type="button"
                  onClick={useMyLocation}
                  className={[
                    "w-full rounded-2xl px-3 py-2.5 text-sm font-semibold",
                    "border border-slate-200 bg-white",
                    "hover:bg-slate-50 active:scale-[0.99] transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    detectingCountry ? "opacity-70 pointer-events-none" : "",
                  ].join(" ")}
                >
                  {detectingCountry ? "Detecting…" : "Use my location"}
                </button>

                {/* Location status (truthful state machine) */}
                {location.status !== "not_requested" && (
                  <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 space-y-1">
                    <div>
                      <span className="font-semibold">Location status:</span>{" "}
                      {location.status === "requesting"
                        ? "Requesting…"
                        : location.status === "granted"
                          ? "Granted"
                          : location.status === "denied"
                            ? "Denied"
                            : location.status === "timed_out"
                              ? "Timed out"
                              : location.status === "unavailable"
                                ? "Unavailable"
                                : "Error"}
                    </div>

                    {location.errorMessage && (
                      <div className="text-[11px] text-slate-600">
                        {location.errorMessage}
                      </div>
                    )}

                    {/* Try again */}
                    {(location.status === "denied" ||
                      location.status === "timed_out" ||
                      location.status === "unavailable" ||
                      location.status === "error") && (
                      <button
                        type="button"
                        onClick={useMyLocation}
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-100"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                )}

                {/* Detected country confirmation prompt (no auto-switch) */}
                {detectedIso2 && detectedIso2 !== selectedIso2 && (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 space-y-2">
                    <div className="font-semibold">
                      Detected country: {detectedIso2}. Switch to it?
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIso2(detectedIso2);
                          localStorage.setItem(STORAGE_MANUAL_KEY, "1"); // user-confirmed choice
                          setDetectedIso2(null);
                          setAutoSuggested(true);
                          window.setTimeout(
                            () => setAutoSuggested(false),
                            2500,
                          );
                        }}
                        className="flex-1 rounded-2xl bg-slate-900 text-white px-3 py-2 text-xs font-semibold hover:opacity-90"
                      >
                        Yes, switch
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetectedIso2(null)}
                        className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                      >
                        No
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      We’ll never change your country without asking.
                    </div>
                  </div>
                )}
              </div>

              {filteredCountries.length === 0 && (
                <p className="text-sm text-slate-600">
                  No countries match your search.
                </p>
              )}

              {selectedCountry && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Emergency numbers for
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                    <span className="text-2xl">
                      {iso2ToFlag(selectedCountry.iso2)}
                    </span>
                    <span>{selectedCountry.name}</span>
                  </div>

                  {selectedCountry?.metadata?.lastVerified && (
                    <div className="mt-2 text-xs text-slate-600">
                      Last verified:{" "}
                      <span className="font-medium text-slate-700">
                        {selectedCountry.metadata.lastVerified}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {appError && (
                <div className="rounded-2xl border border-red-200 bg-white p-3 space-y-2">
                  <p className="text-sm text-red-700">{appError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      fetchCountries();
                      fetchCountryDetails(selectedIso2);
                    }}
                    className={[
                      "w-full rounded-2xl px-3 py-2.5 text-sm font-semibold",
                      "border border-slate-200 bg-white",
                      "hover:bg-slate-50 active:scale-[0.99] transition",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    ].join(" ")}
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Calls + disclaimer */}
          <div className="space-y-4">
            <section className="rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">Emergency services</h2>

                  <div className="mt-1">
                    {selectedCountry ? (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-xs text-slate-500">
                          Current country:
                        </span>
                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {selectedCountry.name}
                        </span>

                        {isOffline && (
                          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                            Offline
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Select a country to view numbers
                      </p>
                    )}

                    {/* Only show the long offline message when helpful (mobile-friendly) */}
                    {isOffline && (
                      <p className="mt-1 text-[11px] text-amber-800/90">
                        Using last saved data
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={copyAllNumbers}
                    disabled={!selectedCountry}
                    className={[
                      "rounded-2xl px-3 py-2 text-xs font-semibold",
                      "border border-slate-200 bg-white",
                      "hover:bg-slate-50 active:scale-[0.99] transition",
                      "disabled:opacity-50 disabled:pointer-events-none",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                      "whitespace-nowrap", // prevents "Copy all" wrapping
                    ].join(" ")}
                  >
                    {copied ? "Copied" : "Copy all"}
                  </button>

                  <button
                    type="button"
                    onClick={shareNumbers}
                    disabled={!selectedCountry}
                    className={[
                      "rounded-2xl px-3 py-2 text-xs font-semibold",
                      "border border-slate-200 bg-white",
                      "hover:bg-slate-50 active:scale-[0.99] transition",
                      "disabled:opacity-50 disabled:pointer-events-none",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                      "whitespace-nowrap",
                    ].join(" ")}
                  >
                    {shared ? "Shared" : "Share"}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <CallButton
                    label="General Emergency"
                    number={services.general}
                  />
                  <WhatToSay service="general" />
                </div>

                <div>
                  <CallButton label="Police" number={services.police} />
                  <WhatToSay service="police" />
                </div>

                <div>
                  <CallButton label="Ambulance" number={services.ambulance} />
                  <WhatToSay service="ambulance" />
                </div>

                <div>
                  <CallButton label="Fire" number={services.fire} />
                  <WhatToSay service="fire" />
                </div>
              </div>
            </section>

            {/* Nearby help section */}
            <section className="rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
              <details
                className="group"
                onToggle={(e) => {
                  const open = e.currentTarget.open;
                  if (
                    open &&
                    nearbyHospitals.length === 0 &&
                    nearbyDiplomatic.length === 0 &&
                    !nearbyLoading
                  ) {
                    loadNearby();
                  }
                }}
              >
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900 focus:outline-none">
                  Nearby help (optional)
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    Hospitals and embassies/consulates
                  </span>
                </summary>

                <div className="mt-3 space-y-4">
                  {nearbyLoading && (
                    <p className="text-sm text-slate-600">
                      Finding nearby places…
                    </p>
                  )}

                  {nearbyError && (
                    <div className="rounded-2xl border border-red-200 bg-white p-3">
                      <p className="text-sm text-red-700">{nearbyError}</p>
                      <button
                        type="button"
                        onClick={loadNearby}
                        className="mt-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!nearbyLoading && !nearbyError && (
                    <>
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">
                          Nearby hospitals
                        </div>
                        {nearbyHospitals.length === 0 ? (
                          <p className="text-sm text-slate-600">
                            No hospitals found nearby.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {nearbyHospitals.map((p) => {
                              const tel = safeTelHref(p.phone);
                              const site = safeHttpUrl(p.website);

                              return (
                                <li
                                  key={p.id}
                                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-sm font-semibold text-slate-900">
                                        {p.name}
                                      </div>
                                      <div className="mt-0.5 text-xs text-slate-600">
                                        {formatDistance(p.distanceM)}
                                        {p.address ? ` • ${p.address}` : ""}
                                      </div>
                                    </div>

                                    <a
                                      href={mapsLink(p.lat, p.lon)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                    >
                                      Open in Maps
                                    </a>
                                  </div>

                                  {(tel || site) && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {tel && (
                                        <a
                                          href={tel}
                                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                        >
                                          Call
                                        </a>
                                      )}
                                      {site && (
                                        <a
                                          href={site}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                        >
                                          Website
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-semibold">
                          Embassies / consulates
                        </div>
                        {nearbyDiplomatic.length === 0 ? (
                          <p className="text-sm text-slate-600">
                            No embassies or consulates found nearby.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {nearbyDiplomatic.map((p) => (
                              <li
                                key={p.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-900">
                                      {p.name}
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-600">
                                      {formatDistance(p.distanceM)}
                                      {p.address ? ` • ${p.address}` : ""}
                                    </div>
                                  </div>

                                  <a
                                    href={mapsLink(p.lat, p.lon)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                  >
                                    Open in Maps
                                  </a>
                                </div>

                                {(p.phone || p.website) && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {safeTelHref(p.phone) && (
                                      <a
                                        href={safeTelHref(p.phone)}
                                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                      >
                                        Call
                                      </a>
                                    )}
                                    {p.website && (
                                      <a
                                        href={p.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                                      >
                                        Website
                                      </a>
                                    )}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500">
                        These results come from OpenStreetMap and may be
                        incomplete. Always call emergency services first when
                        possible.
                      </p>
                    </>
                  )}
                </div>
              </details>
            </section>

            {/* First aid micro-cards */}
            <FirstAidGuidance />

            {/* Footer */}
            <footer className="rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
              <p className="text-sm font-semibold">Disclaimer</p>
              <p className="mt-1 text-sm text-slate-600">
                If it's safe to do so, double-check you selected the correct
                country before calling.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

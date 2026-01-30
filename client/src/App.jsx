import { useEffect, useMemo, useRef, useState } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import "./App.css";

const STORAGE_KEY = "ec_selected_country_iso2";
const CACHE_COUNTRIES_KEY = "ec_cached_countries_v1";
const CACHE_COUNTRY_DETAILS_PREFIX = "ec_cached_country_v1_"; // + ISO2
const STORAGE_MANUAL_KEY = "ec_country_manually_set";

function WhatToSayAll({ defaultService = "general" }) {
  const [service, setService] = useState(defaultService);

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

  const options = [
    { key: "general", label: "General" },
    { key: "police", label: "Police" },
    { key: "ambulance", label: "Ambulance" },
    { key: "fire", label: "Fire" },
  ];

  return (
    <details className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <summary className="cursor-pointer select-none focus:outline-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              What should I say?
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Quick scripts you can read out loud.
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            View
          </span>
        </div>
      </summary>

      <div className="mt-4">
        {/* Service switcher */}
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const active = o.key === service;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setService(o.key)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  "border",
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        {/* Script */}
        <div className="mt-4 space-y-2 text-xs text-slate-700">
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
      </div>
    </details>
  );
}

function FirstAidGuidance() {
  const cards = [
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
  ];

  // alphabetical by title
  const sorted = [...cards].sort((a, b) => a.title.localeCompare(b.title));

  const [activeKey, setActiveKey] = useState(sorted[0]?.key || "");

  // keep activeKey valid if the list changes (defensive, but nice)
  // useEffect(() => {
  //   if (!sorted.length) return;
  //   if (!activeKey || !sorted.some((c) => c.key === activeKey)) {
  //     setActiveKey(sorted[0].key);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sorted.length]);

  const active = sorted.find((c) => c.key === activeKey) || sorted[0];

  function badgeClasses(tone) {
    if (tone === "act") return "border-amber-200 bg-amber-50 text-amber-900";
    return "border-red-200 bg-red-50 text-red-900";
  }

  function tabLabel(title) {
    // small tabs: short, readable
    // "Severe Allergic Reaction" -> "Allergic reaction"
    if (title.toLowerCase().includes("allergic")) return "Allergic reaction";
    if (title.toLowerCase().includes("unconscious")) return "Unconscious";
    return title;
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

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {sorted.map((c) => {
            const activeTab = c.key === activeKey;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveKey(c.key)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  "border",
                  activeTab
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                {tabLabel(c.title)}
              </button>
            );
          })}
        </div>

        {/* Active content */}
        {active && (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900">
                {active.title}
              </div>
              <span
                className={[
                  "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                  badgeClasses(active.tone),
                ].join(" ")}
              >
                {active.priority}
              </span>
            </div>

            <ol className="mt-3 list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
              {active.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>

            <div className="mt-3 text-[11px] text-slate-600">
              <span className="font-semibold">Reminder:</span> {active.note}
            </div>
          </div>
        )}

        <div className="mt-3 text-[11px] text-slate-500">
          This is not medical training. If you are unsure, prioritize calling
          emergency services and keeping the scene safe.
        </div>
      </details>
    </section>
  );
}

function CountryCombobox({
  countries,
  valueIso2,
  onChangeIso2,
  loadingCountry,
  onUseMyLocation,
  detectingCountry,
}) {
  const selected = useMemo(
    () => countries.find((c) => c.iso2 === valueIso2) || null,
    [countries, valueIso2],
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // used for filtering
  const [draft, setDraft] = useState(""); // what user is typing while open
  const [highlightIndex, setHighlightIndex] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click (setState happens in an event callback -> OK)
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
        setDraft("");
        setHighlightIndex(0);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, query]);

  // Clamp highlight index without an effect
  const safeHighlightIndex = Math.min(
    highlightIndex,
    Math.max(0, filtered.length - 1),
  );

  const inputValue = open ? draft : selected?.name || "";

  function pick(iso2) {
    onChangeIso2(iso2);
    setOpen(false);
    setQuery("");
    setDraft("");
    setHighlightIndex(0);
  }

  function onFocus() {
    setOpen(true);
    setQuery("");
    setDraft(selected?.name || "");
    setHighlightIndex(0);
  }

  function onInputChange(e) {
    const next = e.target.value;
    setDraft(next);
    setQuery(next);
    setOpen(true);
    setHighlightIndex(0);
  }

  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      setQuery("");
      setDraft(selected?.name || "");
      setHighlightIndex(0);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[safeHighlightIndex];
      if (item) pick(item.iso2);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
      setDraft("");
      setHighlightIndex(0);
      inputRef.current?.blur();
    }
  }

  const showEmpty = open && filtered.length === 0;

  return (
    <div className="space-y-1.5" ref={wrapperRef}>
      <label className="block text-xs font-medium text-slate-600">
        Country
      </label>

      <div className="flex items-stretch gap-2">
        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            placeholder="Search country…"
            aria-label="Country"
            className={[
              "w-full rounded-2xl border border-slate-200 bg-white",
              "px-3 py-2.5 text-sm",
              "placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-300",
            ].join(" ")}
          />

          {open && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="max-h-72 overflow-auto py-1">
                {showEmpty ? (
                  <div className="px-3 py-2 text-sm text-slate-600">
                    No countries match your search.
                  </div>
                ) : (
                  filtered.map((c, idx) => {
                    const active = idx === safeHighlightIndex;
                    const isSelected = c.iso2 === valueIso2;

                    return (
                      <button
                        key={c.iso2}
                        type="button"
                        onMouseEnter={() => setHighlightIndex(idx)}
                        onMouseDown={(e) => e.preventDefault()} // prevent blur
                        onClick={() => pick(c.iso2)}
                        className={[
                          "w-full text-left px-3 py-2 text-sm",
                          active ? "bg-slate-100" : "bg-white",
                          isSelected
                            ? "font-semibold text-slate-900"
                            : "text-slate-700",
                        ].join(" ")}
                      >
                        {c.name}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-500">
                {loadingCountry
                  ? "Fetching local emergency numbers…"
                  : "Type to filter, Enter to select"}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onUseMyLocation}
          disabled={detectingCountry}
          title="Use my location"
          aria-label="Use my location"
          className={[
            "shrink-0 rounded-2xl px-3",
            "border border-slate-200 bg-white",
            "hover:bg-slate-50 active:scale-[0.99] transition",
            "disabled:opacity-60 disabled:pointer-events-none",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            "inline-flex items-center justify-center",
          ].join(" ")}
        >
          {detectingCountry ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
              aria-hidden="true"
            />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" />
              <path d="M12 11a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          )}
        </button>
      </div>
    </div>
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

function primaryNumber(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value[0] || "";
  return value;
}

function confirmAndCall(label, number) {
  const n = primaryNumber(number);
  const telHref = safeTelHref(n);
  if (!telHref) return;

  const ok = window.confirm(`Call ${label}: ${n}?`);
  if (ok) {
    window.location.href = telHref;
  }
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
      <div className="mx-auto max-w-5xl px-4 py-8 pb-28 sm:py-10 md:pb-10">
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
              <CountryCombobox
                countries={countries}
                valueIso2={selectedIso2}
                loadingCountry={loadingCountry}
                detectingCountry={detectingCountry}
                onUseMyLocation={useMyLocation}
                onChangeIso2={(iso2) => {
                  setSelectedIso2(iso2);
                  localStorage.setItem(STORAGE_MANUAL_KEY, "1");
                }}
              />

              {autoSuggested && (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                  We selected a country automatically — please confirm it's
                  correct.
                </div>
              )}

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
                        localStorage.setItem(STORAGE_MANUAL_KEY, "1");
                        setDetectedIso2(null);
                        setAutoSuggested(true);
                        window.setTimeout(() => setAutoSuggested(false), 2500);
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
                    We'll never change your country without asking.
                  </div>
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
                        <span className="text-lg leading-none">
                          {iso2ToFlag(selectedCountry.iso2)}
                        </span>

                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {selectedCountry.name}
                        </span>

                        {selectedCountry?.metadata?.lastVerified && (
                          <span className="text-[11px] text-slate-500">
                            • Verified {selectedCountry.metadata.lastVerified}
                          </span>
                        )}

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
                </div>

                <div>
                  <CallButton label="Police" number={services.police} />
                </div>

                <div>
                  <CallButton label="Ambulance" number={services.ambulance} />
                </div>

                <div>
                  <CallButton label="Fire" number={services.fire} />
                </div>
              </div>

              <WhatToSayAll defaultService="general" />
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
                This app is provided for informational purposes only. Emergency
                numbers, guidance, and nearby results may be incomplete,
                outdated, or incorrect.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                We do not provide medical, legal, or emergency services, and we
                are not responsible for any outcomes, delays, errors, or actions
                taken based on the information shown here.
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Always use your own judgment and, if possible, verify critical
                information with local authorities or official sources before
                acting.
              </p>
            </footer>
          </div>
        </div>
      </div>

      {/* Mobile sticky call bar */}
      {selectedCountry && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-5xl px-4 pb-4">
            <div className="rounded-3xl border border-slate-200/70 bg-white shadow-lg px-3 py-2">
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    confirmAndCall("General Emergency", services.general)
                  }
                  disabled={!safeTelHref(primaryNumber(services.general))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-800 disabled:opacity-50"
                >
                  General
                </button>

                <button
                  type="button"
                  onClick={() => confirmAndCall("Police", services.police)}
                  disabled={!safeTelHref(primaryNumber(services.police))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-800 disabled:opacity-50"
                >
                  Police
                </button>

                <button
                  type="button"
                  onClick={() =>
                    confirmAndCall("Ambulance", services.ambulance)
                  }
                  disabled={!safeTelHref(primaryNumber(services.ambulance))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-800 disabled:opacity-50"
                >
                  Ambulance
                </button>

                <button
                  type="button"
                  onClick={() => confirmAndCall("Fire", services.fire)}
                  disabled={!safeTelHref(primaryNumber(services.fire))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-800 disabled:opacity-50"
                >
                  Fire
                </button>
              </div>

              <div className="mt-1 text-center text-[10px] text-slate-500">
                Quick call — confirmation required
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

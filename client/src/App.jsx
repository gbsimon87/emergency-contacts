import { useEffect, useMemo, useRef, useState } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import "./App.css";

const STORAGE_KEY = "ec_selected_country_iso2";
const CACHE_COUNTRIES_KEY = "ec_cached_countries_v1";
const CACHE_COUNTRY_DETAILS_PREFIX = "ec_cached_country_v1_"; // + ISO2
const STORAGE_MANUAL_KEY = "ec_country_manually_set";
const EMERGENCY_CONTACTS_STORAGE_KEY = "ec_contacts_v1";
const INFO_CARD_STORAGE_KEY = "ec_info_card_v1";

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

function makeId() {
  // Simple, local-only ID. Works fine until auth is added.
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadEmergencyContacts() {
  try {
    const raw = localStorage.getItem(EMERGENCY_CONTACTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    // v1 shape: { version: 1, contacts: [...] }
    if (parsed && parsed.version === 1 && Array.isArray(parsed.contacts)) {
      return parsed.contacts;
    }

    // Backward compat if you ever stored as array directly
    if (Array.isArray(parsed)) return parsed;

    return [];
  } catch {
    return [];
  }
}

function loadInfoCard() {
  try {
    const raw = localStorage.getItem(INFO_CARD_STORAGE_KEY);
    if (!raw) {
      return {
        version: 2,
        fullName: "",
        homeCountryIso2: "",
        primaryLanguage: "",
        primaryLanguageOther: "",
        bloodType: "unknown", // unknown | A+ | A- | ... | other
        bloodTypeOther: "",
        allergies: [], // array of keys
        allergiesOther: "",
        conditions: [], // array of keys
        conditionsOther: "",
        medications: "",
        medicalNotes: "",
      };
    }

    const parsed = JSON.parse(raw);

    // v2
    if (parsed && parsed.version === 2) {
      return {
        version: 2,
        fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
        homeCountryIso2:
          typeof parsed.homeCountryIso2 === "string"
            ? parsed.homeCountryIso2
            : "",
        primaryLanguage:
          typeof parsed.primaryLanguage === "string"
            ? parsed.primaryLanguage
            : "",
        primaryLanguageOther:
          typeof parsed.primaryLanguageOther === "string"
            ? parsed.primaryLanguageOther
            : "",
        bloodType:
          typeof parsed.bloodType === "string" ? parsed.bloodType : "unknown",
        bloodTypeOther:
          typeof parsed.bloodTypeOther === "string"
            ? parsed.bloodTypeOther
            : "",
        allergies: Array.isArray(parsed.allergies) ? parsed.allergies : [],
        allergiesOther:
          typeof parsed.allergiesOther === "string"
            ? parsed.allergiesOther
            : "",
        conditions: Array.isArray(parsed.conditions) ? parsed.conditions : [],
        conditionsOther:
          typeof parsed.conditionsOther === "string"
            ? parsed.conditionsOther
            : "",
        medications:
          typeof parsed.medications === "string" ? parsed.medications : "",
        medicalNotes:
          typeof parsed.medicalNotes === "string" ? parsed.medicalNotes : "",
      };
    }

    // v1 -> migrate
    if (parsed && parsed.version === 1) {
      return {
        version: 2,
        fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
        homeCountryIso2:
          typeof parsed.homeCountryIso2 === "string"
            ? parsed.homeCountryIso2
            : "",
        primaryLanguage: "",
        primaryLanguageOther: "",
        bloodType: "unknown",
        bloodTypeOther: "",
        allergies: [],
        allergiesOther: "",
        conditions: [],
        conditionsOther: "",
        medications: "",
        medicalNotes:
          typeof parsed.medicalNotes === "string" ? parsed.medicalNotes : "",
      };
    }

    return {
      version: 2,
      fullName: "",
      homeCountryIso2: "",
      primaryLanguage: "",
      primaryLanguageOther: "",
      bloodType: "unknown",
      bloodTypeOther: "",
      allergies: [],
      allergiesOther: "",
      conditions: [],
      conditionsOther: "",
      medications: "",
      medicalNotes: "",
    };
  } catch {
    return {
      version: 2,
      fullName: "",
      homeCountryIso2: "",
      primaryLanguage: "",
      primaryLanguageOther: "",
      bloodType: "unknown",
      bloodTypeOther: "",
      allergies: [],
      allergiesOther: "",
      conditions: [],
      conditionsOther: "",
      medications: "",
      medicalNotes: "",
    };
  }
}

function saveInfoCard(info) {
  const payload = {
    version: 2,
    fullName: info.fullName || "",
    homeCountryIso2: info.homeCountryIso2 || "",
    primaryLanguage: info.primaryLanguage || "",
    primaryLanguageOther: info.primaryLanguageOther || "",
    bloodType: info.bloodType || "unknown",
    bloodTypeOther: info.bloodTypeOther || "",
    allergies: Array.isArray(info.allergies) ? info.allergies : [],
    allergiesOther: info.allergiesOther || "",
    conditions: Array.isArray(info.conditions) ? info.conditions : [],
    conditionsOther: info.conditionsOther || "",
    medications: info.medications || "",
    medicalNotes: info.medicalNotes || "",
  };

  localStorage.setItem(INFO_CARD_STORAGE_KEY, JSON.stringify(payload));
}

function saveEmergencyContacts(contacts) {
  // Future auth: keep versioned object so you can migrate and sync later.
  const payload = {
    version: 1,
    contacts,
    // Future: you can add `syncedAt`, `source`, etc. without breaking shape
  };
  localStorage.setItem(EMERGENCY_CONTACTS_STORAGE_KEY, JSON.stringify(payload));
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
    window.location.assign(telHref);
  }
}

function EmergencyContacts({ contacts, setContacts }) {
  const [adding, setAdding] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const phoneHref = safeTelHref(phone);

  function resetForm() {
    setName("");
    setPhone("");
    setRelationship("");
  }

  function addContact() {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanRel = relationship.trim();

    if (!cleanName) return;
    if (!safeTelHref(cleanPhone)) return;

    const next = [
      ...contacts,
      {
        id: makeId(),
        name: cleanName,
        phone: cleanPhone,
        relationship: cleanRel || "",
        createdAt: new Date().toISOString(),
      },
    ];

    setContacts(next);
    resetForm();
    setAdding(false);
  }

  function removeContact(id) {
    const c = contacts.find((x) => x.id === id);
    const label = c
      ? `${c.name}${c.relationship ? ` (${c.relationship})` : ""}`
      : "this contact";
    const ok = window.confirm(`Remove emergency contact: ${label}?`);
    if (!ok) return;

    setContacts((prev) => prev.filter((x) => x.id !== id));
  }

  function callContact(c) {
    const href = safeTelHref(c.phone);
    if (!href) return;

    const label = `${c.name}${c.relationship ? ` (${c.relationship})` : ""}`;
    const ok = window.confirm(`Call ${label}: ${c.phone}?`);
    if (!ok) return;

    window.location.assign(href);
  }

  const count = contacts?.length || 0;

  return (
    <section className="rounded-3xl bg-white border border-slate-200/70 shadow-sm">
      <details className="group">
        <summary className="cursor-pointer select-none focus:outline-none px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">
                Emergency contacts
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                People you trust (stored on this device).
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {count} {count === 1 ? "saved" : "saved"}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                View
              </span>
            </div>
          </div>
        </summary>

        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          {/* Empty state */}
          {count === 0 && !adding && (
            <div className="mt-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                No contacts yet
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Add someone responders can call if needed.
              </p>

              <button
                type="button"
                onClick={() => setAdding(true)}
                className="mt-3 w-full rounded-2xl bg-slate-900 text-white px-3 py-2.5 text-sm font-semibold hover:opacity-90
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
              >
                Add a contact
              </button>
            </div>
          )}

          {/* List */}
          {count > 0 && (
            <ul className="mt-2 space-y-2">
              {contacts.map((c) => {
                const href = safeTelHref(c.phone);
                const disabled = !href;

                return (
                  <li
                    key={c.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {c.name}
                        </div>

                        <div className="mt-1 text-sm text-slate-700">
                          {c.phone}
                        </div>

                        {c.relationship ? (
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {c.relationship}
                          </div>
                        ) : null}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => callContact(c)}
                          disabled={disabled}
                          className={[
                            "rounded-full px-3 py-1.5 text-xs font-semibold",
                            disabled
                              ? "border border-slate-200 bg-white text-slate-400"
                              : "bg-slate-900 text-white hover:opacity-90",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20",
                          ].join(" ")}
                        >
                          Call
                        </button>

                        <button
                          type="button"
                          onClick={() => removeContact(c.id)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100
                                     focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Add form trigger */}
          {!adding && count > 0 && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold hover:bg-slate-50
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
            >
              Add another contact
            </button>
          )}

          {/* Add form */}
          {adding && (
            <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jones"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Relationship (optional)
                  </label>
                  <input
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Partner, Parent"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Phone number *
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +44 7..."
                    inputMode="tel"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                  {!phone.trim() ? null : !phoneHref ? (
                    <p className="mt-1 text-[11px] text-red-600">
                      Please enter a valid phone number.
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Looks good.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addContact}
                  disabled={!name.trim() || !safeTelHref(phone)}
                  className={[
                    "flex-1 rounded-2xl px-3 py-2.5 text-sm font-semibold",
                    !name.trim() || !safeTelHref(phone)
                      ? "border border-slate-200 bg-slate-50 text-slate-400"
                      : "bg-slate-900 text-white hover:opacity-90",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20",
                  ].join(" ")}
                >
                  Save contact
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setAdding(false);
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold hover:bg-slate-50
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                >
                  Cancel
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Stored on this device.
              </p>
            </div>
          )}
        </div>
      </details>
    </section>
  );
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

function EmergencyInfoCard({ countries, emergencyContacts, mode = "normal" }) {
  const [info, setInfo] = useState(() => loadInfoCard());
  const [fullScreen, setFullScreen] = useState(false);

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Arabic",
    "Hindi",
    "Portuguese",
    "Mandarin",
    "Japanese",
    "Korean",
    "Other",
  ];

  const bloodTypeOptions = [
    { value: "unknown", label: "Unknown" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "other", label: "Other" },
  ];

  const allergyOptions = [
    { key: "penicillin", label: "Penicillin" },
    { key: "latex", label: "Latex" },
    { key: "nuts", label: "Nuts" },
    { key: "shellfish", label: "Shellfish" },
    { key: "bee", label: "Bee stings" },
    { key: "contrast", label: "Contrast dye" },
    { key: "other", label: "Other" },
  ];

  const conditionOptions = [
    { key: "asthma", label: "Asthma" },
    { key: "diabetes", label: "Diabetes" },
    { key: "epilepsy", label: "Epilepsy / seizures" },
    { key: "heart", label: "Heart condition" },
    { key: "bloodThinners", label: "On blood thinners" },
    { key: "pregnant", label: "Pregnant" },
    { key: "other", label: "Other" },
  ];

  function toggleInArray(arr, key) {
    const set = new Set(Array.isArray(arr) ? arr : []);
    if (set.has(key)) set.delete(key);
    else set.add(key);
    return Array.from(set);
  }

  function joinLabels(keys, options) {
    const map = new Map(options.map((o) => [o.key, o.label]));
    return (keys || [])
      .map((k) => map.get(k))
      .filter(Boolean)
      .join(", ");
  }

  const homeCountry =
    info.homeCountryIso2 && Array.isArray(countries)
      ? countries.find((c) => c.iso2 === info.homeCountryIso2)
      : null;

  useEffect(() => {
    saveInfoCard(info);
  }, [info]);

  function buildShareText() {
    const lines = [];

    lines.push("Emergency info");

    if (info.fullName.trim()) lines.push(`Name: ${info.fullName.trim()}`);

    if (homeCountry) lines.push(`Home country: ${homeCountry.name}`);
    else if (info.homeCountryIso2.trim())
      lines.push(`Home country: ${info.homeCountryIso2.trim()}`);

    // Language
    const lang =
      info.primaryLanguage === "Other"
        ? info.primaryLanguageOther?.trim()
        : info.primaryLanguage?.trim();
    if (lang) lines.push(`Language: ${lang}`);

    // Medical
    const blood =
      info.bloodType === "other"
        ? info.bloodTypeOther?.trim()
        : info.bloodType === "unknown"
          ? ""
          : info.bloodType;
    if (blood) lines.push(`Blood type: ${blood}`);

    const allergies = joinLabels(info.allergies, allergyOptions);
    if (allergies || info.allergiesOther?.trim()) {
      const other = info.allergies?.includes("other")
        ? info.allergiesOther?.trim()
        : "";
      lines.push(
        `Allergies: ${[allergies, other].filter(Boolean).join(allergies && other ? ", " : "")}`,
      );
    }

    const conditions = joinLabels(info.conditions, conditionOptions);
    if (conditions || info.conditionsOther?.trim()) {
      const other = info.conditions?.includes("other")
        ? info.conditionsOther?.trim()
        : "";
      lines.push(
        `Conditions: ${[conditions, other].filter(Boolean).join(conditions && other ? ", " : "")}`,
      );
    }

    if (info.medications?.trim())
      lines.push(`Medications: ${info.medications.trim()}`);

    if (emergencyContacts?.length) {
      lines.push("");
      lines.push("Emergency contacts:");
      for (const c of emergencyContacts) {
        const rel = c.relationship ? ` (${c.relationship})` : "";
        lines.push(`- ${c.name}${rel}: ${c.phone}`);
      }
    }

    if (info.medicalNotes.trim()) {
      lines.push("");
      lines.push("Additional notes:");
      lines.push(info.medicalNotes.trim());
    }

    lines.push("");
    lines.push("User-provided information. Verify when possible.");

    return lines.join("\n");
  }

  async function shareCard() {
    const text = buildShareText();

    try {
      if (navigator.share) {
        await navigator.share({ title: "Emergency info", text });
        return;
      }

      await navigator.clipboard.writeText(text);
      window.alert("Copied emergency info to clipboard.");
    } catch {
      window.prompt("Copy emergency info:", text);
    }
  }

  function clearAll() {
    const ok = window.confirm("Clear emergency info card details?");
    if (!ok) return;

    setInfo({
      version: 2,
      fullName: "",
      homeCountryIso2: "",
      primaryLanguage: "",
      primaryLanguageOther: "",
      bloodType: "unknown",
      bloodTypeOther: "",
      allergies: [],
      allergiesOther: "",
      conditions: [],
      conditionsOther: "",
      medications: "",
      medicalNotes: "",
    });
  }

  function renderCardBody(large) {
    const titleSize = large ? "text-2xl sm:text-3xl" : "text-sm";
    const valueSize = large ? "text-lg sm:text-xl" : "text-sm";
    const sectionTitle = large ? "text-base sm:text-lg" : "text-xs";
    const subtle = large ? "text-sm" : "text-[11px]";

    const lang =
      info.primaryLanguage === "Other"
        ? info.primaryLanguageOther?.trim()
        : info.primaryLanguage?.trim();

    const blood =
      info.bloodType === "other"
        ? info.bloodTypeOther?.trim()
        : info.bloodType === "unknown"
          ? ""
          : info.bloodType;

    const allergyLabels = joinLabels(info.allergies, allergyOptions);
    const allergyOther = info.allergies?.includes("other")
      ? info.allergiesOther?.trim()
      : "";
    const allergiesText = [allergyLabels, allergyOther]
      .filter(Boolean)
      .join(allergyLabels && allergyOther ? ", " : "");

    const conditionLabels = joinLabels(info.conditions, conditionOptions);
    const conditionOther = info.conditions?.includes("other")
      ? info.conditionsOther?.trim()
      : "";
    const conditionsText = [conditionLabels, conditionOther]
      .filter(Boolean)
      .join(conditionLabels && conditionOther ? ", " : "");

    const hasMedical =
      !!lang ||
      !!blood ||
      !!allergiesText ||
      !!conditionsText ||
      !!info.medications?.trim() ||
      !!info.medicalNotes?.trim();

    return (
      <div className="space-y-4">
        <div>
          <div
            className={`${titleSize} font-semibold tracking-tight text-slate-900`}
          >
            Emergency info
          </div>
          <div className={`mt-1 ${subtle} text-slate-500`}>
            User-provided information. Verify when possible.
          </div>
        </div>

        {(info.fullName.trim() ||
          homeCountry ||
          info.homeCountryIso2.trim()) && (
          <div className="space-y-2">
            <div className={`${sectionTitle} font-semibold text-slate-700`}>
              Personal
            </div>

            {info.fullName.trim() && (
              <div className={`${valueSize} text-slate-900`}>
                <span className="font-semibold">Name:</span>{" "}
                {info.fullName.trim()}
              </div>
            )}

            {(homeCountry || info.homeCountryIso2.trim()) && (
              <div className={`${valueSize} text-slate-900`}>
                <span className="font-semibold">Home country:</span>{" "}
                {homeCountry ? homeCountry.name : info.homeCountryIso2.trim()}
              </div>
            )}
          </div>
        )}

        {hasMedical && (
          <div className="space-y-2">
            <div className={`${sectionTitle} font-semibold text-slate-700`}>
              Medical
            </div>

            {lang && (
              <div className={`${valueSize} text-slate-900`}>
                <span className="font-semibold">Language:</span> {lang}
              </div>
            )}

            {blood && (
              <div className={`${valueSize} text-slate-900`}>
                <span className="font-semibold">Blood type:</span> {blood}
              </div>
            )}

            {allergiesText && (
              <div className={`${valueSize} text-slate-900`}>
                <span className="font-semibold">Allergies:</span>{" "}
                {allergiesText}
              </div>
            )}

            {conditionsText && (
              <div className={`${valueSize} text-slate-900`}>
                <span className="font-semibold">Conditions:</span>{" "}
                {conditionsText}
              </div>
            )}

            {info.medications?.trim() && (
              <div className={`${valueSize} text-slate-900`}>
                <span className="font-semibold">Medications:</span>{" "}
                {info.medications.trim()}
              </div>
            )}

            {info.medicalNotes?.trim() && (
              <div
                className={`${valueSize} text-slate-900 whitespace-pre-wrap`}
              >
                <span className="font-semibold">Notes:</span>{" "}
                {info.medicalNotes.trim()}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className={`${sectionTitle} font-semibold text-slate-700`}>
            Emergency Contacts
          </div>

          {!emergencyContacts?.length ? (
            <div className={`${valueSize} text-slate-600`}>None added yet.</div>
          ) : (
            <div className="space-y-2">
              {emergencyContacts.map((c) => {
                const rel = c.relationship ? ` • ${c.relationship}` : "";
                const tel = safeTelHref(c.phone);
                const disabled = !tel;

                return (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div
                          className={`${valueSize} font-semibold text-slate-900 truncate`}
                        >
                          {c.name}
                        </div>
                        <div className={`mt-0.5 ${subtle} text-slate-600`}>
                          {c.phone}
                          {rel}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => callEmergencyContact(c)}
                        disabled={disabled}
                        className={[
                          "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                          disabled
                            ? "border border-slate-200 bg-slate-50 text-slate-400"
                            : "bg-slate-900 text-white hover:opacity-90",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20",
                        ].join(" ")}
                      >
                        Call
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* {info.medicalNotes.trim() && (
          <div className="space-y-2">
            <div className={`${sectionTitle} font-semibold text-slate-700`}>
              Medical notes
            </div>
            <div
              className={[
                valueSize,
                "text-slate-900 whitespace-pre-wrap",
                large ? "leading-relaxed" : "",
              ].join(" ")}
            >
              {info.medicalNotes.trim()}
            </div>
          </div>
        )} */}
      </div>
    );
  }

  return (
    <section className="rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
      <details className="group">
        <summary className="cursor-pointer select-none focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Emergency info card
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Quick to show or share. Stored on this device.
              </div>
            </div>

            {/* Keep actions visible even when collapsed */}
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()} // don't toggle <details>
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setFullScreen(true)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-50"
              >
                Full screen
              </button>
              <button
                type="button"
                onClick={shareCard}
                className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold hover:opacity-90"
              >
                Share
              </button>
            </div>
          </div>
        </summary>

        {mode === "normal" && (
          <>
            {/* Editor */}
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {/* 1) Full name */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Full name (optional)
                  </label>
                  <input
                    value={info.fullName}
                    onChange={(e) =>
                      setInfo((x) => ({ ...x, fullName: e.target.value }))
                    }
                    placeholder="e.g. Alex Smith"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                </div>

                {/* 2) Home country */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Home country (optional)
                  </label>

                  {Array.isArray(countries) && countries.length ? (
                    <select
                      value={info.homeCountryIso2}
                      onChange={(e) =>
                        setInfo((x) => ({
                          ...x,
                          homeCountryIso2: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                    >
                      <option value="">—</option>
                      {countries.map((c) => (
                        <option key={c.iso2} value={c.iso2}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={info.homeCountryIso2}
                      onChange={(e) =>
                        setInfo((x) => ({
                          ...x,
                          homeCountryIso2: e.target.value,
                        }))
                      }
                      placeholder="e.g. GB"
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                    />
                  )}
                </div>

                {/* 3) Primary language */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Primary language (optional)
                  </label>

                  <div className="mt-1 grid gap-2 sm:grid-cols-2">
                    <select
                      value={info.primaryLanguage}
                      onChange={(e) =>
                        setInfo((x) => ({
                          ...x,
                          primaryLanguage: e.target.value,
                          primaryLanguageOther:
                            e.target.value === "Other"
                              ? x.primaryLanguageOther
                              : "",
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                    >
                      <option value="">—</option>
                      {languageOptions.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>

                    {info.primaryLanguage === "Other" && (
                      <input
                        value={info.primaryLanguageOther}
                        onChange={(e) =>
                          setInfo((x) => ({
                            ...x,
                            primaryLanguageOther: e.target.value,
                          }))
                        }
                        placeholder="Enter language"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                      />
                    )}
                  </div>
                </div>

                {/* Blood type */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Blood type (optional)
                  </label>

                  <div className="mt-1 grid gap-2 sm:grid-cols-2">
                    <select
                      value={info.bloodType}
                      onChange={(e) =>
                        setInfo((x) => ({
                          ...x,
                          bloodType: e.target.value,
                          bloodTypeOther:
                            e.target.value === "other" ? x.bloodTypeOther : "",
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                    >
                      {bloodTypeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>

                    {info.bloodType === "other" && (
                      <input
                        value={info.bloodTypeOther}
                        onChange={(e) =>
                          setInfo((x) => ({
                            ...x,
                            bloodTypeOther: e.target.value,
                          }))
                        }
                        placeholder="Enter blood type"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Only add this if you’re sure. Hospitals will still verify.
                  </p>
                </div>

                {/* 5) Allergies + Conditions */}
                <div className="sm:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Allergies */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700">
                        Allergies (optional)
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {allergyOptions.map((o) => {
                          const active = info.allergies?.includes(o.key);
                          return (
                            <button
                              key={o.key}
                              type="button"
                              onClick={() =>
                                setInfo((x) => ({
                                  ...x,
                                  allergies: toggleInArray(x.allergies, o.key),
                                  allergiesOther:
                                    o.key === "other" &&
                                    !x.allergies?.includes("other")
                                      ? x.allergiesOther
                                      : x.allergiesOther,
                                }))
                              }
                              className={[
                                "rounded-full px-3 py-1 text-xs font-semibold border transition",
                                active
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              {o.label}
                            </button>
                          );
                        })}
                      </div>

                      {info.allergies?.includes("other") && (
                        <input
                          value={info.allergiesOther}
                          onChange={(e) =>
                            setInfo((x) => ({
                              ...x,
                              allergiesOther: e.target.value,
                            }))
                          }
                          placeholder="Other allergy (e.g. kiwi)"
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                        />
                      )}
                    </div>

                    {/* Conditions */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700">
                        Medical conditions (optional)
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {conditionOptions.map((o) => {
                          const active = info.conditions?.includes(o.key);
                          return (
                            <button
                              key={o.key}
                              type="button"
                              onClick={() =>
                                setInfo((x) => ({
                                  ...x,
                                  conditions: toggleInArray(
                                    x.conditions,
                                    o.key,
                                  ),
                                }))
                              }
                              className={[
                                "rounded-full px-3 py-1 text-xs font-semibold border transition",
                                active
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              {o.label}
                            </button>
                          );
                        })}
                      </div>

                      {info.conditions?.includes("other") && (
                        <input
                          value={info.conditionsOther}
                          onChange={(e) =>
                            setInfo((x) => ({
                              ...x,
                              conditionsOther: e.target.value,
                            }))
                          }
                          placeholder="Other condition (e.g. kidney disease)"
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 6) Medications */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Current medications (optional)
                  </label>
                  <input
                    value={info.medications}
                    onChange={(e) =>
                      setInfo((x) => ({ ...x, medications: e.target.value }))
                    }
                    placeholder="e.g. insulin, warfarin"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Short list is best. Separate with commas.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Medical notes (optional)
                  </label>
                  <textarea
                    value={info.medicalNotes}
                    onChange={(e) =>
                      setInfo((x) => ({ ...x, medicalNotes: e.target.value }))
                    }
                    placeholder="Allergies, conditions, medications…"
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Keep it short. This is shown to others in emergencies.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearAll}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear card details
              </button>
            </div>
          </>
        )}

        {/* Preview */}
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          {renderCardBody(false)}
        </div>

        {/* Full screen */}
        {fullScreen && (
          <div className="fixed inset-0 z-[100] bg-white">
            <div className="mx-auto max-w-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setFullScreen(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={shareCard}
                  className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
                >
                  Share
                </button>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                {renderCardBody(true)}
              </div>

              <div className="mt-4 text-sm text-slate-500">
                Tip: Keep this screen open so someone else can read it.
              </div>
            </div>
          </div>
        )}
      </details>
    </section>
  );
}

function callEmergencyContact(c) {
  const href = safeTelHref(c?.phone);
  if (!href) return;

  const label = `${c.name}${c.relationship ? ` (${c.relationship})` : ""}`;
  const ok = window.confirm(`Call ${label}: ${c.phone}?`);
  if (!ok) return;

  window.location.assign(href);
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
  const [emergencyContacts, setEmergencyContacts] = useState(() =>
    loadEmergencyContacts(),
  );
  const [emergencyMode, setEmergencyMode] = useState(false);

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

  const emergencyCountry = useMemo(() => {
    // Prefer current in-memory selectedCountry if it matches the selectedIso2.
    if (selectedCountry?.iso2 === selectedIso2) return selectedCountry;

    // Otherwise pull directly from cache (instant, offline-safe)
    return loadCachedCountryDetails(selectedIso2);
  }, [selectedCountry, selectedIso2]);

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
    if (emergencyMode) return;
    fetchCountries();
  }, [emergencyMode]);

  useEffect(() => {
    if (emergencyMode) return;

    // Optional: if you want *zero* spinners/retries while offline even in normal mode:
    // if (isOffline) return;

    fetchCountryDetails(selectedIso2);
  }, [selectedIso2, emergencyMode /*, isOffline */]);

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

  useEffect(() => {
    saveEmergencyContacts(emergencyContacts);
  }, [emergencyContacts]);

  const services = useMemo(
    () => emergencyCountry?.services || {},
    [emergencyCountry],
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

  async function detectMyCountry() {
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

  function loadCachedCountryDetails(iso2) {
    const key = `${CACHE_COUNTRY_DETAILS_PREFIX}${iso2}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function EmergencyModeView({
    isOffline,
    selectedIso2,
    selectedCountry,
    services,
    iso2ToFlag,
    emergencyContacts,
    setEmergencyContacts,
    countries,
    onExit,
  }) {
    const countryLabel = selectedCountry?.name || selectedIso2 || "—";

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-8 pb-10">
          {/* Header */}
          <header className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Emergency Mode
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Using saved info on this device.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                {isOffline ? "Offline" : "Emergency-focused view"}
              </div>
            </div>

            <button
              type="button"
              onClick={onExit}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Back
            </button>
          </header>

          {/* If we have no cached country details */}
          {!selectedCountry && (
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">
                Emergency numbers
              </div>
              <p className="mt-2 text-sm text-slate-600">
                No saved emergency numbers for{" "}
                <span className="font-semibold">{countryLabel}</span> yet.
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                When you’re online, open a country once to save it for offline
                use.
              </p>
            </section>
          )}

          {/* Emergency numbers */}
          {selectedCountry && (
            <section className="mt-6 rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    Emergency numbers
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-lg leading-none">
                      {iso2ToFlag(selectedCountry.iso2 || selectedIso2)}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {selectedCountry.name || countryLabel}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      • Saved on this device
                    </span>
                  </div>
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
          )}

          {/* Emergency Contacts + Info card */}
          <div className="mt-4 space-y-4">
            <EmergencyContacts
              contacts={emergencyContacts}
              setContacts={setEmergencyContacts}
            />
            <EmergencyInfoCard
              mode="emergency"
              countries={countries}
              emergencyContacts={emergencyContacts}
            />
          </div>

          {/* Calm disclaimer */}
          <footer className="mt-6 rounded-3xl bg-white border border-slate-200/70 shadow-sm p-4 sm:p-5">
            <p className="text-sm font-semibold">Note</p>
            <p className="mt-1 text-sm text-slate-600">
              This view avoids network requests to stay stable during poor
              connectivity.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  if (emergencyMode) {
    return (
      <EmergencyModeView
        isOffline={isOffline}
        selectedIso2={selectedIso2}
        selectedCountry={emergencyCountry}
        services={services}
        iso2ToFlag={iso2ToFlag}
        emergencyContacts={emergencyContacts}
        setEmergencyContacts={setEmergencyContacts}
        countries={countries}
        onExit={() => setEmergencyMode(false)}
      />
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEmergencyMode(true)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold",
                "border border-slate-200 bg-white",
                "hover:bg-slate-50",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20",
              ].join(" ")}
            >
              Emergency Mode
            </button>
          </div>
        </header>

        {isOffline && !emergencyMode && (
          <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-sm text-amber-900">
              <span className="font-semibold">Offline.</span> Using saved info
              on this device.
            </div>
            <button
              type="button"
              onClick={() => setEmergencyMode(true)}
              className="shrink-0 rounded-full bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:opacity-90"
            >
              Open Emergency Mode
            </button>
          </div>
        )}

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
                detectingCountry={detectingCountry || isOffline}
                onUseMyLocation={() => {
                  if (isOffline) {
                    setAppError(
                      "Offline — location-based country detection needs internet.",
                    );
                    return;
                  }
                  detectMyCountry();
                }}
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

            <EmergencyContacts
              contacts={emergencyContacts}
              setContacts={setEmergencyContacts}
            />

            <EmergencyInfoCard
              mode="normal"
              countries={countries}
              emergencyContacts={emergencyContacts}
            />

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

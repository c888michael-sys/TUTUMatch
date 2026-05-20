"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/landing/icons";
import type { BrowseTutor } from "@/lib/browse-data";
import { DEFAULT_SCHOOL, OTHER_AREA_SCHOOL, type School } from "@/lib/schools";
import type { Weekday } from "@/lib/tutor-form";
import { Footer } from "@/components/landing/Footer";

type Mode = "ANY" | "IN_PERSON" | "ONLINE";
type SortBy = "OLDEST" | "SCORE_DESC";

// Subject category chips. Order is the order they render, per founder spec:
// math → english → physics (11-12) → chemistry (11-12) → biology (11-12) → science (k-10).
const SUBJECT_CATEGORIES = [
  {
    id: "math",
    label: "Math",
    match: (s: string) => /math/i.test(s),
  },
  {
    id: "english",
    label: "English",
    match: (s: string) => /english/i.test(s),
  },
  {
    id: "physics",
    label: "Physics (Y11-12)",
    match: (s: string) => /^physics$/i.test(s.trim()),
  },
  {
    id: "chemistry",
    label: "Chemistry (Y11-12)",
    match: (s: string) => /^chemistry$/i.test(s.trim()),
  },
  {
    id: "biology",
    label: "Biology (Y11-12)",
    match: (s: string) => /^biology$/i.test(s.trim()),
  },
  {
    id: "science_k10",
    // Tutors who offer any HSC science (Physics, Chemistry, Biology,
    // EES, Investigating Science) — usable for younger Y7-10 students too.
    label: "Science (K-10)",
    match: (s: string) =>
      /(physics|chemistry|biology|investigating science|earth and environmental science|science extension)/i.test(s),
  },
] as const;

const DAY_OPTIONS: { id: Weekday; label: string; full: string }[] = [
  { id: "MON", label: "Mon", full: "Monday" },
  { id: "TUE", label: "Tue", full: "Tuesday" },
  { id: "WED", label: "Wed", full: "Wednesday" },
  { id: "THU", label: "Thu", full: "Thursday" },
  { id: "FRI", label: "Fri", full: "Friday" },
  { id: "SAT", label: "Sat", full: "Saturday" },
  { id: "SUN", label: "Sun", full: "Sunday" },
];

// Convert a HSC band/mark string into a numeric score for sorting.
// B6 → 90, B5 → 80, … ; E4 → 90, E3 → 80, … ; "94" → 94 ; "94/100" → 94.
function parseScore(raw: string): number {
  const s = raw.trim().toUpperCase();
  // Plain number (or score-out-of)
  const num = s.match(/^(\d+(?:\.\d+)?)/);
  if (num) return parseFloat(num[1]);
  // Bands B1–B6
  const band = s.match(/^(?:BAND\s*)?B(\d)$/);
  if (band) {
    const n = parseInt(band[1], 10);
    if (n === 6) return 90;
    if (n === 5) return 80;
    if (n === 4) return 70;
    if (n === 3) return 60;
    if (n === 2) return 50;
    return 0;
  }
  // Extension bands E1–E4
  const ext = s.match(/^E(\d)$/);
  if (ext) {
    const n = parseInt(ext[1], 10);
    if (n === 4) return 90;
    if (n === 3) return 80;
    if (n === 2) return 70;
    return 50;
  }
  return 0;
}

function maxScore(t: BrowseTutor): number {
  return t.subjects.reduce((m, s) => Math.max(m, parseScore(s.b)), 0);
}

export function SchoolBrowse({
  school,
  tutors,
  realCount,
  schools,
}: {
  school: School;
  tutors: BrowseTutor[];
  realCount: number;
  schools: School[];
}) {
  const themeStyle: React.CSSProperties = {
    ["--brand" as string]: school.brand,
    ["--brand-deep" as string]: school.brandDeep,
    ["--brand-soft" as string]: school.brandSoft,
  };

  const showingAll = school.id === DEFAULT_SCHOOL.id;

  const [subjectCats, setSubjectCats] = useState<string[]>([]);
  const [days, setDays] = useState<Weekday[]>([]);
  const [minAtar, setMinAtar] = useState<number | "">("");
  const [maxRate, setMaxRate] = useState<number | "">("");
  const [mode, setMode] = useState<Mode>("ANY");
  const [sortBy, setSortBy] = useState<SortBy>("OLDEST");

  function toggleSubject(id: string) {
    setSubjectCats((cs) => (cs.includes(id) ? cs.filter((x) => x !== id) : [...cs, id]));
  }
  function toggleDay(d: Weekday) {
    setDays((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]));
  }

  const filtered = tutors.filter((t) => {
    // Subject category: pass if no chips ticked, otherwise must match at least one
    if (subjectCats.length > 0) {
      const ok = subjectCats.some((catId) => {
        const cat = SUBJECT_CATEGORIES.find((c) => c.id === catId);
        if (!cat) return false;
        return t.subjects.some((s) => cat.match(s.s));
      });
      if (!ok) return false;
    }
    // Availability: pass if no days picked, otherwise tutor must be available at least one of those days
    if (days.length > 0) {
      const overlap = days.some((d) => t.availableDays.includes(d));
      if (!overlap) return false;
    }
    if (minAtar !== "" && parseFloat(t.atar) < minAtar) return false;
    if (maxRate !== "" && t.rate > maxRate) return false;
    if (mode === "IN_PERSON" && !/In-?person/i.test(t.mode)) return false;
    if (mode === "ONLINE" && !/Online/i.test(t.mode)) return false;
    return true;
  });

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === "SCORE_DESC") {
      arr.sort((a, b) => maxScore(b) - maxScore(a));
    } else {
      arr.sort((a, b) => a.addedAt.localeCompare(b.addedAt));
    }
    return arr;
  }, [filtered, sortBy]);

  const tabs: { id: string; label: string; href: string }[] = [
    { id: DEFAULT_SCHOOL.id, label: "All tutors", href: "/browse" },
    ...schools
      .filter((s) => s.active)
      .map((s) => ({ id: s.id, label: s.short, href: `/schools/${s.id}` })),
    { id: OTHER_AREA_SCHOOL.id, label: OTHER_AREA_SCHOOL.short, href: `/schools/${OTHER_AREA_SCHOOL.id}` },
  ];

  return (
    <div data-school={school.id} style={themeStyle} className="browse-page">
      <section className="browse-hero">
        <div className="browse-hero-inner">
          <div className="browse-eyebrow">
            <span className="mark" />
            <span>TUTUMatch · {school.name}</span>
          </div>
          <h1 className="browse-title">
            {showingAll ? "Tutors across Sydney" : `Tutors near ${school.name}`}
          </h1>
          <p className="browse-sub">
            {school.tagline}. Browsing is free. You only pay once you&apos;ve picked a tutor — fully refunded if no
            lessons get agreed.
          </p>
        </div>
      </section>

      <nav className="browse-tabs" aria-label="Tutoring area">
        <div className="browse-tabs-inner">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className={`browse-tab ${t.id === school.id ? "active" : ""}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="browse-controls">
        <div className="browse-controls-inner">
          <div className="filter-block">
            <div className="filter-block-head">
              <span className="filter-block-label">Subject</span>
              {subjectCats.length > 0 && (
                <button type="button" className="link-like sm" onClick={() => setSubjectCats([])}>
                  Clear
                </button>
              )}
            </div>
            <div className="chips">
              {SUBJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`chip ${subjectCats.includes(cat.id) ? "active" : ""}`}
                  onClick={() => toggleSubject(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <div className="filter-block-head">
              <span className="filter-block-label">Days available</span>
              {days.length > 0 && (
                <button type="button" className="link-like sm" onClick={() => setDays([])}>
                  Clear
                </button>
              )}
            </div>
            <div className="chips">
              {DAY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`chip ${days.includes(d.id) ? "active" : ""}`}
                  onClick={() => toggleDay(d.id)}
                  aria-label={d.full}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {days.length > 0 && (
              <p className="filter-warning">
                Tutors must be available on at least one of those days. Filtering here can hide great tutors who&apos;d
                actually have time for you on a different day — try unticking some if results look thin.
              </p>
            )}
          </div>

          <div className="filter-row">
            <label className="filter">
              <span>Min ATAR</span>
              <input
                type="number"
                min={0}
                max={99.95}
                step={0.05}
                placeholder="any"
                value={minAtar}
                onChange={(e) => setMinAtar(e.target.value === "" ? "" : parseFloat(e.target.value))}
              />
            </label>
            <label className="filter">
              <span>Max $/hr</span>
              <input
                type="number"
                min={20}
                max={200}
                placeholder="any"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value === "" ? "" : parseFloat(e.target.value))}
              />
            </label>
            <fieldset className="filter mode-filter">
              <legend>Mode</legend>
              {(["ANY", "IN_PERSON", "ONLINE"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`chip ${mode === m ? "active" : ""}`}
                  onClick={() => setMode(m)}
                >
                  {m === "ANY" ? "Any" : m === "IN_PERSON" ? "In-person" : "Online"}
                </button>
              ))}
            </fieldset>
            <label className="filter">
              <span>Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
                <option value="OLDEST">Oldest profiles first</option>
                <option value="SCORE_DESC">Highest subject result</option>
              </select>
            </label>
          </div>

          <div className="browse-meta">
            {sorted.length} tutor{sorted.length === 1 ? "" : "s"} matching
            {realCount > 0 && (
              <span className="real-count">
                · <strong>{realCount}</strong> verified tutor{realCount === 1 ? "" : "s"} live
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="browse-grid-section">
        {sorted.length === 0 ? (
          <div className="browse-empty">
            No tutors match those filters yet. Try widening them, or{" "}
            <button
              type="button"
              className="link-like"
              onClick={() => {
                setSubjectCats([]); setDays([]); setMinAtar(""); setMaxRate(""); setMode("ANY");
              }}
            >
              clear all
            </button>
            .
          </div>
        ) : (
          <div className="tutor-grid">
            {sorted.map((t, i) => (
              <Link
                href={`/tutors/${t.routeId}`}
                key={`${t.routeId}-${i}`}
                className="tcard tcard-link"
              >
                {!t.isReal && <span className="example">Example</span>}
                <div className="top">
                  <div className="ph">{t.initials}</div>
                  <div>
                    <div className="name">{t.name}</div>
                    <div className="meta">
                      {t.suburb}
                      <span className="sep">·</span>
                      <span className="atar">ATAR {t.atar}</span>
                    </div>
                  </div>
                </div>
                <div className="subs">
                  {t.subjects.map((s, j) => (
                    <span className="sub" key={j}>
                      {s.s} <b>{s.b}</b>
                    </span>
                  ))}
                </div>
                <div className="mode">{t.mode}</div>
                <div className="card-days" aria-label="Available days">
                  {DAY_OPTIONS.map((d) => (
                    <span
                      key={d.id}
                      className={`day-pip ${t.availableDays.includes(d.id) ? "on" : "off"}`}
                      title={t.availableDays.includes(d.id) ? `Available ${d.full}` : `Not ${d.full}`}
                    >
                      {d.label[0]}
                    </span>
                  ))}
                </div>
                <div className="row">
                  <div className="rate">
                    ${t.rate}
                    <small>/hr</small>
                  </div>
                  <span className="view-profile">
                    View profile <ArrowIcon s={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

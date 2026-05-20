"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/landing/icons";
import { SAMPLE_TUTORS, type SampleTutor } from "@/lib/sample-tutors";
import { DEFAULT_SCHOOL, OTHER_AREA_SCHOOL, SCHOOLS, type School } from "@/lib/schools";
import { Footer } from "@/components/landing/Footer";

type Mode = "ANY" | "IN_PERSON" | "ONLINE";

export function SchoolBrowse({ school }: { school: School }) {
  const themeStyle: React.CSSProperties = {
    ["--brand" as string]: school.brand,
    ["--brand-deep" as string]: school.brandDeep,
    ["--brand-soft" as string]: school.brandSoft,
  };

  const showingAll = school.id === DEFAULT_SCHOOL.id;

  const [subject, setSubject] = useState("");
  const [minAtar, setMinAtar] = useState<number | "">("");
  const [maxRate, setMaxRate] = useState<number | "">("");
  const [mode, setMode] = useState<Mode>("ANY");

  const tutors = useMemo<SampleTutor[]>(() => {
    if (showingAll) {
      const seen = new Set<string>();
      const out: SampleTutor[] = [];
      for (const [k, list] of Object.entries(SAMPLE_TUTORS)) {
        if (k === "default") continue;
        for (const t of list) {
          if (seen.has(t.name)) continue;
          seen.add(t.name);
          out.push(t);
        }
      }
      return out;
    }
    // Filter by tutoring area
    return SAMPLE_TUTORS[school.id] ?? [];
  }, [showingAll, school.id]);

  const filtered = tutors.filter((t) => {
    if (subject.trim() && !t.subjects.some((s) => s.s.toLowerCase().includes(subject.trim().toLowerCase()))) return false;
    if (minAtar !== "" && parseFloat(t.atar) < minAtar) return false;
    if (maxRate !== "" && t.rate > maxRate) return false;
    if (mode === "IN_PERSON" && !/In-?person/i.test(t.mode)) return false;
    if (mode === "ONLINE" && !/Online/i.test(t.mode)) return false;
    return true;
  });

  const tabs: { id: string; label: string; href: string }[] = [
    { id: DEFAULT_SCHOOL.id, label: "All tutors", href: "/browse" },
    ...SCHOOLS.filter((s) => s.active).map((s) => ({
      id: s.id,
      label: s.short,
      href: `/schools/${s.id}`,
    })),
    { id: OTHER_AREA_SCHOOL.id, label: OTHER_AREA_SCHOOL.short, href: `/schools/${OTHER_AREA_SCHOOL.id}` },
  ];

  return (
    <div data-school={school.id} style={themeStyle} className="browse-page">
      <section className="browse-hero">
        <div className="browse-hero-inner">
          <div className="browse-eyebrow">
            <span className="mark" />
            <span>TutMatch · {school.name}</span>
          </div>
          <h1 className="browse-title">
            {showingAll ? "Tutors across NSW" : `Tutors near ${school.name}`}
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
          <div className="filter-row">
            <label className="filter">
              <span>Subject</span>
              <input
                type="text"
                placeholder="e.g. Physics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
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
          </div>
          <div className="browse-meta">
            {filtered.length} tutor{filtered.length === 1 ? "" : "s"} matching
          </div>
        </div>
      </section>

      <section className="browse-grid-section">
        {filtered.length === 0 ? (
          <div className="browse-empty">
            No tutors match those filters yet. Try widening them, or{" "}
            <button
              type="button"
              className="link-like"
              onClick={() => {
                setSubject(""); setMinAtar(""); setMaxRate(""); setMode("ANY");
              }}
            >
              clear all
            </button>
            .
          </div>
        ) : (
          <div className="tutor-grid">
            {filtered.map((t, i) => (
              <Link
                href={`/tutors/sample-${t.tutoringAreaSchoolId}-${SAMPLE_TUTORS[t.tutoringAreaSchoolId]?.indexOf(t) ?? i}`}
                key={`${t.name}-${i}`}
                className="tcard tcard-link"
              >
                <span className="example">Example</span>
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

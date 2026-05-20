"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/landing/icons";
import { SAMPLE_TUTORS, type SampleTutor } from "@/lib/sample-tutors";
import type { School } from "@/lib/schools";
import { Footer } from "@/components/landing/Footer";

type Mode = "ANY" | "IN_PERSON" | "ONLINE";

export function SchoolBrowse({ school }: { school: School }) {
  const themeStyle: React.CSSProperties = {
    ["--brand" as string]: school.brand,
    ["--brand-deep" as string]: school.brandDeep,
    ["--brand-soft" as string]: school.brandSoft,
  };

  const [scope, setScope] = useState<"SCHOOL" | "ALL">(school.id === "default" ? "ALL" : "SCHOOL");
  const [subject, setSubject] = useState("");
  const [minAtar, setMinAtar] = useState<number | "">("");
  const [maxRate, setMaxRate] = useState<number | "">("");
  const [mode, setMode] = useState<Mode>("ANY");

  const allTutors = useMemo(() => {
    if (scope === "SCHOOL") return SAMPLE_TUTORS[school.id] ?? [];
    // ALL: union across schools, de-duped by name
    const seen = new Set<string>();
    const out: (SampleTutor & { fromSchool: string })[] = [];
    for (const [k, list] of Object.entries(SAMPLE_TUTORS)) {
      if (k === "default") continue;
      for (const t of list) {
        if (seen.has(t.name)) continue;
        seen.add(t.name);
        out.push({ ...t, fromSchool: k });
      }
    }
    return out;
  }, [scope, school.id]);

  const filtered = allTutors.filter((t) => {
    if (subject.trim() && !t.subjects.some((s) => s.s.toLowerCase().includes(subject.trim().toLowerCase()))) return false;
    if (minAtar !== "" && parseFloat(t.atar) < minAtar) return false;
    if (maxRate !== "" && t.rate > maxRate) return false;
    if (mode === "IN_PERSON" && !/In-?person/i.test(t.mode)) return false;
    if (mode === "ONLINE" && !/Online/i.test(t.mode)) return false;
    return true;
  });

  return (
    <div data-school={school.id} style={themeStyle} className="browse-page">
      <section className="browse-hero">
        <div className="browse-hero-inner">
          <div className="browse-eyebrow">
            <span className="mark" />
            <span>TutMatch · {school.name}</span>
          </div>
          <h1 className="browse-title">
            Tutors{school.id === "default" ? "" : ` from ${school.name}`}
          </h1>
          <p className="browse-sub">
            {school.tagline}. Browse free. $20 unlocks a tutor&apos;s contact details and is refunded as their
            first-lesson discount.
          </p>
        </div>
      </section>

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
            {school.id !== "default" && (
              <fieldset className="filter mode-filter">
                <legend>Show</legend>
                <button
                  type="button"
                  className={`chip ${scope === "SCHOOL" ? "active" : ""}`}
                  onClick={() => setScope("SCHOOL")}
                >
                  From {school.short}
                </button>
                <button
                  type="button"
                  className={`chip ${scope === "ALL" ? "active" : ""}`}
                  onClick={() => setScope("ALL")}
                >
                  All tutors
                </button>
              </fieldset>
            )}
          </div>
          <div className="browse-meta">
            {filtered.length} tutor{filtered.length === 1 ? "" : "s"} matching
          </div>
        </div>
      </section>

      <section className="browse-grid-section">
        {filtered.length === 0 ? (
          <div className="browse-empty">
            No tutors match those filters. Try widening them, or{" "}
            <button type="button" className="link-like" onClick={() => { setSubject(""); setMinAtar(""); setMaxRate(""); setMode("ANY"); }}>
              clear all
            </button>
            .
          </div>
        ) : (
          <div className="tutor-grid">
            {filtered.map((t, i) => (
              <Link href={`/tutors/sample-${school.id}-${i}`} key={`${t.name}-${i}`} className="tcard tcard-link">
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

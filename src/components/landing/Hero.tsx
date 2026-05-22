"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "./icons";

export function Hero({ showFloats = true }: { showFloats?: boolean }) {
  const [lean, setLean] = useState<"left" | "right" | null>(null);
  const [engaged, setEngaged] = useState({ tutor: false, parent: false });
  const holdT = useRef<{ tutor: ReturnType<typeof setTimeout> | null; parent: ReturnType<typeof setTimeout> | null }>({
    tutor: null,
    parent: null,
  });
  const heroRef = useRef<HTMLElement | null>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const w = heroRef.current.clientWidth;
    const x = e.clientX;
    if (x < w * 0.46) setLean("left");
    else if (x > w * 0.54) setLean("right");
    else setLean(null);
  }, []);
  const onLeave = useCallback(() => setLean(null), []);

  const startHold = (side: "tutor" | "parent") => {
    if (holdT.current[side]) clearTimeout(holdT.current[side]!);
    holdT.current[side] = setTimeout(() => setEngaged((s) => ({ ...s, [side]: true })), 320);
  };
  const endHold = (side: "tutor" | "parent") => {
    if (holdT.current[side]) clearTimeout(holdT.current[side]!);
    setEngaged((s) => ({ ...s, [side]: false }));
  };

  return (
    <section
      className={`hero ${lean ? `lean-${lean}` : ""}`}
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="wordmark-center" aria-hidden="true">
        <span className="mark" />
        <span>TUTUMatch</span>
      </div>

      <Link
        className={`hero-half parent ${engaged.parent ? "engaged" : ""}`}
        href="/browse"
        onMouseEnter={() => startHold("parent")}
        onMouseLeave={() => endHold("parent")}
        aria-label="For parents — find a tutor"
      >
        <div className="hero-content">
          <div className="label">
            <span className="dot" />
            For parents
          </div>
          <h1>Find a local tutor. No platform fees.</h1>
          <p className="subhead">
            Browse, see contact details, message tutors directly. The platform takes nothing from you — not a signup, not a fee, not a cut of the lesson.
          </p>
          <div className="hero-cta-row">
            <span className="hero-cta">
              Browse tutors <ArrowIcon s={16} />
            </span>
            <span className="hero-data" style={{ color: "rgba(255,255,255,0.6)" }}>
              Free to browse · No account needed
            </span>
          </div>
          {showFloats && (
            <div className="hero-floats" aria-hidden="true">
              <div className="float-line">
                <span>Platform fee →</span>
                <span className="v">$0, always</span>
              </div>
              <div className="float-line">
                <span>Tutor sets the rate →</span>
                <span className="v">No middleman markup</span>
              </div>
              <div className="float-line">
                <span>Verify WWCC →</span>
                <span className="v">Direct with NSW OCG (free)</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <Link
        className={`hero-half tutor ${engaged.tutor ? "engaged" : ""}`}
        href="/tutor/signup"
        onMouseEnter={() => startHold("tutor")}
        onMouseLeave={() => endHold("tutor")}
        aria-label="For tutors — list for free"
      >
        <div className="hero-content">
          <div className="label">
            <span className="dot" />
            For tutors
          </div>
          <h1>List free. Pay only when you get a student.</h1>
          <p className="subhead">First match is on us. After that, $20 per student you actually take on. No per-lesson cut, ever.</p>
          <div className="hero-cta-row">
            <span className="hero-cta">
              List for free <ArrowIcon s={16} />
            </span>
            <span className="hero-data">
              First student free<span className="sep">·</span>You set the rate
            </span>
          </div>
          {showFloats && (
            <div className="hero-floats" aria-hidden="true">
              <div className="float-line">
                <span>Listing →</span>
                <span className="v">Free, forever</span>
              </div>
              <div className="float-line">
                <span>First confirmed student →</span>
                <span className="v">$0</span>
              </div>
              <div className="float-line">
                <span>Each student after that →</span>
                <span className="v">$20</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="divider" aria-hidden="true" />

      <div className="hero-foot">
        <span>NSW · est. 2026 · independent directory</span>
        <span>Scroll for how the match works ↓</span>
      </div>
    </section>
  );
}

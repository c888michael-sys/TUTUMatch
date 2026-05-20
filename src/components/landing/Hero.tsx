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
          <h1>Tutor without losing half your pay.</h1>
          <p className="subhead">Pay us $20 once per student. Keep everything else, forever.</p>
          <div className="hero-cta-row">
            <span className="hero-cta">
              List for free <ArrowIcon s={16} />
            </span>
            <span className="hero-data">
              0% commission<span className="sep">·</span>You set the rate
            </span>
          </div>
          {showFloats && (
            <div className="hero-floats" aria-hidden="true">
              <div className="float-line">
                <span>$50/hr lesson →</span>
                <span className="v">$50 in your pocket</span>
              </div>
              <div className="float-line">
                <span>Per-lesson cut →</span>
                <span className="v">0%</span>
              </div>
              <div className="float-line">
                <span>Platform fee →</span>
                <span className="v">$20, once, ever</span>
              </div>
            </div>
          )}
        </div>
      </Link>

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
          <h1>Pay the tutor, not a centre&apos;s markup.</h1>
          <p className="subhead">
            Tutoring centres mark lessons up 40–60%. We don&apos;t. You pay your tutor directly, at their rate.
          </p>
          <div className="hero-cta-row">
            <span className="hero-cta">
              Find a tutor <ArrowIcon s={16} />
            </span>
            <span className="hero-data" style={{ color: "rgba(255,255,255,0.6)" }}>
              $20 to unlock<span className="sep">·</span>$20 off first lesson
            </span>
          </div>
          {showFloats && (
            <div className="hero-floats" aria-hidden="true">
              <div className="float-line">
                <span>Centre markup →</span>
                <span className="v">40–60% per lesson</span>
              </div>
              <div className="float-line">
                <span>Our markup →</span>
                <span className="v">0% per lesson, forever</span>
              </div>
              <div className="float-line">
                <span>You front $20 →</span>
                <span className="v">Refunded on lesson 1</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="divider" aria-hidden="true" />

      <div className="hero-foot">
        <span>NSW · est. 2026 · independent marketplace</span>
        <span>Scroll for how the $20 actually works ↓</span>
      </div>
    </section>
  );
}

// TutMatch — split-screen landing with per-school recolouring
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brandName": "TutMatch",
  "schoolId": "killara",
  "framing": "transparent",
  "showFloats": true
}/*EDITMODE-END*/;

// ─────────────────────────── Icons (inline SVG) ───────────────────────────
const Arrow = ({ size = 18 }) => (
  <svg className="arr" width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const Lock = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="1.5"/>
    <path d="M8 11V8a4 4 0 018 0v3"/>
  </svg>
);
const TrustIcon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const Caret = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

// ─────────────────────────── Reveal-on-scroll ───────────────────────────
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─────────────────────────── Animated number ───────────────────────────
function CountUp({ to, suffix = "", duration = 1100, decimals = 0 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduce) { setN(to); return; }
          const t0 = performance.now();
          const tick = (t) => {
            const k = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - k, 3);
            setN(to * eased);
            if (k < 1) requestAnimationFrame(tick);
            else setN(to);
          };
          requestAnimationFrame(tick);
        }
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{n.toFixed(decimals)}{suffix}</span>;
}

// ─────────────────────────── Hero ───────────────────────────
function Hero({ school, brand, showFloats, onCTA }) {
  const [lean, setLean] = useState(null); // 'left' | 'right' | null
  const [engaged, setEngaged] = useState({ tutor: false, parent: false });
  const holdT = useRef({ tutor: null, parent: null });
  const heroRef = useRef(null);

  const cssVars = {
    "--tutor-bg": school.tutorBg,
    "--tutor-bg-2": school.tutorBg2,
    "--tutor-ink": school.tutorInk,
    "--tutor-accent": school.tutorAccent,
    "--parent-bg": school.parentBg,
    "--parent-bg-2": school.parentBg2,
    "--parent-ink": school.parentInk,
    "--parent-accent": school.parentAccent,
  };

  const onMove = useCallback((e) => {
    if (!heroRef.current) return;
    const w = heroRef.current.clientWidth;
    const x = e.clientX;
    if (x < w * 0.45) setLean("left");
    else if (x > w * 0.55) setLean("right");
    else setLean(null);

    // local mouse coords for radial highlight on each half
    const halves = heroRef.current.querySelectorAll(".hero-half");
    halves.forEach(h => {
      const r = h.getBoundingClientRect();
      h.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      h.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  }, []);

  const onLeave = useCallback(() => setLean(null), []);

  const startHold = (side) => {
    clearTimeout(holdT.current[side]);
    holdT.current[side] = setTimeout(() => {
      setEngaged(s => ({ ...s, [side]: true }));
    }, 380);
  };
  const endHold = (side) => {
    clearTimeout(holdT.current[side]);
    setEngaged(s => ({ ...s, [side]: false }));
  };

  return (
    <section className={`hero ${lean ? `lean-${lean}` : ""}`}
             ref={heroRef}
             onMouseMove={onMove}
             onMouseLeave={onLeave}
             style={cssVars}>

      <div className="wordmark-center" aria-hidden="true">
        <span className="glyph">t</span>
        <span>{brand}</span>
      </div>

      <a className={`hero-half tutor ${engaged.tutor ? "engaged" : ""}`}
         href="#tutor-how"
         onClick={(e) => { e.preventDefault(); onCTA("tutor"); }}
         onMouseEnter={() => startHold("tutor")}
         onMouseLeave={() => endHold("tutor")}
         aria-label="For tutors — list for free">
        <div className="floats" aria-hidden="true">
          {showFloats && <>
            <span className="float-chip f1">"$50/hr — yours, every hour"</span>
            <span className="float-chip f2">"One $20 commission, ever"</span>
            <span className="float-chip f3">"Set your own hours"</span>
          </>}
        </div>
        <div className="hero-content">
          <div className="eyebrow"><span className="dot"></span>For tutors</div>
          <h1>Tutor without <em>losing half</em> your pay.</h1>
          <p className="subhead">
            Pay us $20 once per student. Keep everything else, forever.
            No per-lesson cut. No centre taking 40–60% of every hour you teach.
          </p>
          <span className="hero-cta">
            List for free <Arrow />
          </span>
          <div className="hero-meta">
            <span>Sign-up takes 6 min</span>
            <span className="dot"></span>
            <span>WWCC + ID verified</span>
          </div>
        </div>
      </a>

      <a className={`hero-half parent ${engaged.parent ? "engaged" : ""}`}
         href="#parent-how"
         onClick={(e) => { e.preventDefault(); onCTA("parent"); }}
         onMouseEnter={() => startHold("parent")}
         onMouseLeave={() => endHold("parent")}
         aria-label="For parents — find a tutor">
        <div className="floats" aria-hidden="true">
          {showFloats && <>
            <span className="float-chip f1">"Pay tutors directly"</span>
            <span className="float-chip f2">"No centre markup"</span>
            <span className="float-chip f3">"$20 fronted, $20 back"</span>
          </>}
        </div>
        <div className="hero-content">
          <div className="eyebrow"><span className="dot"></span>For parents{school.id !== "all" ? ` · ${school.short}` : ""}</div>
          <h1>Pay the tutor, <em>not a centre's</em> markup.</h1>
          <p className="subhead">
            Tutoring centres mark lessons up 40–60%. We don't. You pay your
            tutor directly, at their rate — after a one-time $20 unlock
            that comes back as a first-lesson discount.
          </p>
          <span className="hero-cta">
            Find a tutor <Arrow />
          </span>
          <div className="hero-meta">
            <span>Browse free</span>
            <span className="dot"></span>
            <span>5-day refund guarantee</span>
          </div>
        </div>
      </a>

      <div className="divider" aria-hidden="true"></div>

      <div className="hero-foot">
        <span className="l">NSW · est. 2026 · independent marketplace</span>
        <span className="r">Scroll for how the $20 actually works ↓</span>
      </div>
    </section>
  );
}

// ─────────────────────────── School picker bar ───────────────────────────
function SchoolBar({ schoolId, onChange }) {
  const school = SCHOOLS.find(s => s.id === schoolId) || SCHOOLS[0];
  return (
    <div className="schoolbar reveal">
      <div className="container schoolbar-inner">
        <div className="schoolbar-l">
          <span className="sb-label">Currently showing tutors for</span>
          <span className="sb-school" style={{ color: school.tutorAccent }}>
            <span className="sb-dot" style={{ background: school.tutorAccent }}></span>
            {school.name}
          </span>
          <span className="sb-tag">{school.tagline}</span>
        </div>
        <div className="schoolbar-r">
          <span className="sb-switch-lbl">Switch school:</span>
          <div className="sb-chips" role="tablist">
            {SCHOOLS.map(s => (
              <button key={s.id}
                      role="tab"
                      aria-selected={s.id === schoolId}
                      className={`sb-chip ${s.id === schoolId ? "active" : ""}`}
                      style={s.id === schoolId ? {
                        background: s.tutorAccent,
                        color: s.tutorBg,
                        borderColor: s.tutorAccent,
                      } : undefined}
                      onClick={() => onChange(s.id)}>
                {s.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Mechanic (the $20) ───────────────────────────
function Mechanic({ framing }) {
  return (
    <section className="section-pad mechanic" id="how-20-works">
      <div className="container">
        <div className="label reveal">How the $20 actually works</div>
        <h2 className="h2 reveal d1">
          One <em>flat $20</em> per match. Then we get out of your way —
          forever.
        </h2>
        <p className="lede reveal d2">
          {framing === "transparent"
            ? "The $20 is the tutor's commission to us. We collect it through the parent as an escrow so tutors can't take the introduction and disappear. The first lesson is discounted by $20 to reimburse the parent. Net cost to the parent: $0."
            : "$20 unlocks the tutor's contact details. The tutor takes $20 off your first lesson, so it costs you nothing."}
        </p>

        <div className="mechanic-grid reveal d2">
          <div className="step">
            <div className="n">01</div>
            <h3>Parent unlocks the tutor</h3>
            <p>Pay $20 to reveal the tutor's name, mobile and email. We hold the funds until your first lesson is done.</p>
            <div className="figure">[ unlock-modal mockup ]</div>
          </div>
          <div className="step">
            <div className="n">02</div>
            <h3>Tutor discounts your first lesson by $20</h3>
            <p>Built into the tutor's onboarding — they apply it to the first invoice. We release the funds to the tutor as their commission.</p>
            <div className="figure">[ first-lesson invoice ]</div>
          </div>
          <div className="step">
            <div className="n">03</div>
            <h3>Deal directly, forever after</h3>
            <p>Tutor sets the rate. Parent pays the tutor. No further fees, no per-lesson cut, no platform between you. Ever.</p>
            <div className="figure">[ direct payment screen ]</div>
          </div>
        </div>

        {framing === "transparent" && (
          <div className="honesty reveal d3">
            <div className="tag">Plainly:</div>
            <p>
              The $20 is the <b style={{ color: "var(--tutor-accent)" }}>tutor's commission to us</b>, but we collect
              it through the parent so tutors can't take an introduction and disappear. The first-lesson
              discount is how the tutor pays us back. <b style={{ color: "var(--tutor-accent)" }}>Net cost to the parent: $0.</b>
            </p>
          </div>
        )}

        <div className="receipt reveal d3" style={{ maxWidth: 520 }}>
          <div className="row muted"><span>Unlock — Priya R.</span><span>$20.00</span></div>
          <div className="row muted"><span>First lesson · 1hr @ $70</span><span>$70.00</span></div>
          <div className="row"><span>Tutor's first-lesson discount</span><span className="neg">−$20.00</span></div>
          <div className="row total"><span>Parent pays the tutor</span><span>$50.00</span></div>
          <div className="row" style={{ marginTop: 10 }}><span>Parent out of pocket vs. centre</span><span className="pos">$0 extra</span></div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── How it works mirrored ───────────────────────────
function HowMirrored({ school }) {
  return (
    <section className="section-pad how" id="how-mirrored"
             style={{ "--tutor-accent": school.tutorAccent, "--parent-accent": school.parentAccent,
                      "--tutor-bg": school.tutorBg, "--parent-bg": school.parentBg,
                      "--tutor-ink": school.tutorInk, "--parent-ink": school.parentInk }}>
      <div className="container">
        <div className="label reveal">How it works</div>
        <h2 className="h2 reveal d1">Same flat fee, two sides of the table.</h2>
        <p className="lede reveal d2">Tutor on the left, parent on the right — mirrored steps, same single $20 in the middle. After that, you talk to each other.</p>

        <div className="how-grid reveal d2">
          <div className="how-col tutor-col" id="tutor-how">
            <div className="role">For tutors</div>
            <div className="ctitle">List, get unlocked, keep teaching.</div>
            <ol>
              <li><b>List for free.</b> Profile, subjects, hourly rate, suburbs you'll travel to.</li>
              <li><b>Get verified.</b> WWCC, photo ID, HSC/ATAR scans — we review by hand within 48 hours.</li>
              <li><b>A parent unlocks you.</b> The platform's flat <b>$20 commission</b> is collected from them at this moment, held for you.</li>
              <li><b>Discount their first lesson by $20.</b> Your invoicing tool prompts this automatically. The held $20 is then released to us as our cut.</li>
              <li><b>Keep 100% of every lesson, forever.</b> No per-hour platform cut. Set your rate. Raise it whenever.</li>
            </ol>
          </div>
          <div className="how-col parent-col" id="parent-how">
            <div className="role">For parents</div>
            <div className="ctitle">Browse, unlock, deal directly.</div>
            <ol>
              <li><b>Browse free.</b> Filter by subject, suburb, ATAR, in-person vs. online.</li>
              <li><b>Pick your tutor.</b> Open as many profiles as you like, message them through the platform first.</li>
              <li><b>Pay $20 to unlock.</b> That reveals their contact details. We hold the funds.</li>
              <li><b>Get $20 off your first lesson.</b> The tutor applies the discount; net cost to you is zero.</li>
              <li><b>Deal directly from there.</b> No further platform fees, no per-lesson cut, ever. If you want to find another tutor next term, unlock another.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Comparison ───────────────────────────
function Comparison({ brand }) {
  return (
    <section className="section-pad compare">
      <div className="container">
        <div className="label reveal">The honest comparison</div>
        <h2 className="h2 reveal d1">Centres take a cut <em>every lesson</em>. We take $20, <em>once</em>.</h2>
        <p className="lede reveal d2">No spin. Here's exactly how the two models stack up.</p>

        <div className="compare-table reveal d2">
          <div className="compare-row head">
            <div className="label-cell">What you're paying for</div>
            <div className="centre">Tutoring centres</div>
            <div className="us">{brand}</div>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div className="compare-row" key={i}>
              <div className="label-cell">{row.label}</div>
              <div className="centre"><span className="x">×</span>{row.centre}</div>
              <div className="us"><span className="v">✓</span>{row.us}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Trust & safety ───────────────────────────
function Trust({ school }) {
  return (
    <section className="section-pad trust"
             style={{ "--tutor-accent": school.tutorAccent }}>
      <div className="container">
        <div className="label reveal">Trust & safety</div>
        <h2 className="h2 reveal d1">We check, so you don't have to take their word for it.</h2>
        <p className="lede reveal d2">Every tutor on the platform clears the same six checks before they're listed. No exceptions for "high ATAR" tutors. No exceptions for the founder's mate.</p>
        <div className="trust-grid reveal d2">
          {TRUST.map((t, i) => (
            <div className="trust-cell" key={i}>
              <div className="ico"><TrustIcon d={t.p} /></div>
              <h3>{t.t}</h3>
              <p>{t.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── 5-day guarantee ───────────────────────────
function Guarantee() {
  return (
    <section className="guarantee">
      <div className="guarantee-card reveal">
        <div className="badge">5<small>day refund</small></div>
        <div className="body">
          <h3>If your unlocked tutor doesn't respond within 5 days, your $20 is refunded automatically.</h3>
          <p>No tickets, no chase. We watch the clock for you. This is the parent's protection on the front-loaded payment — it's the whole reason the $20 sits in escrow before going to the tutor.</p>
        </div>
        <div className="badge" style={{ background: "transparent", color: "oklch(0.4 0.15 145)", border: "0.5px solid oklch(0.55 0.15 145)" }}>
          $20<small>auto-back</small>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Sample tutor cards ───────────────────────────
function TutorCards({ school }) {
  const tutors = SAMPLE_TUTORS[school.id] || SAMPLE_TUTORS.killara;
  return (
    <section className="section-pad tutors"
             style={{ "--tutor-accent": school.tutorAccent }}>
      <div className="container">
        <div className="label reveal">Sample listings</div>
        <h2 className="h2 reveal d1">What you'll see when you browse.</h2>
        <p className="lede reveal d2">Example tutors for {school.name}. Real listings show first name + last initial, photo, suburb, verified ATAR, HSC subjects with band results, and the tutor's hourly rate. Contact details are masked until unlock.</p>
        <div className="tutor-grid reveal d2">
          {tutors.map((t, i) => (
            <div className="tcard" key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <span className="example">Example</span>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div className="ph">{t.initials}</div>
                <div>
                  <h4>{t.name}</h4>
                  <div className="meta">
                    <span>{t.suburb}</span>
                    <span className="dot"></span>
                    <span className="atar">ATAR {t.atar}</span>
                  </div>
                </div>
              </div>
              <div className="subs">
                {t.subjects.map((s, j) => (
                  <span className="sub" key={j}>{s.s} <b>{s.b}</b></span>
                ))}
              </div>
              <div className="mode">{t.mode}</div>
              <div className="row">
                <div className="rate">${t.rate}<small> /hr</small></div>
                <button className="unlock"><Lock /> Unlock — $20</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Tutor earnings contrast ───────────────────────────
function Earnings() {
  return (
    <section className="section-pad earnings">
      <div className="container">
        <div className="label reveal">For tutors · what you actually keep</div>
        <h2 className="h2 reveal d1">A $50 lesson is a <em>$50 lesson</em>.</h2>
        <p className="lede reveal d2">Same hour, same student, same effort. The number you bill is the number you bank — minus a single $20 that vanishes after the first lesson, forever.</p>
        <div className="earn-grid reveal d2">
          <div className="earn-card">
            <div className="tag">At a centre</div>
            <div className="big">$20–$30 <em>/hr</em></div>
            <p className="copy">A $50/hr lesson lands you somewhere between $20 and $30 in your pocket. Every single lesson. For the entire student relationship. Forever.</p>
            <div className="term">Over a 10-week term @ 1hr/wk: net <b>≈ $250</b></div>
          </div>
          <div className="earn-card us">
            <div className="tag">On {TWEAK_DEFAULTS.brandName /* live brand pulled in App */}</div>
            <div className="big">$50 <em>/hr</em></div>
            <p className="copy">A $50/hr lesson lands you $50 in your pocket. Forever. After a one-time $20 commission to us when the parent first unlocks you.</p>
            <div className="term">Over a 10-week term @ 1hr/wk: net <b>$480</b> (lesson 1: $30; lessons 2–10: $50)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── FAQ ───────────────────────────
function FAQ() {
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(0);
  const filtered = useMemo(
    () => tab === "all" ? FAQS : FAQS.filter(f => f.tag === tab),
    [tab]
  );
  return (
    <section className="section-pad faq">
      <div className="container">
        <div className="label reveal">Frequently asked</div>
        <h2 className="h2 reveal d1">Awkward questions, plain answers.</h2>

        <div className="faq-tabs reveal d2" role="tablist">
          {[
            { id: "all", l: "All" },
            { id: "parents", l: "For parents" },
            { id: "tutors", l: "For tutors" },
          ].map(t => (
            <button key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    className={`faq-tab ${tab === t.id ? "active" : ""}`}
                    onClick={() => { setTab(t.id); setOpen(-1); }}>
              {t.l}
            </button>
          ))}
        </div>

        <div className="faq-list reveal d2">
          {filtered.map((f, i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={`${tab}-${i}`}>
              <button className="faq-q"
                      onClick={() => setOpen(open === i ? -1 : i)}
                      aria-expanded={open === i}>
                <div className="qrow">
                  <span className="tag">{f.tag === "parents" ? "For parents" : "For tutors"}</span>
                  <span>{f.q}</span>
                </div>
                <span className="plus" aria-hidden="true"></span>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Pitch line ───────────────────────────
function PitchLine() {
  return (
    <section className="pitch reveal">
      <p>
        Tutoring centres take <span className="num"><CountUp to={40} suffix="" />–<CountUp to={60} suffix="%" /></span> of every lesson, forever.
        <br/>We take <span className="accent-num">$<CountUp to={20} /></span>, once.
      </p>
      <p className="footnote">A flat $20 per student match. No per-lesson cut, no monthly fee, no upcharge on the tutor's rate.</p>
    </section>
  );
}

// ─────────────────────────── Final CTA + footer ───────────────────────────
function FinalCTA({ school, brand, onCTA }) {
  return (
    <section className="final"
             style={{ "--tutor-accent": school.tutorAccent, "--parent-accent": school.parentAccent,
                      "--tutor-bg": school.tutorBg, "--parent-bg": school.parentBg,
                      "--tutor-ink": school.tutorInk, "--parent-ink": school.parentInk }}>
      <div className="final-half tutor">
        <div className="eyebrow" style={{ color: school.tutorAccent }}>
          <span className="dot"></span>For tutors
        </div>
        <h2>Keep what you earn. Start in six minutes.</h2>
        <a className="arr-link" href="#" onClick={(e) => { e.preventDefault(); onCTA("tutor"); }}>
          Start tutoring <Arrow size={22} />
        </a>
      </div>
      <div className="final-half parent">
        <div className="eyebrow" style={{ color: school.parentAccent }}>
          <span className="dot"></span>For parents
        </div>
        <h2>Find a tutor at {school.name}.</h2>
        <a className="arr-link" href="#" onClick={(e) => { e.preventDefault(); onCTA("parent"); }}>
          Find a tutor <Arrow size={22} />
        </a>
      </div>
    </section>
  );
}

function Footer({ brand }) {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <div className="foot-brand">{brand}</div>
          <p className="foot-blurb">A flat-fee NSW tutor marketplace. No per-lesson cut, ever. Tutors and parents deal directly.</p>
        </div>
        <div>
          <h5>For parents</h5>
          <ul>
            <li><a href="#">Browse tutors</a></li>
            <li><a href="#">How it works</a></li>
            <li><a href="#">5-day guarantee</a></li>
            <li><a href="#">Schools</a></li>
          </ul>
        </div>
        <div>
          <h5>For tutors</h5>
          <ul>
            <li><a href="#">List for free</a></li>
            <li><a href="#">Verification</a></li>
            <li><a href="#">Payment & GST</a></li>
            <li><a href="#">Tutor handbook</a></li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Child Safety Policy</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>ABN 00 000 000 000 · Made in NSW · © 2026 {brand}</span>
        <span>Instagram · TikTok · LinkedIn</span>
      </div>
    </footer>
  );
}

// ─────────────────────────── Sticky bar ───────────────────────────
function StickyBar({ brand, show, onCTA }) {
  return (
    <header className={`stickybar ${show ? "show" : ""}`}>
      <div className="wordmark">{brand}</div>
      <div className="ctas">
        <button className="pill ghost" onClick={() => onCTA("how")}>How it works</button>
        <button className="pill tutor" onClick={() => onCTA("tutor")}>List for free</button>
        <button className="pill parent" onClick={() => onCTA("parent")}>Find a tutor</button>
      </div>
    </header>
  );
}

// ─────────────────────────── Toast ───────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [msg, onDone]);
  return (
    <div style={{
      position: "fixed", left: "50%", bottom: 24, transform: `translate(-50%, ${msg ? "0" : "120%"})`,
      background: "#1a1410", color: "#f4ecdf",
      padding: "12px 18px", borderRadius: 999,
      fontSize: 13, fontFamily: "var(--sans)",
      zIndex: 60, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.4)",
      transition: "transform 0.35s cubic-bezier(0.22,0.61,0.36,1)",
      pointerEvents: "none",
      maxWidth: "90vw",
    }}>{msg}</div>
  );
}

// ─────────────────────────── App ───────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [showStick, setShowStick] = useState(false);
  const [toast, setToast] = useState("");
  useReveal();

  const school = useMemo(
    () => SCHOOLS.find(s => s.id === t.schoolId) || SCHOOLS[0],
    [t.schoolId]
  );

  // Set root css vars so global styles (sections that don't pass vars locally) follow the school
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--tutor-bg", school.tutorBg);
    r.style.setProperty("--tutor-bg-2", school.tutorBg2);
    r.style.setProperty("--tutor-ink", school.tutorInk);
    r.style.setProperty("--tutor-accent", school.tutorAccent);
    r.style.setProperty("--parent-bg", school.parentBg);
    r.style.setProperty("--parent-bg-2", school.parentBg2);
    r.style.setProperty("--parent-ink", school.parentInk);
    r.style.setProperty("--parent-accent", school.parentAccent);
  }, [school]);

  useEffect(() => {
    const onScroll = () => setShowStick(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onCTA = useCallback((kind) => {
    if (kind === "tutor") {
      document.getElementById("tutor-how")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setToast("Tutor sign-up flow — prototype stub");
    } else if (kind === "parent") {
      document.getElementById("parent-how")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setToast(`Browse tutors for ${school.name} — prototype stub`);
    } else if (kind === "how") {
      document.getElementById("how-20-works")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [school]);

  // Brand-name override for the earnings card "On {brand}"
  // (CountUp etc. are scoped; we re-render Earnings copy here directly)
  return (
    <>
      <StickyBar brand={t.brandName} show={showStick} onCTA={onCTA} />
      <Hero school={school} brand={t.brandName} showFloats={t.showFloats} onCTA={onCTA} />
      <SchoolBar schoolId={t.schoolId} onChange={(id) => setTweak("schoolId", id)} />
      <PitchLine />
      <Mechanic framing={t.framing} />
      <HowMirrored school={school} />
      <Comparison brand={t.brandName} />
      <Trust school={school} />
      <Guarantee />
      <TutorCards school={school} />
      <EarningsBranded brand={t.brandName} />
      <FAQ />
      <FinalCTA school={school} brand={t.brandName} onCTA={onCTA} />
      <Footer brand={t.brandName} />
      <Toast msg={toast} onDone={() => setToast("")} />

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakText label="Brand name" value={t.brandName}
                   onChange={(v) => setTweak("brandName", v)} />
        <TweakSection label="School page" />
        <TweakSelect label="Currently showing"
                     value={t.schoolId}
                     options={SCHOOLS.map(s => ({ value: s.id, label: s.name }))}
                     onChange={(v) => setTweak("schoolId", v)} />
        <TweakSection label="$20 framing" />
        <TweakRadio label="Copy direction"
                    value={t.framing}
                    options={[
                      { value: "transparent", label: "Transparent" },
                      { value: "simple", label: "Simple" },
                    ]}
                    onChange={(v) => setTweak("framing", v)} />
        <TweakSection label="Hero motion" />
        <TweakToggle label="Floating accents on hover"
                     value={t.showFloats}
                     onChange={(v) => setTweak("showFloats", v)} />
      </TweaksPanel>
    </>
  );
}

// Wrap Earnings so we can pass brand prop without restructuring above
function EarningsBranded({ brand }) {
  return (
    <section className="section-pad earnings">
      <div className="container">
        <div className="label reveal">For tutors · what you actually keep</div>
        <h2 className="h2 reveal d1">A $50 lesson is a <em>$50 lesson</em>.</h2>
        <p className="lede reveal d2">Same hour, same student, same effort. The number you bill is the number you bank — minus a single $20 that vanishes after the first lesson, forever.</p>
        <div className="earn-grid reveal d2">
          <div className="earn-card">
            <div className="tag">At a centre</div>
            <div className="big">$20–$30 <em>/hr</em></div>
            <p className="copy">A $50/hr lesson lands you somewhere between $20 and $30 in your pocket. Every single lesson. For the entire student relationship. Forever.</p>
            <div className="term">Over a 10-week term @ 1hr/wk: net <b>≈ $250</b></div>
          </div>
          <div className="earn-card us">
            <div className="tag">On {brand}</div>
            <div className="big">$50 <em>/hr</em></div>
            <p className="copy">A $50/hr lesson lands you $50 in your pocket. Forever. After a one-time $20 commission to us when the parent first unlocks you.</p>
            <div className="term">Over a 10-week term @ 1hr/wk: net <b>$480</b> (lesson 1: $30; lessons 2–10: $50)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

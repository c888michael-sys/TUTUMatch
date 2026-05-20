// TutMatch v3 — Swiss-modern teal, Inter + JetBrains Mono
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brandName": "TutMatch",
  "schoolId": "killara",
  "framing": "transparent",
  "showFloats": true
}/*EDITMODE-END*/;

// ─────────────────────────── Inline SVG icons (1.5px stroke, no fill) ───────────────────────────
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const I = {
  Arrow: ({ s = 16 }) => (
    <svg className="arr" width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  Lock: ({ s = 12 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="1.5"/>
      <path d="M8 11V8a4 4 0 018 0v3"/>
    </svg>
  ),
  Unlock: ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="1.5"/>
      <path d="M8 11V8a4 4 0 017.5-1"/>
    </svg>
  ),
  Discount: ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M19 5L5 19"/>
      <circle cx="8" cy="8" r="2"/>
      <circle cx="16" cy="16" r="2"/>
    </svg>
  ),
  Handshake: ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M3 12l4-4 5 5-4 4z"/>
      <path d="M12 13l3-3 5 5-3 3z"/>
      <path d="M9 9l2-2"/>
    </svg>
  ),
  Shield: ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  Id: ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="1.5"/>
      <circle cx="9" cy="12" r="2.2"/>
      <path d="M14 11h4M14 14h3"/>
    </svg>
  ),
  Doc: ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M6 4h9l5 5v11H6z"/>
      <path d="M14 4v6h6"/>
      <path d="M9 14h6M9 17h4"/>
    </svg>
  ),
  User: ({ s = 28 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <circle cx="12" cy="9" r="3.2"/>
      <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"/>
    </svg>
  ),
};

// ─────────────────────────── Wordmark ───────────────────────────
function Wordmark({ size = 18, className = "wordmark" }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ display: "inline-block", width: size * 0.45, height: size * 1.05,
                     background: "var(--brand)", transform: "skewX(-12deg)" }}></span>
      <span>TutMatch</span>
    </span>
  );
}

// ─────────────────────────── Count up ───────────────────────────
function CountUp({ to, prefix = "", suffix = "", duration = 1100, decimals = 0 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(to); started.current = true; return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started.current) {
          started.current = true;
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
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{n.toFixed(decimals)}{suffix}</span>;
}

// ─────────────────────────── Sticky bar ───────────────────────────
function StickyBar({ show, onCTA }) {
  return (
    <header className={`stickybar ${show ? "show" : ""}`}>
      <div className="wordmark">
        <span className="tm-dot"></span>TutMatch
      </div>
      <div className="ctas">
        <button className="btn ghost" onClick={() => onCTA("how")}>How it works</button>
        <button className="btn ink" onClick={() => onCTA("tutor")}>List for free</button>
        <button className="btn brand" onClick={() => onCTA("parent")}>Find a tutor</button>
      </div>
    </header>
  );
}

// ─────────────────────────── Hero ───────────────────────────
function Hero({ showFloats, onCTA }) {
  const [lean, setLean] = useState(null);
  const [engaged, setEngaged] = useState({ tutor: false, parent: false });
  const holdT = useRef({ tutor: null, parent: null });
  const heroRef = useRef(null);

  const onMove = useCallback((e) => {
    if (!heroRef.current) return;
    const w = heroRef.current.clientWidth;
    const x = e.clientX;
    if (x < w * 0.46) setLean("left");
    else if (x > w * 0.54) setLean("right");
    else setLean(null);
  }, []);
  const onLeave = useCallback(() => setLean(null), []);

  const startHold = (side) => {
    clearTimeout(holdT.current[side]);
    holdT.current[side] = setTimeout(() => setEngaged(s => ({ ...s, [side]: true })), 320);
  };
  const endHold = (side) => {
    clearTimeout(holdT.current[side]);
    setEngaged(s => ({ ...s, [side]: false }));
  };

  return (
    <section className={`hero ${lean ? `lean-${lean}` : ""}`}
             ref={heroRef}
             onMouseMove={onMove}
             onMouseLeave={onLeave}>

      <div className="wordmark-center" aria-hidden="true">
        <span className="mark"></span>
        <span>TutMatch</span>
      </div>

      <a className={`hero-half tutor ${engaged.tutor ? "engaged" : ""}`}
         href="#tutor-how"
         onClick={(e) => { e.preventDefault(); onCTA("tutor"); }}
         onMouseEnter={() => startHold("tutor")}
         onMouseLeave={() => endHold("tutor")}
         aria-label="For tutors — list for free">
        <div className="hero-content">
          <div className="label"><span className="dot"></span>For tutors</div>
          <h1>Tutor without losing half your pay.</h1>
          <p className="subhead">Pay us $20 once per student. Keep everything else, forever.</p>
          <div className="hero-cta-row">
            <span className="hero-cta">List for free <I.Arrow s={16} /></span>
            <span className="hero-data">0% commission<span className="sep">·</span>You set the rate</span>
          </div>
          {showFloats && (
            <div className="hero-floats" aria-hidden="true">
              <div className="float-line"><span>$50/hr lesson →</span><span className="v">$50 in your pocket</span></div>
              <div className="float-line"><span>Per-lesson cut →</span><span className="v">0%</span></div>
              <div className="float-line"><span>Platform fee →</span><span className="v">$20, once, ever</span></div>
            </div>
          )}
        </div>
      </a>

      <a className={`hero-half parent ${engaged.parent ? "engaged" : ""}`}
         href="#parent-how"
         onClick={(e) => { e.preventDefault(); onCTA("parent"); }}
         onMouseEnter={() => startHold("parent")}
         onMouseLeave={() => endHold("parent")}
         aria-label="For parents — find a tutor">
        <div className="hero-content">
          <div className="label"><span className="dot"></span>For parents</div>
          <h1>Pay the tutor, not a centre's markup.</h1>
          <p className="subhead">Tutoring centres mark lessons up 40–60%. We don't. You pay your tutor directly, at their rate.</p>
          <div className="hero-cta-row">
            <span className="hero-cta">Find a tutor <I.Arrow s={16} /></span>
            <span className="hero-data" style={{ color: "rgba(255,255,255,0.6)" }}>$20 to unlock<span className="sep">·</span>$20 off first lesson</span>
          </div>
          {showFloats && (
            <div className="hero-floats" aria-hidden="true">
              <div className="float-line"><span>Centre markup →</span><span className="v">40–60% per lesson</span></div>
              <div className="float-line"><span>Our markup →</span><span className="v">0% per lesson, forever</span></div>
              <div className="float-line"><span>You front $20 →</span><span className="v">Refunded on lesson 1</span></div>
            </div>
          )}
        </div>
      </a>

      <div className="divider" aria-hidden="true"></div>

      <div className="hero-foot">
        <span>NSW · est. 2026 · independent marketplace</span>
        <span>Scroll for how the $20 actually works ↓</span>
      </div>
    </section>
  );
}

// ─────────────────────────── Section head ───────────────────────────
function SectionHead({ eyebrow, heading, brandWords = 0, lede }) {
  // brandWords: count of leading words in heading to render in --brand
  const words = heading.split(" ");
  const head = brandWords > 0 ? (
    <>
      <span className="brand-2">{words.slice(0, brandWords).join(" ")}</span>{" "}
      {words.slice(brandWords).join(" ")}
    </>
  ) : heading;
  return (
    <div className="section-head reveal">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="h2">{head}</h2>
      </div>
      <p className="lede">{lede}</p>
    </div>
  );
}

// ─────────────────────────── Pitch ───────────────────────────
function Pitch() {
  return (
    <section className="pitch">
      <div className="pitch-inner reveal">
        <div className="eyebrow">The bottom line</div>
        <p className="pitch-line">
          Tutoring centres take <span className="num"><CountUp to={40}/>–<CountUp to={60} suffix="%"/></span> of every lesson, forever. We take <span className="num">$<CountUp to={20}/></span>, once.
        </p>
        <p className="pitch-note">A flat $20 per student match. No per-lesson cut, no monthly fee, no upcharge on the tutor's rate. After lesson one, we're not in the loop.</p>
      </div>
    </section>
  );
}

// ─────────────────────────── Mechanic ───────────────────────────
function Mechanic({ framing }) {
  return (
    <section className="section-pad" id="how-20-works">
      <SectionHead
        eyebrow="The mechanic"
        heading="$20, explained."
        brandWords={1}
        lede={framing === "transparent"
          ? "The $20 is the tutor's commission to us. We collect it through the parent as an escrow so tutors can't take the introduction and disappear. The first lesson is discounted by $20 to reimburse the parent. Net cost to the parent: $0."
          : "$20 unlocks the tutor's contact details. The tutor takes $20 off your first lesson, so it costs you nothing."}
      />

      <div className="mechanic-grid">
        <div className="step reveal d1">
          <div className="ico"><I.Unlock /></div>
          <div className="step-n">Step 01</div>
          <h3>Parent unlocks the tutor</h3>
          <p>Pay $20 to reveal the tutor's name, mobile and email. We hold the funds until the first lesson is done.</p>
        </div>
        <div className="step reveal d2">
          <div className="ico"><I.Discount /></div>
          <div className="step-n">Step 02</div>
          <h3>Tutor discounts the first lesson by $20</h3>
          <p>Built into onboarding — they apply it to the first invoice. We release the held funds to the tutor as our commission.</p>
        </div>
        <div className="step reveal d3">
          <div className="ico"><I.Handshake /></div>
          <div className="step-n">Step 03</div>
          <h3>Deal directly, forever after</h3>
          <p>Tutor sets the rate. Parent pays the tutor. No further fees, no per-lesson cut, no platform between you. Ever.</p>
        </div>
      </div>

      {framing === "transparent" && (
        <div className="honesty reveal">
          <div className="tag">Why it works this way</div>
          <p>The $20 is the <b>tutor's commission to us</b>, but we collect it through the parent so tutors can't take an introduction and disappear. The first-lesson discount is how the tutor pays us back. <b>Net cost to the parent: $0.</b></p>
        </div>
      )}

      <div className="receipt reveal">
        <div className="row muted"><span>Unlock — Daniel L.</span><span>$20.00</span></div>
        <div className="row muted"><span>First lesson · 1hr @ $65</span><span>$65.00</span></div>
        <div className="row"><span>Tutor's first-lesson discount</span><span className="neg">−$20.00</span></div>
        <div className="row total"><span>Parent pays the tutor</span><span>$45.00</span></div>
        <div className="row" style={{ marginTop: 8 }}><span>Net cost vs centre</span><span className="pos">$0 extra</span></div>
      </div>
    </section>
  );
}

// ─────────────────────────── How mirrored ───────────────────────────
function HowMirrored() {
  return (
    <section className="section-pad" id="how-mirrored">
      <SectionHead
        eyebrow="How it works"
        heading="Pick your side."
        brandWords={1}
        lede="Tutor on the left, parent on the right — mirrored steps, same single $20 in the middle. After that, you talk to each other."
      />
      <div className="how-grid">
        <div className="how-col reveal d1" id="tutor-how">
          <span className="badge">For tutors</span>
          <h3>List, get unlocked, keep teaching.</h3>
          <div className="how-step">
            <span className="num">01</span>
            <span className="body"><b>List for free.</b> Profile, subjects, hourly rate, suburbs you'll travel to.</span>
          </div>
          <div className="how-step">
            <span className="num">02</span>
            <span className="body"><b>Get verified.</b> WWCC, photo ID, HSC/ATAR scans — manual review in 48 hrs.</span>
          </div>
          <div className="how-step">
            <span className="num">03</span>
            <span className="body"><b>A parent unlocks you.</b> Our <span className="m">$20</span> commission is collected from them, held for you.</span>
          </div>
          <div className="how-step">
            <span className="num">04</span>
            <span className="body"><b>Discount the first lesson by $20.</b> Your invoicing prompts this. The held $20 is released to us.</span>
          </div>
          <div className="how-step">
            <span className="num">05</span>
            <span className="body"><b>Keep 100% of every lesson, forever.</b> Set your rate. Raise it whenever.</span>
          </div>
        </div>
        <div className="how-divider" aria-hidden="true"></div>
        <div className="how-col reveal d2" id="parent-how">
          <span className="badge">For parents</span>
          <h3>Browse, unlock, deal directly.</h3>
          <div className="how-step">
            <span className="num">01</span>
            <span className="body"><b>Browse free.</b> Filter by subject, suburb, ATAR, in-person vs. online.</span>
          </div>
          <div className="how-step">
            <span className="num">02</span>
            <span className="body"><b>Pick your tutor.</b> Open as many profiles as you like, message them through the platform first.</span>
          </div>
          <div className="how-step">
            <span className="num">03</span>
            <span className="body"><b>Pay <span className="m">$20</span> to unlock.</b> That reveals their contact details. We hold the funds.</span>
          </div>
          <div className="how-step">
            <span className="num">04</span>
            <span className="body"><b>Get $20 off your first lesson.</b> The tutor applies the discount. <span className="m">Net cost: $0.</span></span>
          </div>
          <div className="how-step">
            <span className="num">05</span>
            <span className="body"><b>Deal directly from there.</b> No further platform fees, ever.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Comparison table ───────────────────────────
function Comparison({ brand }) {
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="Compare"
        heading="What you'd pay elsewhere."
        brandWords={1}
        lede="No spin. Same hour, same student — see exactly where your money goes."
      />
      <div className="compare reveal">
        <div className="row head">
          <div className="cell label">Per-student cost</div>
          <div className="cell">Tutoring centres</div>
          <div className="cell us">{brand}</div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">Commission per lesson</div>
          <div className="cell" data-label="Tutoring centres"><span className="m">40–60%</span> of every hour</div>
          <div className="cell us" data-label={brand}><span className="m">0%</span> after the match fee</div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">Match fee</div>
          <div className="cell" data-label="Tutoring centres">Bundled into the centre's rate</div>
          <div className="cell us" data-label={brand}><span className="m">$20</span> flat, once per match</div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">Who picks the tutor</div>
          <div className="cell" data-label="Tutoring centres">Centre assigns</div>
          <div className="cell us" data-label={brand}>You pick</div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">Who sets the rate</div>
          <div className="cell" data-label="Tutoring centres">The centre</div>
          <div className="cell us" data-label={brand}>The tutor</div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">Lock-in</div>
          <div className="cell" data-label="Tutoring centres">Term commitments</div>
          <div className="cell us" data-label={brand}>None</div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">10-week term, 1hr/wk @ $50</div>
          <div className="cell" data-label="Tutoring centres">Total paid: <span className="m">≈ $500</span> · Tutor nets <span className="m">≈ $250</span></div>
          <div className="cell us" data-label={brand}>Total paid: <span className="m">$500</span> · Tutor nets <span className="m">$480</span></div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Trust ───────────────────────────
const TRUST_V3 = [
  { t: "WWCC verified", d: "Working With Children Check on every tutor before they're listed.", I: I.Shield },
  { t: "Government ID checked", d: "Driver's licence or passport against the name on the WWCC.", I: I.Id },
  { t: "HSC/ATAR results verified", d: "Manual review of NESA Results Notice scans. No self-reported ATARs.", I: I.Doc },
  { t: "18+ tutors only", d: "Adult tutors only. No high-schoolers tutoring high-schoolers via the platform.", I: I.User },
];

function Trust() {
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="Trust & safety"
        heading="How we vet every tutor."
        brandWords={2}
        lede="Every tutor clears the same checks before going live. No exceptions for high ATAR. No exceptions for the founder's mate."
      />
      <div className="trust-grid">
        {TRUST_V3.map((t, i) => (
          <div className="trust-cell reveal" key={i} style={{ animationDelay: `${i * 40}ms` }}>
            <div className="ico"><t.I /></div>
            <h3>{t.t}</h3>
            <p>{t.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────── Guarantee ───────────────────────────
function Guarantee() {
  return (
    <section className="guarantee">
      <div className="guarantee-card reveal">
        <div className="left">
          <p className="meta">5-day guarantee</p>
          <h3>Tutor doesn't reply? You get your $20 back.</h3>
        </div>
        <div className="body">
          <p><span className="m">Automatically</span>, after 5 days. No forms, no calls, no questions. This is the parent's protection on the front-loaded payment — the whole reason the $20 sits in escrow before going to the tutor.</p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── School selector ───────────────────────────
function SchoolBar({ schoolId, onChange }) {
  const school = SCHOOLS.find(s => s.id === schoolId) || SCHOOLS[0];
  return (
    <div className="schoolbar">
      <div className="schoolbar-inner reveal">
        <div className="sb-l">
          <span className="sb-tag">Showing tutors for</span>
          <span className="sb-school">{school.name}<span className="m">/ {school.tagline}</span></span>
        </div>
        <div className="sb-r" role="tablist" aria-label="Switch school">
          <span className="sb-tag">Switch</span>
          {SCHOOLS.map(s => (
            <button key={s.id}
                    role="tab"
                    aria-selected={s.id === schoolId}
                    className={`sb-chip ${s.id === schoolId ? "active" : ""}`}
                    onClick={() => onChange(s.id)}>
              {s.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Sample tutor cards ───────────────────────────
function TutorCards({ school }) {
  const tutors = SAMPLE_TUTORS[school.id] || SAMPLE_TUTORS.killara;
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow={`Sample listings · ${school.name}`}
        heading="What you'll see when you browse."
        brandWords={1}
        lede={`Example tutors for ${school.name}. Real listings show first name + last initial, photo, suburb, verified ATAR, HSC subjects with band results, and the tutor's hourly rate. Contact details are masked until unlock.`}
      />
      <div className="tutor-grid">
        {tutors.map((t, i) => (
          <div className="tcard reveal" key={i}>
            <span className="example">Example</span>
            <div className="top">
              <div className="ph">{t.initials}</div>
              <div>
                <div className="name">{t.name}</div>
                <div className="meta">
                  {t.suburb}<span className="sep">·</span><span className="atar">ATAR {t.atar}</span>
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
              <div className="rate">${t.rate}<small>/hr</small></div>
              <button className="unlock"><I.Lock /> Unlock — $20</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────── Earnings ───────────────────────────
function Earnings({ brand }) {
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="For tutors"
        heading="The maths, for tutors."
        brandWords={2}
        lede="Same hour, same student, same effort. The number you bill is the number you bank — minus a single $20 that vanishes after the first lesson, forever."
      />
      <div className="earn-grid">
        <div className="earn-card reveal d1">
          <div className="label">At a centre</div>
          <div className="big">$20–$30<span className="unit">/hr in pocket</span></div>
          <p className="copy">A $50/hr lesson lands you somewhere between $20 and $30 in your pocket. Every lesson. For the entire student relationship. Forever.</p>
          <div className="term">10-week term @ 1hr/wk → net <span className="m">≈ $250</span></div>
        </div>
        <div className="earn-card us reveal d2">
          <div className="label">On {brand}</div>
          <div className="big">$50<span className="unit">/hr in pocket</span></div>
          <p className="copy">A $50/hr lesson lands you $50 in your pocket. Forever. After one $20 commission when a parent first unlocks you.</p>
          <div className="term">10-week term @ 1hr/wk → net <span className="m">$480</span> (lesson 1: $30; lessons 2–10: $50)</div>
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
    <section className="section-pad">
      <SectionHead
        eyebrow="FAQ"
        heading="Common questions."
        brandWords={1}
        lede="Anything else? Email hello@tutmatch.com.au and we'll get back the same day."
      />
      <div className="faq-tabs reveal" role="tablist">
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
      <div className="faq-list reveal">
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
    </section>
  );
}

// ─────────────────────────── Final CTA ───────────────────────────
function FinalCTA({ school, onCTA }) {
  return (
    <section className="final">
      <div className="final-inner">
        <div className="final-tagline">
          Free to list<span className="sep"></span>Free to browse<span className="sep"></span>$20 to connect
        </div>
        <div className="final-grid">
          <div className="final-half reveal d1">
            <div className="eyebrow on-ink">For tutors</div>
            <h3 className="heading">Keep what you earn. Start in six minutes.</h3>
            <p className="sub">List for free, pass verification, get paid directly. We charge $20 once per match — never again.</p>
            <div>
              <button className="btn brand lg" onClick={() => onCTA("tutor")}>Start tutoring <I.Arrow /></button>
            </div>
          </div>
          <div className="v-divider" aria-hidden="true"></div>
          <div className="final-half reveal d2">
            <div className="eyebrow on-ink">For parents</div>
            <h3 className="heading">Find a tutor at {school.name}.</h3>
            <p className="sub">Browse free. Pay $20 only when you unlock a tutor's contact details — and get it back as a first-lesson discount.</p>
            <div>
              <button className="btn white lg" onClick={() => onCTA("parent")}>Find a tutor <I.Arrow /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Footer ───────────────────────────
function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <div className="foot-brand"><span className="mark"></span>TutMatch</div>
          <p className="foot-blurb">A flat-fee NSW tutor marketplace. No per-lesson cut, ever. Tutors and parents deal directly.</p>
        </div>
        <div>
          <h5>Product</h5>
          <ul>
            <li><a href="#">Browse tutors</a></li>
            <li><a href="#">For tutors</a></li>
            <li><a href="#">How it works</a></li>
            <li><a href="#">Schools</a></li>
          </ul>
        </div>
        <div>
          <h5>Trust</h5>
          <ul>
            <li><a href="#">Verification</a></li>
            <li><a href="#">5-day guarantee</a></li>
            <li><a href="#">Safety policy</a></li>
          </ul>
        </div>
        <div>
          <h5>Legal</h5>
          <ul>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Terms of service</a></li>
            <li><a href="#">Child safety</a></li>
          </ul>
        </div>
        <div>
          <h5>Contact</h5>
          <ul>
            <li><a href="mailto:hello@tutmatch.com.au">hello@tutmatch.com.au</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">TikTok</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>ABN 00 000 000 000 · Made in NSW</span>
        <span>© 2026 TutMatch</span>
      </div>
    </footer>
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
      position: "fixed", left: "50%", bottom: 24,
      transform: `translate(-50%, ${msg ? "0" : "120%"})`,
      background: "#0A0A0A", color: "#FFFFFF",
      padding: "12px 18px",
      borderRadius: 4,
      fontSize: 13, fontFamily: "var(--sans)", fontWeight: 500,
      zIndex: 60, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.4)",
      transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
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

  const school = useMemo(
    () => SCHOOLS.find(s => s.id === t.schoolId) || SCHOOLS[0],
    [t.schoolId]
  );

  // Re-theme the entire page based on the active school's brand colour
  useEffect(() => {
    document.body.setAttribute("data-school", school.id);
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

  return (
    <>
      <StickyBar show={showStick} onCTA={onCTA} />
      <Hero showFloats={t.showFloats} onCTA={onCTA} />
      <Pitch />
      <Mechanic framing={t.framing} />
      <SchoolBar schoolId={t.schoolId} onChange={(id) => setTweak("schoolId", id)} />
      <TutorCards school={school} />
      <HowMirrored />
      <Comparison brand={t.brandName} />
      <Trust />
      <Guarantee />
      <Earnings brand={t.brandName} />
      <FAQ />
      <FinalCTA school={school} onCTA={onCTA} />
      <Footer />
      <Toast msg={toast} onDone={() => setToast("")} />

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakText label="Brand name" value={t.brandName}
                   onChange={(v) => setTweak("brandName", v)} />
        <TweakSection label="School (filters listings)" />
        <TweakSelect label="School page"
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
        <TweakToggle label="Float data on hover"
                     value={t.showFloats}
                     onChange={(v) => setTweak("showFloats", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

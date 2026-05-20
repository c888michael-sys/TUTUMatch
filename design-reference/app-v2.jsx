// TutMatch v2 — locked palette, gold accent disciplined to display use only
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brandName": "TutMatch",
  "schoolId": "killara",
  "framing": "transparent",
  "showFloats": true
}/*EDITMODE-END*/;

// ─────────────────────────── Inline SVG icons ───────────────────────────
const I = {
  Arrow: ({ size = 18 }) => (
    <svg className="arr" width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  Lock: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="1.5"/>
      <path d="M8 11V8a4 4 0 018 0v3"/>
    </svg>
  ),
  Unlock: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="1.5"/>
      <path d="M8 11V8a4 4 0 018-0.5"/>
    </svg>
  ),
  Discount: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 5L5 19"/>
      <circle cx="8" cy="8" r="2"/>
      <circle cx="16" cy="16" r="2"/>
    </svg>
  ),
  Handshake: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12l4-4 5 5-4 4z"/>
      <path d="M11 13l3-3 5 5-3 3z"/>
      <path d="M9 9l2-2M14 14l2-2"/>
    </svg>
  ),
  List: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h10"/>
    </svg>
  ),
  Check: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 12l3 3 5-6"/>
    </svg>
  ),
  Money: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2.5"/>
      <path d="M3 10h2M19 14h2"/>
    </svg>
  ),
  Search: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/>
      <path d="M20 20l-4-4"/>
    </svg>
  ),
  Filter: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16l-6 8v5l-4 2v-7z"/>
    </svg>
  ),
  Trust: ({ d, size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d}/>
    </svg>
  ),
};

// ─────────────────────────── Count up ───────────────────────────
function CountUp({ to, suffix = "", duration = 1100, decimals = 0 }) {
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
  return <span ref={ref}>{n.toFixed(decimals)}{suffix}</span>;
}

// ─────────────────────────── Sticky bar ───────────────────────────
function StickyBar({ brand, show, onCTA }) {
  return (
    <header className={`stickybar ${show ? "show" : ""}`}>
      <div className="wordmark">{brand}</div>
      <div className="ctas">
        <button className="btn ghost" onClick={() => onCTA("how")}>How it works</button>
        <button className="btn ink" onClick={() => onCTA("tutor")}>List for free</button>
        <button className="btn primary" onClick={() => onCTA("parent")}>Find a tutor</button>
      </div>
    </header>
  );
}

// ─────────────────────────── Hero ───────────────────────────
function Hero({ brand, showFloats, onCTA }) {
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
    holdT.current[side] = setTimeout(() => setEngaged(s => ({ ...s, [side]: true })), 360);
  };
  const endHold = (side) => {
    clearTimeout(holdT.current[side]);
    setEngaged(s => ({ ...s, [side]: false }));
  };

  const floatPos = (idx, side) => {
    const positions = {
      tutor: [{top:"24%",right:"8%"},{top:"46%",right:"14%"},{top:"66%",right:"6%"}],
      parent: [{top:"22%",left:"8%"},{top:"44%",left:"14%"},{top:"64%",left:"6%"}],
    };
    return positions[side][idx];
  };

  return (
    <section className={`hero ${lean ? `lean-${lean}` : ""}`}
             ref={heroRef}
             onMouseMove={onMove}
             onMouseLeave={onLeave}>

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
          {showFloats && [
            "\u201C$50/hr — yours, every hour\u201D",
            "\u201COne $20 commission, ever\u201D",
            "\u201CSet your own hours\u201D",
          ].map((t, i) => (
            <span key={i} className={`float-chip f${i+1}`} style={floatPos(i, "tutor")}>{t}</span>
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="dot"></span>For tutors</div>
          <h1>Tutor without <em>losing half</em> your pay.</h1>
          <p className="subhead">Pay us $20 once per student. Keep everything else, forever.</p>
          <span className="hero-cta">List for free <I.Arrow /></span>
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
          {showFloats && [
            "\u201CPay tutors directly\u201D",
            "\u201CNo centre markup\u201D",
            "\u201C$20 fronted, $20 back\u201D",
          ].map((t, i) => (
            <span key={i} className={`float-chip f${i+1}`} style={floatPos(i, "parent")}>{t}</span>
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="dot"></span>For parents</div>
          <h1>Pay the tutor, <em>not a centre's</em> markup.</h1>
          <p className="subhead">Tutoring centres mark lessons up 40–60%. We don't. You pay your tutor directly, at their rate.</p>
          <span className="hero-cta">Find a tutor <I.Arrow /></span>
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

// ─────────────────────────── School bar ───────────────────────────
function SchoolBar({ schoolId, onChange }) {
  const school = SCHOOLS.find(s => s.id === schoolId) || SCHOOLS[0];
  return (
    <div className="schoolbar">
      <div className="schoolbar-inner reveal">
        <div className="sb-l">
          <span className="sb-label">Showing tutors for</span>
          <span className="sb-school"><em>{school.name}</em> · {school.tagline}</span>
        </div>
        <div className="sb-r" role="tablist" aria-label="Switch school">
          <span className="sb-label" style={{ marginRight: 4 }}>Switch:</span>
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

// ─────────────────────────── Pitch ───────────────────────────
function Pitch() {
  return (
    <section className="pitch">
      <div className="container reveal">
        <p className="pitch-line">
          Tutoring centres take <span className="accent"><CountUp to={40}/>–<CountUp to={60} suffix="%"/></span> of every lesson, forever. We take <span className="accent">$<CountUp to={20}/></span>, once.
        </p>
        <p className="pitch-note">A flat $20 per student match. No per-lesson cut, no monthly fee, no upcharge on the tutor's rate. After the first lesson, we're not in the loop.</p>
      </div>
    </section>
  );
}

// ─────────────────────────── Mechanic ───────────────────────────
function Mechanic({ framing }) {
  return (
    <section className="section-pad" id="how-20-works">
      <div className="container">
        <div className="row-2col reveal">
          <div>
            <div className="eyebrow">How the $20 actually works</div>
            <h2 className="h2">One <em>flat $20</em> per match. Then we get out of your way — forever.</h2>
          </div>
          <p className="lede">
            {framing === "transparent"
              ? "The $20 is the tutor's commission to us. We collect it through the parent as an escrow so tutors can't take the introduction and disappear. The first lesson is discounted by $20 to reimburse the parent — net cost to the parent is $0."
              : "$20 unlocks the tutor's contact details. The tutor takes $20 off your first lesson, so it costs you nothing."}
          </p>
        </div>

        <div className="mechanic-grid">
          <div className="step reveal d1">
            <div className="step-icon"><I.Unlock size={28} /></div>
            <div className="step-n">Step 01</div>
            <h3>Parent unlocks the tutor</h3>
            <p>Pay $20 to reveal the tutor's name, mobile and email. We hold the funds until your first lesson is done.</p>
            <div className="figure">[ unlock-modal mockup ]</div>
          </div>
          <div className="step reveal d2">
            <div className="step-icon"><I.Discount size={28} /></div>
            <div className="step-n">Step 02</div>
            <h3>Tutor discounts your first lesson by $20</h3>
            <p>Built into the tutor's onboarding — they apply it to the first invoice. We release the held funds as their commission.</p>
            <div className="figure">[ first-lesson invoice ]</div>
          </div>
          <div className="step reveal d3">
            <div className="step-icon"><I.Handshake size={28} /></div>
            <div className="step-n">Step 03</div>
            <h3>Deal directly, forever after</h3>
            <p>Tutor sets the rate. Parent pays the tutor. No further fees, no per-lesson cut, no platform between you. Ever.</p>
            <div className="figure">[ direct payment screen ]</div>
          </div>
        </div>

        {framing === "transparent" && (
          <div className="honesty reveal">
            <div className="tag">Why it works this way:</div>
            <p>
              The $20 is the <b>tutor's commission to us</b>, but we collect it through the parent so tutors can't take an introduction and disappear. The first-lesson discount is how the tutor pays us back. <b>Net cost to the parent: $0.</b>
            </p>
          </div>
        )}

        <div className="receipt reveal d2">
          <div className="row muted"><span>Unlock — Daniel L.</span><span>$20.00</span></div>
          <div className="row muted"><span>First lesson · 1hr @ $65</span><span>$65.00</span></div>
          <div className="row"><span>Tutor's first-lesson discount</span><span className="neg">−$20.00</span></div>
          <div className="row total"><span>Parent pays the tutor</span><span>$45.00</span></div>
          <div className="row" style={{ marginTop: 10 }}><span>Net cost vs centre</span><span className="pos">$0 extra</span></div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── How mirrored ───────────────────────────
function HowMirrored() {
  return (
    <section className="section-pad" id="how-mirrored">
      <div className="container">
        <div className="row-2col reveal">
          <div>
            <div className="eyebrow">How it works</div>
            <h2 className="h2">Same flat fee, <em>two sides</em> of the table.</h2>
          </div>
          <p className="lede">Tutor on the left, parent on the right — mirrored steps, same single $20 in the middle. After that, you talk to each other.</p>
        </div>

        <div className="how-grid reveal">
          <div className="how-col tutor-col" id="tutor-how">
            <div className="role">For tutors</div>
            <div className="ctitle">List, get unlocked, keep teaching.</div>
            <div className="how-step">
              <div className="ico"><I.List /></div>
              <div className="body"><b>List for free.</b> Profile, subjects, hourly rate, suburbs you'll travel to.</div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Check /></div>
              <div className="body"><b>Get verified.</b> WWCC, photo ID, HSC/ATAR scans — manual review in 48 hrs.</div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Unlock /></div>
              <div className="body"><b>A parent unlocks you.</b> Our flat <em>$20 commission</em> is collected from them, held for you.</div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Discount /></div>
              <div className="body"><b>Discount their first lesson by $20.</b> Your invoicing tool prompts this automatically. The held $20 is released to us as commission.</div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Money /></div>
              <div className="body"><b>Keep 100% of every lesson, forever.</b> No per-hour platform cut. Set your rate. Raise it whenever.</div>
            </div>
          </div>

          <div className="how-divider" aria-hidden="true"></div>

          <div className="how-col parent-col" id="parent-how">
            <div className="role">For parents</div>
            <div className="ctitle">Browse, unlock, deal directly.</div>
            <div className="how-step">
              <div className="ico"><I.Search /></div>
              <div className="body"><b>Browse free.</b> Filter by subject, suburb, ATAR, in-person vs. online.</div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Filter /></div>
              <div className="body"><b>Pick your tutor.</b> Open as many profiles as you like, message them through the platform first.</div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Unlock /></div>
              <div className="body"><b>Pay $20 to unlock.</b> That reveals their contact details. We hold the funds.</div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Discount /></div>
              <div className="body"><b>Get $20 off your first lesson.</b> The tutor applies the discount. <em>Net cost: $0.</em></div>
            </div>
            <div className="how-step">
              <div className="ico"><I.Handshake /></div>
              <div className="body"><b>Deal directly from there.</b> No further platform fees, ever. Want another tutor next term? Unlock another.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Comparison ───────────────────────────
function Comparison({ brand }) {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="row-2col reveal">
          <div>
            <div className="eyebrow">The honest comparison</div>
            <h2 className="h2">Centres take a cut <em>every lesson</em>. We take $20, <em>once</em>.</h2>
          </div>
          <p className="lede">No spin. Two cards, same hour, same student — see exactly where your money ends up.</p>
        </div>

        <div className="compare-grid">
          <div className="compare-card them reveal d1">
            <div className="label">The other model</div>
            <div className="name">Tutoring centres</div>
            <div className="tagline">Pay the centre. The centre pays the tutor a fraction. Repeat every lesson.</div>
            <ul>
              <li><span className="mark">×</span><span><b>40–60% commission</b>, taken from every lesson, forever.</span></li>
              <li><span className="mark">×</span><span>The centre sets the rate, not the tutor.</span></li>
              <li><span className="mark">×</span><span>Tutors are assigned. You don't pick.</span></li>
              <li><span className="mark">×</span><span>Term lock-ins. Hard to leave.</span></li>
              <li><span className="mark">×</span><span>Opaque pricing — fees bundled into hourly rates.</span></li>
            </ul>
            <div className="topline">
              <div className="big-pct">40–60<span style={{ fontSize: "0.6em" }}>%</span></div>
              <div className="small-line">commission, every<br/>lesson, forever</div>
            </div>
          </div>

          <div className="compare-card us reveal d2">
            <div className="label">Our model</div>
            <div className="name">{brand}</div>
            <div className="tagline">Pay the tutor. Once we've introduced you, we're out of the loop.</div>
            <ul>
              <li><span className="mark">✓</span><span><b>$20 flat per student match.</b> Refunded to the parent via first-lesson discount.</span></li>
              <li><span className="mark">✓</span><span>The tutor sets the rate. Raise it whenever.</span></li>
              <li><span className="mark">✓</span><span>You pick the tutor. Unlock as many as you like.</span></li>
              <li><span className="mark">✓</span><span>No lock-in. Book one lesson or twenty.</span></li>
              <li><span className="mark">✓</span><span>Listed pricing. The hourly rate is the hourly rate.</span></li>
            </ul>
            <div className="topline">
              <div className="big-pct">$20</div>
              <div className="small-line">one-off match fee,<br/>then never again</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Trust ───────────────────────────
function Trust() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="row-2col reveal">
          <div>
            <div className="eyebrow">Trust &amp; safety</div>
            <h2 className="h2">We check, so you don't have to <em>take their word</em> for it.</h2>
          </div>
          <p className="lede">Every tutor clears the same six checks before they're listed. No exceptions for high-ATAR tutors. No exceptions for the founder's mate.</p>
        </div>
        <div className="trust-grid">
          {TRUST.map((t, i) => (
            <div className="trust-cell reveal" key={i} style={{ transitionDelay: `${i*60}ms` }}>
              <div className="ico"><I.Trust d={t.p} size={28} /></div>
              <h3>{t.t}</h3>
              <p>{t.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Guarantee ───────────────────────────
function Guarantee() {
  return (
    <section className="guarantee">
      <div className="guarantee-card reveal">
        <div className="badge">5<small>day refund</small></div>
        <div className="body">
          <h3>If your unlocked tutor doesn't respond within 5 days, your $20 is refunded automatically.</h3>
          <p>No tickets, no chase. We watch the clock for you. This is the parent's protection on the front-loaded payment — it's the whole reason the $20 sits in escrow before going to the tutor.</p>
        </div>
        <div className="badge-alt">$20<small>auto-back</small></div>
      </div>
    </section>
  );
}

// ─────────────────────────── Sample tutor cards ───────────────────────────
function TutorCards({ school }) {
  const tutors = SAMPLE_TUTORS[school.id] || SAMPLE_TUTORS.killara;
  return (
    <section className="section-pad">
      <div className="container">
        <div className="row-2col reveal">
          <div>
            <div className="eyebrow">Sample listings · {school.name}</div>
            <h2 className="h2">What you'll see when <em>you browse</em>.</h2>
          </div>
          <p className="lede">Example tutors for {school.name}. Real listings show first name + last initial, photo, suburb, verified ATAR, HSC subjects with band results, and the tutor's hourly rate. Contact details are masked until unlock.</p>
        </div>
        <div className="tutor-grid">
          {tutors.map((t, i) => (
            <div className="tcard reveal" key={i} style={{ transitionDelay: `${i*60}ms` }}>
              <span className="example">Example</span>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div className="ph">{t.initials}</div>
                <div>
                  <div className="name">{t.name}</div>
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
                <button className="unlock"><I.Lock /> Unlock — $20</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Earnings ───────────────────────────
function Earnings({ brand }) {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="row-2col reveal">
          <div>
            <div className="eyebrow">For tutors · what you actually keep</div>
            <h2 className="h2">A $50 lesson is a <em>$50 lesson</em>.</h2>
          </div>
          <p className="lede">Same hour, same student, same effort. The number you bill is the number you bank — minus a single $20 that vanishes after the first lesson, forever.</p>
        </div>

        <div className="earn-grid">
          <div className="earn-card reveal d1">
            <div className="tag">At a centre</div>
            <div className="big">$20–$30 <em>/hr</em></div>
            <p className="copy">A $50/hr lesson lands you somewhere between $20 and $30 in your pocket. Every single lesson. For the entire student relationship. Forever.</p>
            <div className="term">Over a 10-week term @ 1hr/wk: net <b>≈ $250</b></div>
          </div>
          <div className="earn-card us reveal d2">
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
      <div className="container">
        <div className="row-2col reveal">
          <div>
            <div className="eyebrow">Frequently asked</div>
            <h2 className="h2">Awkward questions, <em>plain</em> answers.</h2>
          </div>
          <p className="lede">Anything else? Email <a href="mailto:hello@tutmatch.com.au" style={{ color: "var(--ink)", borderBottom: "1px solid var(--accent)", paddingBottom: 1 }}>hello@tutmatch.com.au</a> and we'll get back the same day.</p>
        </div>

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
                  <span className="badge">{f.tag === "parents" ? "Parents" : "Tutors"}</span>
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

// ─────────────────────────── Final CTA ───────────────────────────
function FinalCTA({ brand, school, onCTA }) {
  return (
    <section className="final">
      <div className="final-inner">
        <div className="final-half">
          <div className="eyebrow"><span style={{ borderBottom: "none" }}></span>For tutors</div>
          <h2>Keep what you earn. Start in six minutes.</h2>
          <div className="cta-row">
            <button className="btn primary lg" onClick={() => onCTA("tutor")}>Start tutoring <I.Arrow size={16} /></button>
            <span style={{ fontSize: 12.5, color: "rgba(250,248,244,0.55)" }}>Free listing · WWCC required</span>
          </div>
        </div>
        <div className="divider-v" aria-hidden="true"></div>
        <div className="final-half">
          <div className="eyebrow"><span style={{ borderBottom: "none" }}></span>For parents</div>
          <h2>Find a tutor at {school.name}.</h2>
          <div className="cta-row">
            <button className="btn primary lg" onClick={() => onCTA("parent")}>Find a tutor <I.Arrow size={16} /></button>
            <span style={{ fontSize: 12.5, color: "rgba(250,248,244,0.55)" }}>Browse free · Pay only on unlock</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────── Footer ───────────────────────────
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
            <li><a href="#">Payment &amp; GST</a></li>
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
      background: "#1C1B18", color: "#FAF8F4",
      padding: "12px 18px", borderRadius: 999,
      fontSize: 13, fontFamily: "var(--sans)",
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
      <StickyBar brand={t.brandName} show={showStick} onCTA={onCTA} />
      <Hero brand={t.brandName} showFloats={t.showFloats} onCTA={onCTA} />
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
      <FinalCTA brand={t.brandName} school={school} onCTA={onCTA} />
      <Footer brand={t.brandName} />
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
        <TweakToggle label="Floating accents on hover"
                     value={t.showFloats}
                     onChange={(v) => setTweak("showFloats", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

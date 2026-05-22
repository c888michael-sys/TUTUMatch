import { SectionHead } from "./SectionHead";

export function Earnings({ brand }: { brand: string }) {
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="For tutors"
        heading="The maths, for tutors."
        brandWords={2}
        lede="An example — same hour, same student, same effort. At a centre you're paid a slice of what the parent pays; on TUTUMatch you set your own rate and keep all of it."
      />
      <div className="earn-grid">
        <div className="earn-card reveal d1">
          <div className="label">At a centre</div>
          <div className="big">
            $30–$50<span className="unit">/hr in pocket</span>
          </div>
          <p className="copy">
            Centres typically pay tutors $30–$50/hr while charging parents more. The gap stays with the centre —
            every lesson, for the entire student relationship, forever.
          </p>
          <div className="term">
            10-week term @ 1hr/wk → net <span className="m">≈ $300–$500</span>
          </div>
        </div>
        <div className="earn-card us reveal d2">
          <div className="label">On {brand}</div>
          <div className="big">
            $60–$80<span className="unit">/hr in pocket</span>
          </div>
          <p className="copy">
            You set your own rate and keep every dollar of it — no centre skimming the gap. Tutors here typically
            charge $60–$80/hr. Your first confirmed student is free; after that a one-time $20 per student, or
            skip per-match fees with <strong>Permanent</strong>.
          </p>
          <div className="term">
            10-week term @ 1hr/wk → net <span className="m">≈ $600–$800</span>
          </div>
        </div>
      </div>
      <p className="muted small" style={{ textAlign: "center", marginTop: 18 }}>
        Illustrative example — actual rates vary by subject, year level, experience and area. On {brand} you
        always set your own rate.
      </p>
    </section>
  );
}

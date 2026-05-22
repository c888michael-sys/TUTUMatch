import { SectionHead } from "./SectionHead";

export function Earnings({ brand }: { brand: string }) {
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="For tutors"
        heading="The maths, for tutors."
        brandWords={2}
        lede="Same hour, same student, same effort. List free. First student is on us. After that, $20 per confirmed match. That's it."
      />
      <div className="earn-grid">
        <div className="earn-card reveal d1">
          <div className="label">At a centre</div>
          <div className="big">
            $30–$50<span className="unit">/hr in pocket</span>
          </div>
          <p className="copy">
            Centres typically pay tutors $30–$50/hr while charging parents more. The gap stays with the centre — every
            lesson, for the entire student relationship, forever.
          </p>
          <div className="term">
            10-week term @ 1hr/wk → net <span className="m">≈ $300–$500</span>
          </div>
        </div>
        <div className="earn-card us reveal d2">
          <div className="label">On {brand}</div>
          <div className="big">
            $50<span className="unit">/hr in pocket</span>
          </div>
          <p className="copy">
            A $50/hr lesson lands you $50 — forever. Your first confirmed student costs nothing. From your second
            onwards, $20 commission per match. Or skip per-match fees with{" "}
            <strong>Permanent</strong> — $60 once, pays for itself at your 4th student.
          </p>
          <div className="term">
            10-week term @ 1hr/wk → net <span className="m">$500</span> (first student) ·{" "}
            <span className="m">$480</span> (each student after, $20 commission)
          </div>
        </div>
      </div>
    </section>
  );
}

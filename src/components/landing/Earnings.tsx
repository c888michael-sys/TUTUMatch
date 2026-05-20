import { SectionHead } from "./SectionHead";

export function Earnings({ brand }: { brand: string }) {
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
            A $50/hr lesson lands you $50 in your pocket. Forever. After one $20 commission when a parent first
            unlocks you.
          </p>
          <div className="term">
            10-week term @ 1hr/wk → net <span className="m">$480</span> (lesson 1: $30; lessons 2–10: $50)
          </div>
        </div>
      </div>
    </section>
  );
}

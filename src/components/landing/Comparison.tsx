import { SectionHead } from "./SectionHead";

export function Comparison({ brand }: { brand: string }) {
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
          <div className="cell label" data-label="Per-student cost">
            Commission per lesson
          </div>
          <div className="cell" data-label="Tutoring centres">
            <span className="m">40–60%</span> of every hour
          </div>
          <div className="cell us" data-label={brand}>
            <span className="m">0%</span> after the match fee
          </div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">
            Match fee
          </div>
          <div className="cell" data-label="Tutoring centres">
            Bundled into the centre&apos;s rate
          </div>
          <div className="cell us" data-label={brand}>
            <span className="m">$20</span> flat, once per match
          </div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">
            Who picks the tutor
          </div>
          <div className="cell" data-label="Tutoring centres">
            Centre assigns
          </div>
          <div className="cell us" data-label={brand}>
            You pick
          </div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">
            Who sets the rate
          </div>
          <div className="cell" data-label="Tutoring centres">
            The centre
          </div>
          <div className="cell us" data-label={brand}>
            The tutor
          </div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">
            Lock-in
          </div>
          <div className="cell" data-label="Tutoring centres">
            Term commitments
          </div>
          <div className="cell us" data-label={brand}>
            None
          </div>
        </div>
        <div className="row">
          <div className="cell label" data-label="Per-student cost">
            10-week term, 1hr/wk @ $50
          </div>
          <div className="cell" data-label="Tutoring centres">
            Total paid: <span className="m">≈ $500</span> · Tutor nets <span className="m">≈ $250</span>
          </div>
          <div className="cell us" data-label={brand}>
            Total paid: <span className="m">$500</span> · Tutor nets <span className="m">$480</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { SectionHead } from "./SectionHead";

export function Comparison({ brand }: { brand: string }) {
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="Compare"
        heading="What you'd pay elsewhere."
        brandWords={1}
        lede="No spin — tutoring centres vs. a directory, for the same hour with the same student. The table covers both sides: what it costs a parent, and what it costs a tutor."
      />
      <div className="compare reveal">
        <div className="row head">
          <div className="cell label">How it compares</div>
          <div className="cell">Tutoring centres</div>
          <div className="cell us">{brand}</div>
        </div>
        <div className="row">
          <div className="cell label">
            Cost to parent (to the platform)
          </div>
          <div className="cell" data-label="Tutoring centres">
            Bundled into the centre&apos;s rate
          </div>
          <div className="cell us" data-label={brand}>
            <span className="m">$0</span> — always free for parents
          </div>
        </div>
        <div className="row">
          <div className="cell label">
            Commission per lesson
          </div>
          <div className="cell" data-label="Tutoring centres">
            <span className="m">40–60%</span> of every hour, forever
          </div>
          <div className="cell us" data-label={brand}>
            <span className="m">0%</span> — we never touch your lesson
          </div>
        </div>
        <div className="row">
          <div className="cell label">
            Tutor commission per match
          </div>
          <div className="cell" data-label="Tutoring centres">
            N/A (centre owns the relationship)
          </div>
          <div className="cell us" data-label={brand}>
            First match <span className="m">free</span>, then <span className="m">$20</span> per confirmed student
          </div>
        </div>
        <div className="row">
          <div className="cell label">
            Who picks the tutor
          </div>
          <div className="cell" data-label="Tutoring centres">
            Centre assigns
          </div>
          <div className="cell us" data-label={brand}>
            You pick — listings are local, ranked algorithmically
          </div>
        </div>
        <div className="row">
          <div className="cell label">
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
          <div className="cell label">
            Lock-in
          </div>
          <div className="cell" data-label="Tutoring centres">
            Term commitments
          </div>
          <div className="cell us" data-label={brand}>
            None — it&apos;s a directory
          </div>
        </div>
        <div className="row">
          <div className="cell label">
            10-week term, 1hr/wk @ $50
          </div>
          <div className="cell" data-label="Tutoring centres">
            Parent paid: <span className="m">≈ $500</span> · Tutor net: <span className="m">≈ $250</span>
          </div>
          <div className="cell us" data-label={brand}>
            Parent paid: <span className="m">$500</span> · Tutor net: <span className="m">$500</span> (first student free)
          </div>
        </div>
      </div>
    </section>
  );
}

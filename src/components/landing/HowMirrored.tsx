import { SectionHead } from "./SectionHead";

export function HowMirrored() {
  return (
    <section className="section-pad" id="how-mirrored">
      <SectionHead
        eyebrow="How it works"
        heading="Pick your side."
        brandWords={1}
        lede="Parent on the left, tutor on the right. Parents pay nothing. Tutors pay $20 only when a real student comes through — and the first one's free."
      />
      <div className="how-grid">
        <div className="how-col reveal d1" id="parent-how">
          <span className="badge">For parents</span>
          <h3>Browse, connect, deal directly.</h3>
          <div className="how-step">
            <span className="num">01</span>
            <span className="body">
              <b>Browse free.</b> Filter by subject, suburb, ATAR, in-person vs. online.
            </span>
          </div>
          <div className="how-step">
            <span className="num">02</span>
            <span className="body">
              <b>Pick your tutor.</b> Open as many profiles as you like — compare and shortlist.
            </span>
          </div>
          <div className="how-step">
            <span className="num">03</span>
            <span className="body">
              <b>Get their contact details — free.</b> Click &ldquo;I want this tutor&rdquo; and their name, phone
              and email are yours. No fee, no account needed.
            </span>
          </div>
          <div className="how-step">
            <span className="num">04</span>
            <span className="body">
              <b>Reach out directly.</b> Email or call the tutor and arrange a first lesson — rate, schedule and
              place are between you.
            </span>
          </div>
          <div className="how-step">
            <span className="num">05</span>
            <span className="body">
              <b>No fees, ever.</b> TUTUMatch never charges parents — not to browse, not to connect, not per
              lesson.
            </span>
          </div>
        </div>
        <div className="how-divider" aria-hidden="true" />
        <div className="how-col reveal d2" id="tutor-how">
          <span className="badge">For tutors</span>
          <h3>List, get matched, keep teaching.</h3>
          <div className="how-step">
            <span className="num">01</span>
            <span className="body">
              <b>List for free.</b> Profile, subjects, hourly rate, suburbs you&apos;ll travel to.
            </span>
          </div>
          <div className="how-step">
            <span className="num">02</span>
            <span className="body">
              <b>Go live.</b> A quick spam-and-abuse check, then your listing is public. No credential checks, no
              &ldquo;verified&rdquo; badge.
            </span>
          </div>
          <div className="how-step">
            <span className="num">03</span>
            <span className="body">
              <b>A parent picks you.</b> They get your contact details and reach out. Your listing pauses for 48
              hours while you two talk.
            </span>
          </div>
          <div className="how-step">
            <span className="num">04</span>
            <span className="body">
              <b>Confirm the match.</b> Booked a lesson? Self-report it. Your first student is free; after that
              it&apos;s a flat <span className="m">$20</span> per confirmed student.
            </span>
          </div>
          <div className="how-step">
            <span className="num">05</span>
            <span className="body">
              <b>Keep 100% of every lesson, forever.</b> Set your rate. Raise it whenever.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

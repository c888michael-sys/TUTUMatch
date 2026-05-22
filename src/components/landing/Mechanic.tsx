import { SectionHead } from "./SectionHead";
import { DiscountIcon, HandshakeIcon, UnlockIcon } from "./icons";

export function Mechanic() {
  return (
    <section className="section-pad" id="how-20-works">
      <SectionHead
        eyebrow="For tutors"
        heading="What you pay."
        brandWords={2}
        lede="Parents never pay TUTUMatch a cent — this part is about the tutor side. The only money the platform ever takes is your commission: $20 per confirmed student, charged only once a real student comes through. Your first match is on us."
      />

      <div className="mechanic-grid">
        <div className="step reveal d1">
          <div className="ico">
            <UnlockIcon />
          </div>
          <div className="step-n">Step 01</div>
          <h3>A parent picks you</h3>
          <p>
            They click &ldquo;I want this tutor&rdquo; and get your contact details — free for them. Your listing
            pauses for 48 hours so you can talk without competing enquiries. You&apos;ve paid nothing.
          </p>
        </div>
        <div className="step reveal d2">
          <div className="ico">
            <HandshakeIcon />
          </div>
          <div className="step-n">Step 02</div>
          <h3>You teach the lesson</h3>
          <p>
            You and the parent agree the rate, schedule and place directly. You keep 100% of what you charge —
            TUTUMatch never takes a cut of a lesson.
          </p>
        </div>
        <div className="step reveal d3">
          <div className="ico">
            <DiscountIcon />
          </div>
          <div className="step-n">Step 03</div>
          <h3>You pay $20 — once per confirmed student</h3>
          <p>
            Your first matched student is free. From the second onwards, a flat $20 when the match is confirmed —
            or $15 if you self-report it honestly. No subscription, no per-lesson cut, ever.
          </p>
        </div>
      </div>

      <div className="honesty reveal">
        <div className="tag">Why it works this way</div>
        <p>
          Charging you a flat fee <b>only when a student actually commits</b> keeps the directory free for parents
          and risk-free for you — no upfront cost, no subscription. <b>You only pay once you&apos;ve been paid.</b>
        </p>
      </div>

      <div className="receipt reveal">
        <div className="row muted">
          <span>List your profile</span>
          <span>$0.00</span>
        </div>
        <div className="row muted">
          <span>Your first matched student</span>
          <span>$0.00</span>
        </div>
        <div className="row">
          <span>Each student after that</span>
          <span>$20.00</span>
        </div>
        <div className="row">
          <span>…or, self-reported honestly</span>
          <span className="neg">$15.00</span>
        </div>
        <div className="row total">
          <span>TUTUMatch&apos;s cut of your lesson fees</span>
          <span className="pos">$0</span>
        </div>
      </div>
    </section>
  );
}

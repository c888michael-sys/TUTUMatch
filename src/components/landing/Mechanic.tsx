import { SectionHead } from "./SectionHead";
import { DiscountIcon, HandshakeIcon, UnlockIcon } from "./icons";

export function Mechanic() {
  return (
    <section className="section-pad" id="how-20-works">
      <SectionHead
        eyebrow="The mechanic"
        heading="$20, explained."
        brandWords={1}
        lede="The $20 is the tutor's commission — and only when a real student comes through. Parents pay nothing, ever. A tutor's first matched student is free; after that it's $20 a match, or $15 if they self-report honestly."
      />

      <div className="mechanic-grid">
        <div className="step reveal d1">
          <div className="ico">
            <UnlockIcon />
          </div>
          <div className="step-n">Step 01</div>
          <h3>A parent picks a tutor</h3>
          <p>
            They click &ldquo;I want this tutor&rdquo; and get the tutor&apos;s name, phone and email — free, no
            account hoops. The platform takes nothing from the parent.
          </p>
        </div>
        <div className="step reveal d2">
          <div className="ico">
            <HandshakeIcon />
          </div>
          <div className="step-n">Step 02</div>
          <h3>They arrange the lesson directly</h3>
          <p>
            Rate, schedule, location — all between the parent and the tutor. Once the introduction is made,
            TUTUMatch steps out of the way.
          </p>
        </div>
        <div className="step reveal d3">
          <div className="ico">
            <DiscountIcon />
          </div>
          <div className="step-n">Step 03</div>
          <h3>The tutor pays $20 — only on a real match</h3>
          <p>
            The tutor&apos;s first matched student is free. From the second onwards it&apos;s a flat $20 per
            confirmed match — or $15 if they self-report it honestly. No per-lesson cut, ever.
          </p>
        </div>
      </div>

      <div className="honesty reveal">
        <div className="tag">Why it works this way</div>
        <p>
          Charging the tutor a flat fee <b>only when a student actually commits</b> keeps the directory free for
          parents and risk-free for tutors — no upfront cost, no subscription, no per-lesson cut.{" "}
          <b>You only pay once you&apos;ve been paid.</b>
        </p>
      </div>

      <div className="receipt reveal">
        <div className="row muted">
          <span>List a profile</span>
          <span>$0.00</span>
        </div>
        <div className="row muted">
          <span>First matched student</span>
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
          <span>Per-lesson cut, ever</span>
          <span className="pos">$0</span>
        </div>
      </div>
    </section>
  );
}

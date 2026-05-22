import { SectionHead } from "./SectionHead";
import { DiscountIcon, HandshakeIcon, UnlockIcon } from "./icons";

export function Mechanic() {
  return (
    <section className="section-pad" id="how-20-works">
      <SectionHead
        eyebrow="For tutors"
        heading="How it works."
        brandWords={2}
        lede="Three steps. List yourself for free, a parent picks you, and you pay a single $20 commission for that student — only ever when a real student comes through. Your first one is on us."
      />

      <div className="mechanic-grid">
        <div className="step reveal d1">
          <div className="ico">
            <UnlockIcon />
          </div>
          <div className="step-n">Step 01</div>
          <h3>Put your profile up</h3>
          <p>
            List your subjects, rate, availability and the area you tutor in. It&apos;s free — no listing fee and
            no subscription, ever.
          </p>
        </div>
        <div className="step reveal d2">
          <div className="ico">
            <HandshakeIcon />
          </div>
          <div className="step-n">Step 02</div>
          <h3>A parent picks you</h3>
          <p>
            They get your contact details and reach out directly. You agree the rate, schedule and place between
            yourselves — TUTUMatch stays out of it.
          </p>
        </div>
        <div className="step reveal d3">
          <div className="ico">
            <DiscountIcon />
          </div>
          <div className="step-n">Step 03</div>
          <h3>Teach the lesson — pay a one-time $20</h3>
          <p>
            You keep 100% of what you charge. For that student, TUTUMatch takes a single $20 commission — once,
            not per lesson. Your first matched student is free.
          </p>
        </div>
      </div>

      <div className="honesty reveal">
        <div className="tag">Why it works this way</div>
        <p>
          You only ever pay <b>once you&apos;ve actually got a student</b> — no upfront cost, no subscription, no
          cut of your lessons. If a parent never picks you, TUTUMatch never charges you a cent.
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
          <span>$20.00 once</span>
        </div>
        <div className="row total">
          <span>TUTUMatch&apos;s cut of your lesson fees</span>
          <span className="pos">$0</span>
        </div>
      </div>
    </section>
  );
}

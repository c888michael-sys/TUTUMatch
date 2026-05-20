import { SectionHead } from "./SectionHead";

export function HowMirrored() {
  return (
    <section className="section-pad" id="how-mirrored">
      <SectionHead
        eyebrow="How it works"
        heading="Pick your side."
        brandWords={1}
        lede="Tutor on the left, parent on the right — mirrored steps, same single $20 in the middle. After that, you talk to each other."
      />
      <div className="how-grid">
        <div className="how-col reveal d1" id="tutor-how">
          <span className="badge">For tutors</span>
          <h3>List, get unlocked, keep teaching.</h3>
          <div className="how-step">
            <span className="num">01</span>
            <span className="body">
              <b>List for free.</b> Profile, subjects, hourly rate, suburbs you&apos;ll travel to.
            </span>
          </div>
          <div className="how-step">
            <span className="num">02</span>
            <span className="body">
              <b>Get verified.</b> WWCC, photo ID, HSC/ATAR scans — manual review in 48 hrs.
            </span>
          </div>
          <div className="how-step">
            <span className="num">03</span>
            <span className="body">
              <b>A parent unlocks you.</b> Our <span className="m">$20</span> commission is collected from them, held
              for you.
            </span>
          </div>
          <div className="how-step">
            <span className="num">04</span>
            <span className="body">
              <b>Discount the first lesson by $20.</b> Your invoicing prompts this. The held $20 is released to us.
            </span>
          </div>
          <div className="how-step">
            <span className="num">05</span>
            <span className="body">
              <b>Keep 100% of every lesson, forever.</b> Set your rate. Raise it whenever.
            </span>
          </div>
        </div>
        <div className="how-divider" aria-hidden="true" />
        <div className="how-col reveal d2" id="parent-how">
          <span className="badge">For parents</span>
          <h3>Browse, unlock, deal directly.</h3>
          <div className="how-step">
            <span className="num">01</span>
            <span className="body">
              <b>Browse free.</b> Filter by subject, suburb, ATAR, in-person vs. online.
            </span>
          </div>
          <div className="how-step">
            <span className="num">02</span>
            <span className="body">
              <b>Pick your tutor.</b> Open as many profiles as you like, message them through the platform first.
            </span>
          </div>
          <div className="how-step">
            <span className="num">03</span>
            <span className="body">
              <b>
                Pay <span className="m">$20</span> to unlock.
              </b>{" "}
              That reveals their contact details. We hold the funds.
            </span>
          </div>
          <div className="how-step">
            <span className="num">04</span>
            <span className="body">
              <b>Get $20 off your first lesson.</b> The tutor applies the discount.{" "}
              <span className="m">Net cost: $0.</span>
            </span>
          </div>
          <div className="how-step">
            <span className="num">05</span>
            <span className="body">
              <b>Deal directly from there.</b> No further platform fees, ever.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

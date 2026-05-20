import { SectionHead } from "./SectionHead";
import { DiscountIcon, HandshakeIcon, UnlockIcon } from "./icons";

export function Mechanic() {
  return (
    <section className="section-pad" id="how-20-works">
      <SectionHead
        eyebrow="The mechanic"
        heading="$20, explained."
        brandWords={1}
        lede="The $20 is the tutor's commission to us. We collect it through the parent as an escrow so tutors can't take the introduction and disappear. The first lesson is discounted by $20 to reimburse the parent. Net cost to the parent: $0."
      />

      <div className="mechanic-grid">
        <div className="step reveal d1">
          <div className="ico">
            <UnlockIcon />
          </div>
          <div className="step-n">Step 01</div>
          <h3>Parent unlocks the tutor</h3>
          <p>
            Pay $20 to reveal the tutor&apos;s name, mobile and email. We hold the funds until the first lesson is
            done.
          </p>
        </div>
        <div className="step reveal d2">
          <div className="ico">
            <DiscountIcon />
          </div>
          <div className="step-n">Step 02</div>
          <h3>Tutor discounts the first lesson by $20</h3>
          <p>
            Built into onboarding — they apply it to the first invoice. We release the held funds to the tutor as our
            commission.
          </p>
        </div>
        <div className="step reveal d3">
          <div className="ico">
            <HandshakeIcon />
          </div>
          <div className="step-n">Step 03</div>
          <h3>Deal directly, forever after</h3>
          <p>
            Tutor sets the rate. Parent pays the tutor. No further fees, no per-lesson cut, no platform between you.
            Ever.
          </p>
        </div>
      </div>

      <div className="honesty reveal">
        <div className="tag">Why it works this way</div>
        <p>
          The $20 is the <b>tutor&apos;s commission to us</b>, but we collect it through the parent so tutors
          can&apos;t take an introduction and disappear. The first-lesson discount is how the tutor pays us back.{" "}
          <b>Net cost to the parent: $0.</b>
        </p>
      </div>

      <div className="receipt reveal">
        <div className="row muted">
          <span>Unlock — Daniel L.</span>
          <span>$20.00</span>
        </div>
        <div className="row muted">
          <span>First lesson · 1hr @ $65</span>
          <span>$65.00</span>
        </div>
        <div className="row">
          <span>Tutor&apos;s first-lesson discount</span>
          <span className="neg">−$20.00</span>
        </div>
        <div className="row total">
          <span>Parent pays the tutor</span>
          <span>$45.00</span>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <span>Net cost vs centre</span>
          <span className="pos">$0 extra</span>
        </div>
      </div>
    </section>
  );
}

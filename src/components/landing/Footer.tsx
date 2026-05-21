import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <div className="foot-brand">
            <span className="mark" />
            TUTUMatch
          </div>
          <p className="foot-blurb">
            An NSW tutor directory. Free for parents — listings are tutor-provided. Tutors pay only when a real
            student is confirmed.
          </p>
        </div>
        <div>
          <h5>Product</h5>
          <ul>
            <li>
              <Link href="/browse">Browse tutors</Link>
            </li>
            <li>
              <Link href="/tutor/signup">For tutors</Link>
            </li>
            <li>
              <Link href="/how-it-works">How it works</Link>
            </li>
            <li>
              <Link href="/schools/killara">Schools</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5>About</h5>
          <ul>
            <li>
              <Link href="/what-we-are">What TUTUMatch is (and isn&apos;t)</Link>
            </li>
            <li>
              <Link href="/legal/child-safety">Child-safety policy</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5>Legal</h5>
          <ul>
            <li>
              <Link href="/legal/privacy">Privacy policy</Link>
            </li>
            <li>
              <Link href="/legal/terms">Terms of service</Link>
            </li>
            <li>
              <Link href="/legal/child-safety">Child safety</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5>Contact</h5>
          <ul>
            <li>
              <Link href="/contact">Get in touch</Link>
            </li>
            <li>
              <a href="mailto:hello@tutumatch.com.au">hello@tutumatch.com.au</a>
            </li>
            <li>
              <a href="mailto:safety@tutumatch.com.au">safety@tutumatch.com.au</a>
            </li>
            <li>
              <a href="mailto:appeals@tutumatch.com.au">appeals@tutumatch.com.au</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="foot-disclaimer">
        <p>
          <strong>TUTUMatch is a classifieds directory, not a tutoring provider.</strong> Listings are
          tutor-provided. TUTUMatch does not verify, vet, or screen tutors and makes no representation about
          tutor identity, qualifications, or Working With Children Check status. Parents are responsible for
          verifying a tutor&apos;s WWCC directly with the{" "}
          <a href="https://www.kidsguardian.nsw.gov.au/working-with-children/check-an-employee-or-volunteer" target="_blank" rel="noopener noreferrer">
            NSW Office of the Children&apos;s Guardian
          </a>{" "}
          before any lesson. Lessons are arranged privately between parent and tutor — public libraries are
          strongly recommended. See our <Link href="/legal/terms">Terms of Service</Link>,{" "}
          <Link href="/what-we-are">What TUTUMatch is (and isn&apos;t)</Link>, and{" "}
          <Link href="/legal/child-safety">Child Safety Policy</Link> for full detail.
        </p>
        <p className="foot-beta-note">
          Early beta. We&apos;re a small team learning as we go — please report any issues to{" "}
          <a href="mailto:hello@tutumatch.com.au">hello@tutumatch.com.au</a>.
        </p>
      </div>
      <div className="foot-bottom">
        <span>ABN 00 000 000 000 · Made in NSW</span>
        <span>© 2026 TUTUMatch</span>
      </div>
    </footer>
  );
}

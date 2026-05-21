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
            A flat-fee NSW tutor marketplace. No per-lesson cut, ever. Tutors and parents deal directly.
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
          <h5>Trust</h5>
          <ul>
            <li>
              <a href="#">Verification</a>
            </li>
            <li>
              <a href="#">5-day guarantee</a>
            </li>
            <li>
              <Link href="/legal/child-safety">Safety policy</Link>
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
      <div className="foot-bottom">
        <span>ABN 00 000 000 000 · Made in NSW</span>
        <span>© 2026 TUTUMatch</span>
      </div>
    </footer>
  );
}

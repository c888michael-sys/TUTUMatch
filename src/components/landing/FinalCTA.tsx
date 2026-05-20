import Link from "next/link";
import { ArrowIcon } from "./icons";
import type { School } from "@/lib/schools";

export function FinalCTA({ school }: { school: School }) {
  return (
    <section className="final">
      <div className="final-inner">
        <div className="final-tagline">
          Free to list<span className="sep" />
          Free to browse<span className="sep" />
          $20 to connect
        </div>
        <div className="final-grid">
          <div className="final-half reveal d1">
            <div className="eyebrow on-ink">For tutors</div>
            <h3 className="heading">Keep what you earn. Start in six minutes.</h3>
            <p className="sub">
              List for free, pass verification, get paid directly. We charge $20 once per match — never again.
            </p>
            <div>
              <Link className="btn brand lg" href="/tutor/signup">
                Start tutoring <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="v-divider" aria-hidden="true" />
          <div className="final-half reveal d2">
            <div className="eyebrow on-ink">For parents</div>
            <h3 className="heading">
              Find a tutor{school.id === "default" ? "" : ` at ${school.name}`}.
            </h3>
            <p className="sub">
              Browse free. Pay $20 only when you unlock a tutor&apos;s contact details — and get it back as a
              first-lesson discount.
            </p>
            <div>
              <Link className="btn white lg" href="/browse">
                Find a tutor <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { TopNav } from "@/components/nav/TopNav";

export const metadata = { title: "How TUTUMatch works · TUTUMatch" };

export default function HowItWorksPage() {
  return (
    <>
      <TopNav />
      <main className="page-shell content-shell">
        <h1>How TUTUMatch works</h1>
        <p className="content-lede">
          TUTUMatch is a classifieds directory for NSW tutors. Parents browse and make contact
          completely free. Tutors list for free and only ever pay when a real student is confirmed —
          and the first matched student is on us.
        </p>

        <h2>If you&apos;re a parent or student</h2>
        <ol className="how-list">
          <li>
            <strong>Browse for free.</strong> Open <Link href="/browse">/browse</Link> or pick your
            school. Filter by subject, year level, ATAR, rate, and days available. No account, no
            fee.
          </li>
          <li>
            <strong>Read profiles for free.</strong> Every listing shows the tutor&apos;s subjects,
            year levels, rate, suburb, and a bio. Listings are written by the tutors themselves.
          </li>
          <li>
            <strong>Contact the tutor directly.</strong> When you&apos;ve found someone, get their
            contact details and reach out. There&apos;s no platform fee and no middleman — from here
            on you deal with the tutor directly.
          </li>
          <li>
            <strong>Verify, then arrange the lesson.</strong> Ask the tutor for their Working With
            Children Check and verify it yourself with the NSW Office of the Children&apos;s
            Guardian — it&apos;s free and takes about 30 seconds. Then agree the time, place, and
            rate directly. Public libraries are strongly recommended.
          </li>
        </ol>
        <p>
          Parents never pay TUTUMatch anything. Read the{" "}
          <Link href="/legal/child-safety">Child Safety Policy</Link> before booking — it walks
          through exactly how to check a WWCC and choose a safe location.
        </p>

        <h2>If you&apos;re a tutor</h2>
        <ol className="how-list">
          <li>
            <strong>List for free.</strong> Fill in <Link href="/tutor/signup">/tutor/signup</Link>:
            your subjects and year levels, your rate, your availability, the area you tutor in, and a
            bio. There is no listing fee, ever.
          </li>
          <li>
            <strong>Go live.</strong> Your listing appears in browse after a quick spam-and-abuse
            check. TUTUMatch does not verify your credentials and shows no &ldquo;verified&rdquo;
            badge — your listing is presented as your own.
          </li>
          <li>
            <strong>Your first matched student is free.</strong> When a parent picks you, you pay
            nothing for that first match — our way of letting you prove the directory works before
            you spend a cent.
          </li>
          <li>
            <strong>After that, $20 per confirmed match.</strong> From your second student onwards,
            TUTUMatch charges a flat $20 when a match is confirmed — or $15 if you self-report the
            match honestly. No subscription, no per-lesson cut. Prefer to skip per-match fees?
            TUTUMatch Permanent is a one-time $60 — list forever, no commissions (it pays for itself
            at your fourth student).
          </li>
          <li>
            <strong>Report honestly.</strong> When a parent contacts you, you have 48 hours to tell
            us whether it led to a lesson. Honest self-reporting earns the $15 rate and keeps your
            listing visible. Claiming &ldquo;no match&rdquo; when there was one risks a strike on
            your listing.
          </li>
        </ol>

        <h2>How TUTUMatch makes money</h2>
        <p>
          The only money the platform ever sees is the $20 commission a tutor pays when a real
          student is confirmed — or $15 with honest self-reporting, or a one-time $60 for TUTUMatch
          Permanent. Parents pay nothing. We don&apos;t take a percentage of any lesson. Once a
          parent and tutor are in touch, the arrangement is entirely theirs.
        </p>

        <h2>Safety</h2>
        <p>
          TUTUMatch is a directory — we publish tutor-supplied listings, and we do{" "}
          <strong>not</strong> verify, vet, or screen tutors. Before any lesson, parents should
          verify the tutor&apos;s WWCC directly with the{" "}
          <a
            href="https://www.kidsguardian.nsw.gov.au/working-with-children/check-an-employee-or-volunteer"
            target="_blank"
            rel="noopener noreferrer"
          >
            NSW Office of the Children&apos;s Guardian
          </a>
          . Lesson locations are arranged privately —{" "}
          <strong>public libraries are strongly recommended</strong>: safe, quiet, free, and
          well-supervised. Any user can report a listing; we review reports and can remove listings
          from the directory. Our full guidance is in the{" "}
          <Link href="/legal/child-safety">Child Safety Policy</Link>.
        </p>

        <h2>What TUTUMatch is — and isn&apos;t</h2>
        <p>
          TUTUMatch is a classifieds directory, like the trades or jobs listings you already know.
          We are not a tutoring provider, not the tutor&apos;s employer or agent, not a party to any
          lesson, and not a guarantor of any academic outcome. The full picture is on our{" "}
          <Link href="/what-we-are">What TUTUMatch is (and isn&apos;t)</Link> page.
        </p>

        <h2>Read the policies</h2>
        <ul className="content-link-list">
          <li>
            <Link href="/what-we-are">What TUTUMatch is (and isn&apos;t)</Link>
          </li>
          <li>
            <Link href="/legal/terms">Terms of Service</Link>
          </li>
          <li>
            <Link href="/legal/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/legal/child-safety">Child Safety Policy</Link>
          </li>
        </ul>
      </main>
    </>
  );
}

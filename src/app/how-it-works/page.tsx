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
          A flat-fee tutor marketplace. We don&apos;t take a cut of any lesson. Tutors list free, parents browse
          free, and the only money TUTUMatch ever sees is the one-time $20 fee when a parent decides to contact a
          specific tutor — and even that comes back as a $20 discount on the first lesson.
        </p>

        <h2>If you&apos;re a parent or student</h2>
        <ol className="how-list">
          <li>
            <strong>Browse for free.</strong> Open <Link href="/browse">/browse</Link> or pick your school
            (Killara, Masada, or Other Locations). Filter by subject, year level, ATAR, rate, days available.
          </li>
          <li>
            <strong>Read profiles for free.</strong> Every tutor shows their HSC subjects + bands, year levels
            they teach, rate, suburb, and a bio. No login required.
          </li>
          <li>
            <strong>Pay $20 once, only when you&apos;ve picked one.</strong> The $20 unlocks their full name,
            phone, and email, and opens an in-platform chat. Stripe handles the payment.
          </li>
          <li>
            <strong>The tutor takes $20 off your first lesson.</strong> Net cost of the unlock = $0.
          </li>
          <li>
            <strong>If something falls through, you get the $20 back.</strong> Full refund if no agreement is
            reached for any reason. If the tutor doesn&apos;t reply within 5 days, the refund happens
            automatically — no forms, no chasing.
          </li>
        </ol>

        <h2>If you&apos;re a tutor</h2>
        <ol className="how-list">
          <li>
            <strong>List for free.</strong> Fill in <Link href="/tutor/signup">/tutor/signup</Link>: your HSC
            results, the subjects + year levels you can teach, your rate, your availability, and which area you&apos;d
            tutor in.
          </li>
          <li>
            <strong>Upload your verification documents.</strong> Photo ID, WWCC card / letter, NESA HSC Record of
            Achievement. Only TUTUMatch admins can see them. Manual review takes ~48 hours.
          </li>
          <li>
            <strong>Once approved, you appear in browse.</strong> Parents can read your profile and contact you
            after they pay $20.
          </li>
          <li>
            <strong>Apply the $20 first-lesson discount.</strong> On every new parent&apos;s first invoice. After
            that, you keep 100% of every lesson, forever.
          </li>
          <li>
            <strong>Reply within 5 days.</strong> If you go silent on a parent who&apos;s already paid, they get
            an automatic refund and your account is suspended pending appeal.
          </li>
        </ol>

        <h2>How TUTUMatch makes money</h2>
        <p>
          The $20 unlock fee is the only money the platform ever sees. It pays for hosting, document verification,
          and Stripe processing. We don&apos;t take a percentage of any lesson. Once you&apos;ve been introduced,
          we&apos;re not in the loop — you and the tutor sort everything else out directly.
        </p>

        <h2>Safety</h2>
        <p>
          Every tutor clears a WWCC check, a government ID match, and a manual HSC document review before going
          live. Tutors must be 18 or older — under-18 applications are auto-rejected on submission. Any user can
          report a profile or message; we review reports manually and can suspend accounts.
        </p>
        <p>
          Lesson locations are up to you and the tutor. <strong>Public libraries are strongly recommended</strong>
          {" "}— safe, quiet, free, and well-supervised. TUTUMatch verifies tutors but does not choose where
          lessons happen and is not responsible for what happens at any specific lesson. Read our{" "}
          <Link href="/legal/child-safety">Child Safety Policy</Link> for full detail.
        </p>

        <h2>What we are and aren&apos;t</h2>
        <p>
          TUTUMatch is an <strong>introduction service</strong> — we connect parents with tutors and verify each
          tutor&apos;s identity, age, WWCC, and HSC credentials before they appear publicly.
        </p>
        <p>
          We are <strong>not</strong>:
        </p>
        <ul className="what-we-arent">
          <li>the tutor&apos;s employer, agent, or partner</li>
          <li>a party to any lesson — those are private arrangements between parent and tutor</li>
          <li>a supervisor of any lesson location or interaction</li>
          <li>a guarantor of any specific academic outcome (ATAR, marks, university admission)</li>
          <li>responsible for what happens before, during, or after any lesson</li>
        </ul>
        <p>
          Our liability is contractually limited to the $20 unlock fee per match. The full picture is in our{" "}
          <Link href="/legal/terms">Terms of Service</Link>.
        </p>

        <h2>Read the policies</h2>
        <ul className="content-link-list">
          <li><Link href="/legal/terms">Terms of Service</Link></li>
          <li><Link href="/legal/privacy">Privacy Policy</Link></li>
          <li><Link href="/legal/child-safety">Child Safety Policy</Link></li>
        </ul>
      </main>
    </>
  );
}

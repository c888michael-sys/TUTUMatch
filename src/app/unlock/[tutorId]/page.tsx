import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { ConfirmUnlockButton } from "@/components/unlock/ConfirmUnlockButton";
import { findApplicationById } from "@/lib/db";

export const metadata = { title: "Confirm contact · TUTUMatch" };
export const dynamic = "force-dynamic";

export default async function UnlockPage({ params }: { params: { tutorId: string } }) {
  const app = await findApplicationById(params.tutorId);
  if (!app || app.status !== "APPROVED") notFound();
  const firstName = app.firstName;
  const applicationId = app.id;

  return (
    <>
      <TopNav />
      <main className="page-shell unlock-shell">
        <div className="back-row">
          <Link className="link-like" href={`/tutors/${params.tutorId}`}>← Back to {firstName}&apos;s profile</Link>
        </div>

        <h1>One last thing before we connect you</h1>
        <p className="unlock-lede">
          Contacting <strong>{firstName}</strong> costs a one-time <strong>$20</strong>. Here&apos;s exactly what
          that means, so there are no surprises.
        </p>

        <section className="unlock-card">
          <h2>How the $20 works</h2>
          <ol className="unlock-steps">
            <li>
              <strong>You pay $20 now.</strong> That unlocks {firstName}&apos;s full name, phone, and email, and
              opens an in-platform message thread with them.
            </li>
            <li>
              <strong>If you book a first lesson</strong>, the tutor discounts it by $20 — applied to their first
              invoice. The net cost of the unlock to you is <strong>$0</strong>.
            </li>
            <li>
              <strong>If you don&apos;t reach an agreement</strong> — for any reason at all — the $20 is{" "}
              <strong>fully refunded</strong> to the card you paid with. No phone calls, no admin chasing.
            </li>
            <li>
              <strong>If the tutor doesn&apos;t reply within 5 days</strong>, the refund happens automatically.
              You don&apos;t have to do anything.
            </li>
          </ol>
        </section>

        <section className="unlock-card unlock-card-soft">
          <h2>Why we charge this small fee at all</h2>
          <p>
            The $20 is what keeps TUTUMatch free for tutors to list and free for parents to browse. It also stops
            tutors and parents from circumventing the platform after a referral. Once you&apos;ve unlocked a tutor,
            you talk to them directly — we don&apos;t take any further cut of the lessons themselves.
          </p>
        </section>

        <section className="unlock-disclaimer-card">
          <h2>Before you pay — what TUTUMatch is responsible for, and isn&apos;t</h2>
          <p>
            TUTUMatch is an <strong>introduction service</strong>. We verify each tutor&apos;s identity, WWCC, and
            HSC documents before they appear here. We do <strong>not</strong> employ tutors, supervise lessons, or
            take responsibility for what happens at any specific lesson.
          </p>
          <ul className="disclaimer-list">
            <li>
              <strong>Pick a safe meeting place.</strong> Public libraries are strongly recommended — free, quiet,
              and well-supervised. Avoid private homes for first lessons. The choice of location, and what happens
              there, is between you and the tutor.
            </li>
            <li>
              <strong>No outcome guarantee.</strong> We don&apos;t guarantee teaching quality or academic results.
              Tutors are independent contractors who set their own rates and lesson plans.
            </li>
            <li>
              <strong>Liability is capped at this $20 fee.</strong> If something goes wrong at a lesson, our
              maximum responsibility under our Terms is the unlock fee you paid (per match).
            </li>
            <li>
              <strong>Use the Report button or email{" "}
              <a className="mono-link" href="mailto:safety@tutumatch.com.au">safety@tutumatch.com.au</a></strong>{" "}
              if anything concerning happens. For urgent danger, call <strong>000</strong> first.
            </li>
          </ul>
          <p className="disclaimer-fine">
            Full details: <Link href="/legal/terms">Terms of Service</Link>{" · "}
            <Link href="/legal/child-safety">Child Safety Policy</Link>.
          </p>
        </section>

        <section className="unlock-confirm">
          <ConfirmUnlockButton applicationId={applicationId} tutorFirstName={firstName} />
          <Link className="btn ghost" href={`/tutors/${params.tutorId}`}>
            Not yet — go back to the profile
          </Link>
        </section>

        <p className="unlock-disclaimer">
          By continuing you agree to TUTUMatch&apos;s <Link href="/legal/terms">Terms of Service</Link>, including
          the refund policy described above and on the Terms page. Payments are handled by Stripe — we never see
          your full card details.
        </p>
      </main>
    </>
  );
}

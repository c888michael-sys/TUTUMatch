import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { ConfirmUnlockButton } from "@/components/unlock/ConfirmUnlockButton";
import { findSampleTutor } from "@/lib/sample-tutors";

export const metadata = { title: "Confirm contact · TutMatch" };

export default function UnlockPage({ params }: { params: { tutorId: string } }) {
  const sample = findSampleTutor(params.tutorId);
  if (!sample) notFound();

  return (
    <>
      <TopNav />
      <main className="page-shell unlock-shell">
        <div className="back-row">
          <Link className="link-like" href={`/tutors/${params.tutorId}`}>← Back to {sample.name}&apos;s profile</Link>
        </div>

        <h1>One last thing before we connect you</h1>
        <p className="unlock-lede">
          Contacting <strong>{sample.name}</strong> costs a one-time <strong>$20</strong>. Here&apos;s exactly what
          that means, so there are no surprises.
        </p>

        <section className="unlock-card">
          <h2>How the $20 works</h2>
          <ol className="unlock-steps">
            <li>
              <strong>You pay $20 now.</strong> That unlocks {sample.name.split(" ")[0]}&apos;s full name, phone, and
              email, and opens an in-platform message thread with them.
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
              <strong>If the tutor doesn&apos;t reply within 5 days</strong>, the refund happens automatically. You
              don&apos;t have to do anything.
            </li>
          </ol>
        </section>

        <section className="unlock-card unlock-card-soft">
          <h2>Why we charge this small fee at all</h2>
          <p>
            The $20 is what keeps TutMatch free for tutors to list and free for parents to browse. It also stops
            tutors and parents from circumventing the platform after a referral. Once you&apos;ve unlocked a tutor,
            you talk to them directly — we don&apos;t take any further cut of the lessons themselves.
          </p>
        </section>

        <section className="unlock-confirm">
          <ConfirmUnlockButton tutorId={params.tutorId} tutorFirstName={sample.name.split(" ")[0]} />
          <Link className="btn ghost" href={`/tutors/${params.tutorId}`}>
            Not yet — go back to the profile
          </Link>
        </section>

        <p className="unlock-disclaimer">
          By continuing you agree to TutMatch&apos;s <Link href="/legal/terms">Terms of Service</Link>, including the
          refund policy described above and on the Terms page. Payments are handled by Stripe — we never see your
          full card details.
        </p>
      </main>
    </>
  );
}

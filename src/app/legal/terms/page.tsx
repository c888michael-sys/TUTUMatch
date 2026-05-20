export const metadata = { title: "Terms of Service · TutMatch" };

export default function TermsPage() {
  return (
    <main className="page-shell">
      <h1>Terms of Service</h1>
      <div className="stub-note">
        DRAFT · Not legal advice. Have a lawyer review before launch. Last updated: TBD.
      </div>

      <h2>1. What TutMatch is</h2>
      <p>
        TutMatch is an introduction service that connects parents and students seeking tutoring with independent
        tutors. We verify identity, age, Working With Children Check (WWCC) and HSC/ATAR credentials of tutors before
        they appear on the platform. We are <strong>not</strong> a party to the lessons themselves and do not
        employ, supervise, or guarantee any tutor&apos;s teaching.
      </p>

      <h2>2. The $20 unlock fee</h2>
      <p>
        Browsing tutor profiles is free. To reveal a tutor&apos;s full contact details and message them, the parent
        pays a one-time <strong>AU$20</strong> match fee. The tutor agrees to discount the parent&apos;s first
        lesson by $20 to offset this fee. No further fees apply after the introduction; tutors set their own
        hourly rate and are paid directly by the parent.
      </p>

      <h2>3. Five-day refund right</h2>
      <p>
        If the unlocked tutor does not reply to the parent&apos;s first in-platform message within{" "}
        <strong>5 calendar days</strong> of the unlock, the parent is entitled to a full $20 refund. This is in
        addition to any rights under the Australian Consumer Law.
      </p>

      <h2>4. Tutors are independent contractors</h2>
      <p>
        Tutors are not employees, agents, partners or representatives of TutMatch. Each tutor is responsible for
        their own tax, super, insurance, and conduct. Lesson arrangements are a private contract between the parent
        and the tutor.
      </p>

      <h2>5. Anti-circumvention</h2>
      <p>
        Sharing contact details (phone numbers, email addresses, social handles, etc.) in profiles or pre-unlock
        messages is prohibited and may result in suspension or removal. The $20 fee is the only commission we
        charge; circumventing it is a breach of these Terms.
      </p>

      <h2>6. Child safety</h2>
      <p>
        All tutors hold a current NSW Working With Children Check. We require government-issued ID and HSC/ATAR
        documentation before listing. Concerns about child safety can be reported to{" "}
        <a href="mailto:safety@tutmatch.com.au">safety@tutmatch.com.au</a> and to the NSW Office of the
        Children&apos;s Guardian.
      </p>

      <h2>7. No guarantee of outcomes</h2>
      <p>
        TutMatch makes no representation or warranty about tutor quality, student academic outcomes, or any specific
        result from a lesson or course of lessons.
      </p>

      <h2>8. Liability</h2>
      <p>
        To the extent permitted by law, TutMatch&apos;s liability is limited to the amount of the unlock fee paid
        for the relevant introduction. Nothing here limits any consumer guarantees under the Australian Consumer Law.
      </p>

      <h2>9. Account holders</h2>
      <p>
        If the student is under 18, a parent or legal guardian must hold the account and accept these Terms on the
        student&apos;s behalf.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these Terms. Material changes will be notified by email. Continued use after notice constitutes
        acceptance.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions? <a href="mailto:hello@tutmatch.com.au">hello@tutmatch.com.au</a>.
      </p>
    </main>
  );
}

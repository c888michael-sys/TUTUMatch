import { TopNav } from "@/components/nav/TopNav";

export const metadata = { title: "Terms of Service · TUTUMatch" };

export default function TermsPage() {
  return (
    <>
      <TopNav />
      <main className="page-shell content-shell">
        <h1>Terms of Service</h1>
        <div className="stub-note">
          DRAFT · Not legal advice. Have a lawyer review before launch. Last updated: <strong>{new Date().toISOString().slice(0, 10)}</strong>.
        </div>

        <p className="content-lede">
          By creating an account, listing as a tutor, or paying the unlock fee, you agree to these Terms.
          They&apos;re written plainly. Please read them — particularly sections 7–13, which spell out the limits
          of what TUTUMatch is responsible for.
        </p>

        <h2>1. What TUTUMatch is — and isn&apos;t</h2>
        <p>
          TUTUMatch is an <strong>introduction service</strong>. We help parents and students find tutors. We
          verify each tutor&apos;s identity, age, Working With Children Check (WWCC), and HSC / ATAR credentials
          before their profile appears publicly.
        </p>
        <p>
          We are <strong>not</strong>:
        </p>
        <ul>
          <li>the tutor&apos;s employer, agent, partner, or representative</li>
          <li>a party to any lesson, payment between parent and tutor, or arrangement made after introduction</li>
          <li>a supervisor of any lesson, location, or interaction between users</li>
          <li>a guarantor of tutor quality, teaching effectiveness, or academic outcomes</li>
        </ul>
        <p>
          Tutors are independent contractors. Each tutor is responsible for their own tax, superannuation,
          insurance, conduct, lesson plans, and any agreements they make with parents.
        </p>

        <h2>2. The $20 unlock fee</h2>
        <p>
          Browsing tutor profiles is free. To reveal a tutor&apos;s full contact details and message them through
          the platform, the parent pays a one-time <strong>AU$20</strong> match fee. The tutor agrees to discount
          the parent&apos;s first lesson by $20 to offset this fee, so the net cost of the unlock to the parent is
          $0 once a first lesson is booked.
        </p>
        <p>
          No further fees apply after the introduction. Tutors set their own hourly rate and are paid directly by
          the parent, by whatever method they agree on.
        </p>

        <h2>3. Five-day refund right</h2>
        <p>
          If the unlocked tutor does not reply to the parent&apos;s first in-platform message within{" "}
          <strong>5 calendar days</strong> of the unlock, the parent is entitled to a full $20 refund. The refund
          is processed automatically — no forms, no admin chasing.
        </p>
        <p>
          Parents are also entitled to a full refund if they and the tutor cannot agree on a first lesson within
          14 days of the unlock, for any reason. This is in addition to any rights under the Australian Consumer
          Law.
        </p>

        <h2>4. Anti-circumvention</h2>
        <p>
          Sharing contact details (phone, email, social handles) in profiles, pre-unlock messages, or anywhere on
          the platform before payment is prohibited. The $20 fee is the only commission TUTUMatch charges, and
          attempting to circumvent it — by either tutors or parents — is a breach of these Terms and grounds for
          immediate suspension.
        </p>

        <h2>5. Tutor verification</h2>
        <p>
          We verify the following before a tutor is approved:
        </p>
        <ul>
          <li>Government-issued photo ID</li>
          <li>Valid current NSW Working With Children Check (verified against the NSW Office of the Children&apos;s Guardian)</li>
          <li>NESA HSC Record of Achievement / ATAR notice</li>
          <li>Date of birth (tutors must be 18 or older — under-18 applications are auto-rejected)</li>
        </ul>
        <p>
          We do <strong>not</strong> conduct criminal background checks beyond the WWCC, employment-history
          checks, or vouch for personal character beyond these documents. Verification confirms identity and
          credentials at the time of approval; it does not guarantee future conduct.
        </p>

        <h2>6. Lesson location</h2>
        <p>
          <strong>TUTUMatch does not select or supervise lesson locations.</strong> The parent and tutor choose
          where lessons happen.
        </p>
        <p>
          <strong>We strongly recommend public locations</strong> — public libraries are ideal (safe, quiet, free,
          well-supervised). Community centres, school libraries, or coffee shops in busy areas are also fine.
          Avoid private homes, particularly for first lessons, unless a parent is present throughout.
        </p>
        <p>
          The safety of the chosen location is the parent&apos;s and tutor&apos;s shared responsibility.
          TUTUMatch accepts no responsibility for what happens at any lesson location, including but not limited
          to injury, harassment, theft, property damage, or any incident occurring before, during, or after a
          lesson.
        </p>

        <h2>7. No guarantee of outcomes or quality</h2>
        <p>
          TUTUMatch makes no representation or warranty — express or implied — about:
        </p>
        <ul>
          <li>any tutor&apos;s teaching ability or effectiveness</li>
          <li>the suitability of any tutor for any particular student or subject</li>
          <li>any academic outcome (ATAR, marks, grades, university admission, scholarship)</li>
          <li>the accuracy of tutor-supplied biographical information beyond what we verify in section 5</li>
          <li>continuous availability of any tutor</li>
        </ul>
        <p>
          Tutoring is a service provided by an independent tutor; outcomes depend on the tutor, the student, and
          factors outside the platform&apos;s control.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          <strong>You use TUTUMatch at your own risk.</strong> To the maximum extent permitted by law:
        </p>
        <ul>
          <li>
            TUTUMatch&apos;s total liability arising from or in connection with the platform, your use of it, any
            tutor introduction, or any lesson is <strong>limited to the amount of the unlock fee actually paid
            by you for the relevant tutor</strong> (i.e. AU$20 per match, capped per relevant introduction).
          </li>
          <li>
            TUTUMatch is not liable for any indirect, consequential, special, incidental, or punitive damages, or
            for loss of profit, opportunity, data, or reputation.
          </li>
          <li>
            TUTUMatch is not liable for the acts, omissions, conduct, or content of any tutor, parent, student, or
            third party, whether on or off the platform.
          </li>
          <li>
            TUTUMatch is not liable for any incident occurring at or in connection with a lesson, including
            injury, harassment, abuse, theft, damage, or any criminal act by any party.
          </li>
        </ul>
        <p>
          Nothing in these Terms excludes or limits any consumer guarantee implied by the Australian Consumer Law
          that cannot lawfully be excluded.
        </p>

        <h2>9. Reporting and removal</h2>
        <p>
          Any user can report a profile, message, or other user via the in-app Report button or by emailing{" "}
          <a className="mono-link" href="mailto:safety@tutumatch.com.au">safety@tutumatch.com.au</a>. We review
          reports manually and may suspend or remove accounts at our discretion.
        </p>
        <p>
          For urgent child-safety concerns — including any concern that a child is in immediate danger — contact
          the NSW Police directly on <strong>000</strong> first, then notify us so we can preserve relevant
          platform records and cooperate with authorities.
        </p>

        <h2>10. Child safety policy</h2>
        <p>
          See our separate <a href="/legal/child-safety">Child Safety Policy</a> for the platform&apos;s
          obligations under the Child Protection (Working with Children) Act 2012 (NSW), mandatory reporting
          processes, and how to raise concerns.
        </p>

        <h2>11. Accounts for users under 18</h2>
        <p>
          If the student is under 18, a parent or legal guardian must hold the account and accept these Terms on
          the student&apos;s behalf. Tutors must be 18 or older — applications submitted with a date of birth
          showing the applicant is under 18 are <strong>automatically rejected</strong>.
        </p>

        <h2>12. Privacy</h2>
        <p>
          See our <a href="/legal/privacy">Privacy Policy</a> for how we collect, store, and use personal
          information, including verification documents.
        </p>

        <h2>13. Beta status</h2>
        <p>
          TUTUMatch is currently in <strong>early beta</strong>. The service may have bugs, downtime, or feature
          limitations. We&apos;re a small team learning as we go. By using TUTUMatch during beta, you accept that
          some features (file storage encryption, automated WWCC API integration, transactional email reliability)
          are still being hardened.
        </p>

        <h2>14. Changes</h2>
        <p>
          We may update these Terms. Material changes will be notified by email to your account address.
          Continued use of the platform after that notice constitutes acceptance.
        </p>

        <h2>15. Governing law</h2>
        <p>
          These Terms are governed by the laws of New South Wales, Australia. Any dispute is to be resolved in the
          courts of New South Wales.
        </p>

        <h2>16. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a className="mono-link" href="mailto:hello@tutumatch.com.au">hello@tutumatch.com.au</a>.<br />
          Child safety concerns:{" "}
          <a className="mono-link" href="mailto:safety@tutumatch.com.au">safety@tutumatch.com.au</a>.<br />
          Privacy requests:{" "}
          <a className="mono-link" href="mailto:privacy@tutumatch.com.au">privacy@tutumatch.com.au</a>.<br />
          Account suspended? Appeals:{" "}
          <a className="mono-link" href="mailto:appeals@tutumatch.com.au">appeals@tutumatch.com.au</a>.
        </p>
      </main>
    </>
  );
}

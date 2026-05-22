export const metadata = { title: "Privacy Policy · TUTUMatch" };

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <h1>Privacy Policy</h1>
      <div className="stub-note">
        DRAFT · Not legal advice. Have a lawyer review before launch. Last updated: TBD.
      </div>

      <p>
        This Privacy Policy explains how TUTUMatch (&ldquo;we&rdquo;) handles personal information in accordance
        with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>From tutors:</strong> name, date of birth, suburb, phone, email, government-issued ID (driver&apos;s
          licence or passport), WWCC number + matching details, HSC Record of Achievement / ATAR notice, photo, bio,
          subjects, availability, hourly rate, payment receipt info.
        </li>
        <li>
          <strong>From parents/students:</strong> name, email, and the contact requests you make to tutors.
          Parents make no payment to TUTUMatch.
        </li>
        <li>
          <strong>Automatically:</strong> device, browser, IP address, basic usage analytics.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To publish each tutor&apos;s listing and keep on record the WWCC, ID, and academic details a tutor self-declares. We do not verify these — see our Terms.</li>
        <li>To connect parents with tutors.</li>
        <li>To run match confirmation, tutor commission, and dispute resolution.</li>
        <li>To meet legal obligations (tax, child-safety, complaints).</li>
      </ul>

      <h2>How we store it</h2>
      <p>
        Tutor-provided documents (ID, WWCC, HSC), where a tutor supplies them, are stored encrypted at rest in object storage with admin-only access
        via signed URLs. Payment data is handled exclusively by Stripe. All data is hosted in Australian regions
        where possible.
      </p>

      <h2>Who we share it with</h2>
      <ul>
        <li>Stripe (payments).</li>
        <li>Our email provider for transactional notifications.</li>
        <li>Government or law-enforcement agencies where required by law.</li>
        <li>
          Parents see a tutor&apos;s public profile, and the tutor&apos;s full contact details once they request
          contact. Tutors see the email address of a parent who requests contact.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You may request access to or correction of your personal information at any time:{" "}
        <a href="mailto:privacy@tutumatch.com.au">privacy@tutumatch.com.au</a>. You may also lodge a complaint with the
        OAIC.
      </p>

      <h2>Data breach notification</h2>
      <p>
        We comply with the Notifiable Data Breaches scheme: if a breach is likely to cause serious harm we will
        notify affected users and the OAIC promptly.
      </p>

      <h2>Marketing</h2>
      <p>
        Marketing emails are opt-in (Spam Act 2003). Transactional emails (match notifications, confirmations,
        account notices) are required for the service to function and cannot be unsubscribed from while you hold
        an account.
      </p>

      <h2>Children</h2>
      <p>
        If the student is under 18, the parent/guardian must hold the account. We do not knowingly collect personal
        information from anyone under 18 except via that guardian.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions: <a href="mailto:privacy@tutumatch.com.au">privacy@tutumatch.com.au</a>.
      </p>
    </main>
  );
}

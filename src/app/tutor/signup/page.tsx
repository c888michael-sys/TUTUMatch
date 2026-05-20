export const metadata = { title: "List as a tutor · TutMatch" };

export default function TutorSignupPage() {
  return (
    <main className="page-shell">
      <h1>List as a tutor</h1>
      <div className="stub-note">
        STUB · Multi-step tutor signup. Each section maps directly to <code>TutorProfile</code> fields in
        <code> prisma/schema.prisma</code>.
      </div>
      <h2>Steps</h2>
      <ol>
        <li>
          <strong>Account.</strong> Email + password (plus OAuth). DOB collected for the 18+ age gate.
        </li>
        <li>
          <strong>Personal.</strong> First name, last initial (public), full last name (private). Suburb, postcode,
          phone, email, socials.
        </li>
        <li>
          <strong>Alma mater.</strong> School from the seed list, or &ldquo;Other&rdquo; free-text.
        </li>
        <li>
          <strong>Academic.</strong> ATAR (0–99.95). HSC subjects + band/mark — repeatable rows.
        </li>
        <li>
          <strong>What you teach.</strong> Subjects offered (subset of HSC results), year levels (7–12), lesson mode
          (in-person / online / either).
        </li>
        <li>
          <strong>Pricing.</strong> Hourly rate ($20–$200 guardrails).
        </li>
        <li>
          <strong>Availability.</strong> Day-of-week toggles → expandable time slots per day in 15-minute increments,
          with &ldquo;+ Add another time slot&rdquo;.
        </li>
        <li>
          <strong>Verification uploads.</strong> Government ID, WWCC details (number + name + DOB), HSC Record of
          Achievement / ATAR notice. Stored encrypted at rest, signed URLs only.
        </li>
        <li>
          <strong>Bio.</strong> Free-text. Scanned for contact info (phone, email, social handles) before publishing.
        </li>
      </ol>
      <p>Profile goes into <code>PENDING_REVIEW</code> until admin verifies ID + WWCC + HSC documents.</p>
    </main>
  );
}

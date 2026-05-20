export const metadata = { title: "Child Safety Policy · TUTUMatch" };

export default function ChildSafetyPage() {
  return (
    <main className="page-shell">
      <h1>Child Safety Policy</h1>
      <div className="stub-note">
        DRAFT · Aligned with the National Principles for Child Safe Organisations. Have a lawyer + a child-safety
        professional review before launch.
      </div>

      <h2>Our commitment</h2>
      <p>
        TUTUMatch is committed to the safety, participation, and empowerment of children and young people. We have
        zero tolerance for child abuse and harassment.
      </p>

      <h2>How we vet tutors</h2>
      <ul>
        <li>Working With Children Check (WWCC) verified against the NSW Office of the Children&apos;s Guardian.</li>
        <li>Government photo ID checked against the name on the WWCC.</li>
        <li>Date of birth confirmed — tutors must be 18 or older.</li>
        <li>HSC/ATAR documents manually reviewed before listing.</li>
        <li>Profile photos and bios admin-moderated before going live.</li>
      </ul>

      <h2>Reporting concerns</h2>
      <p>
        If you have any concern about the safety or conduct of a tutor, please contact{" "}
        <a href="mailto:safety@tutumatch.com.au">safety@tutumatch.com.au</a> immediately. If a child is in immediate
        danger call <strong>000</strong>. You can also contact the NSW Office of the Children&apos;s Guardian and,
        for serious concerns, the NSW Police.
      </p>

      <h2>Our response</h2>
      <ul>
        <li>Reports are reviewed within 24 hours.</li>
        <li>Tutors suspended from the platform pending investigation where warranted.</li>
        <li>We cooperate fully with police, child-safety authorities, and the OCG.</li>
        <li>Mandatory reporting laws followed where applicable.</li>
      </ul>

      <h2>Off-platform interactions</h2>
      <p>
        Once a parent unlocks a tutor, contact and payment move off-platform — but this Policy and our verification
        records remain on file. Any concern about subsequent conduct should still be reported to us so we can
        suspend the tutor and assist authorities.
      </p>
    </main>
  );
}

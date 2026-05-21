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
        zero tolerance for child abuse and harassment, on or off the platform.
      </p>

      <h2>What TUTUMatch is</h2>
      <p>
        TUTUMatch is a <strong>classifieds directory</strong>. We publish listings supplied by individual tutors so
        that parents can find them. We do <strong>not</strong> verify, vet, or screen tutors. We do not perform a
        Working With Children Check (WWCC) check, an ID check, a credential check, or any background check. We
        display no &ldquo;verified&rdquo; badge or trust mark, because we do not perform the underlying check.
      </p>

      <h2>What we ask of tutors</h2>
      <p>
        Each tutor agrees, in the Terms of Service they accept at signup, to:
      </p>
      <ul>
        <li>be 18 years of age or older;</li>
        <li>hold a current and valid NSW Working With Children Check (WWCC) for the duration they are listed;</li>
        <li>have a government-issued photo ID matching the name and date of birth registered against that WWCC;</li>
        <li>provide their WWCC number, full WWCC name, and date of birth directly to any parent who asks, before the first lesson;</li>
        <li>list only truthful information about themselves, their qualifications, and their teaching;</li>
        <li>conduct themselves at all times in accordance with the <em>Child Protection (Working with Children) Act 2012 (NSW)</em>, the <em>Children and Young Persons (Care and Protection) Act 1998 (NSW)</em>, and all other applicable child-safety law.</li>
      </ul>
      <p>
        These are tutor obligations. Compliance is the tutor&apos;s responsibility. TUTUMatch retains the tutor&apos;s
        attestation, IP address, user-agent, and Terms version accepted as part of the audit trail.
      </p>

      <h2>What we ask of parents</h2>
      <p>
        Before booking any lesson with a tutor you find on TUTUMatch:
      </p>
      <ol>
        <li>
          <strong>Verify the tutor&apos;s WWCC yourself.</strong> Ask the tutor for their WWCC number and the
          full name and date of birth registered against it, then use the free public lookup operated by the{" "}
          <a href="https://www.kidsguardian.nsw.gov.au/working-with-children/check-an-employee-or-volunteer" target="_blank" rel="noopener noreferrer">
            NSW Office of the Children&apos;s Guardian
          </a>. It takes about 30 seconds. Do not accept a screenshot of a WWCC card in place of a live lookup.
        </li>
        <li>
          <strong>Choose a safe location.</strong> Public libraries are ideal — safe, quiet, free, well-supervised.
          Community centres, school libraries, and coffee shops in busy areas also work. Avoid private homes, in
          either direction, particularly for first lessons.
        </li>
        <li>
          <strong>Stay involved.</strong> For lessons with younger students, consider having a parent or other
          adult present, at least for the first lesson.
        </li>
        <li>
          <strong>Trust your instincts.</strong> If anything feels off — about the tutor&apos;s response to safety
          questions, the location they suggest, or their behaviour — do not proceed with the lesson.
        </li>
      </ol>

      <h2>Reporting concerns</h2>
      <p>
        If a child is in <strong>immediate danger</strong>, call <strong>000</strong>.
      </p>
      <p>
        For non-emergency concerns about the safety or conduct of a tutor listed on TUTUMatch, please email{" "}
        <a href="mailto:safety@tutumatch.com.au">safety@tutumatch.com.au</a>. You can also contact the NSW Office
        of the Children&apos;s Guardian and, for serious concerns, the NSW Police.
      </p>

      <h2>Our response</h2>
      <ul>
        <li>Safety reports are triaged within 24 hours of receipt.</li>
        <li>A tutor who is the subject of a credible safety concern is suspended from the directory pending review.</li>
        <li>We cooperate fully with the NSW Police, the NSW Office of the Children&apos;s Guardian, and any other relevant authority.</li>
        <li>We preserve all relevant platform records (listing content, IP, user-agent, attestations, audit log) and produce them on lawful request.</li>
        <li>Where mandatory-reporting obligations apply to us under NSW law, we comply with them.</li>
      </ul>

      <h2>Off-platform interactions</h2>
      <p>
        Once a parent obtains a tutor&apos;s contact details from TUTUMatch, all subsequent communication and
        arrangements happen between the parent and the tutor directly. TUTUMatch does not host, monitor, or record
        those communications. If a concern arises about a tutor&apos;s conduct after the introduction — including
        conduct during or after a lesson — please still report it to us so that the tutor&apos;s listing can be
        suspended and so we can cooperate with any subsequent investigation.
      </p>
    </main>
  );
}

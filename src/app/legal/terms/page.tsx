import { TopNav } from "@/components/nav/TopNav";
import { TERMS_VERSION } from "@/lib/legal";

export const metadata = { title: "Terms of Service · TUTUMatch" };

export default function TermsPage() {
  return (
    <>
      <TopNav />
      <main className="page-shell content-shell">
        <h1>Terms of Service</h1>
        <div className="stub-note">
          DRAFT · Not legal advice. Have a lawyer review before public launch. Version{" "}
          <strong>{TERMS_VERSION}</strong>.
        </div>

        <p className="content-lede">
          By creating an account or listing as a tutor, you agree to these Terms.
          They&apos;re written plainly. Please read them — particularly sections 7–13, which spell out the limits
          of what TUTUMatch is responsible for.
        </p>

        <h2>1. What TUTUMatch is — and isn&apos;t</h2>
        <p>
          TUTUMatch is a <strong>classifieds directory</strong>. Tutors publish listings here so that parents can
          find them. That is the entirety of the platform&apos;s function.
        </p>
        <p>
          TUTUMatch <strong>does not</strong>:
        </p>
        <ul>
          <li>verify, vet, or screen tutors&apos; identity, age, qualifications, Working With Children Check status, criminal history, or character</li>
          <li>endorse, recommend, rank editorially, or vouch for any tutor</li>
          <li>employ, engage, supervise, or act as agent, partner, or representative of any tutor</li>
          <li>participate in, mediate, or take any cut of any lesson, payment, or arrangement between parent and tutor</li>
          <li>provide tutoring services, host lessons, or facilitate any communication that occurs after a parent has obtained a tutor&apos;s contact details</li>
          <li>guarantee tutor quality, availability, teaching ability, or any academic outcome</li>
        </ul>
        <p>
          Listings on TUTUMatch are <strong>user-generated content</strong> supplied by individual tutors. The
          accuracy of any listing is the responsibility of the tutor who posted it.
        </p>
        <p>
          <strong>No consumer transaction with parents.</strong> Parents do not pay TUTUMatch to browse, search,
          contact, or otherwise use the directory. Whatever a parent later arranges with a tutor — including the
          tutor&apos;s rate, schedule, lesson location, and payment method — is a private arrangement between the
          parent and the tutor to which TUTUMatch is not a party.
        </p>
        <p>
          Tutors are independent contractors. Each tutor is responsible for their own tax, superannuation,
          insurance, conduct, lesson plans, and any agreements they make with parents. Parents must satisfy
          themselves about a tutor&apos;s suitability, qualifications, and WWCC status before booking any lesson
          (see section 5).
        </p>

        <h2>2. Fees</h2>
        <p>
          <strong>Parents pay TUTUMatch nothing.</strong> Browsing the directory, searching, and obtaining a
          tutor&apos;s contact details are all free. There is no parent-side payment of any kind.
        </p>
        <p>
          <strong>Tutors pay a commission only when a real student is confirmed.</strong> Listing is free. A
          tutor&apos;s first confirmed match is free; from the second confirmed match onwards, TUTUMatch charges
          the tutor a flat <strong>AU$20</strong> commission per confirmed match — reduced to <strong>AU$15</strong>{" "}
          where the tutor self-reports the match honestly within the reporting window. TUTUMatch takes no
          percentage of any lesson fee. Tutors set their own hourly rate and are paid directly by the parent, by
          whatever method they agree on.
        </p>

        <h2>3. Confirmed matches and disputes</h2>
        <p>
          A <strong>confirmed match</strong> occurs when a parent who obtained a tutor&apos;s contact details
          through TUTUMatch goes on to book a lesson with that tutor. The tutor may self-report a confirmed
          match; if they do not, the parent is asked to confirm whether a lesson took place.
        </p>
        <p>
          A tutor who believes a commission has been charged in error may dispute it, and disputes are reviewed
          manually by TUTUMatch. Because parents make no payment to TUTUMatch, no parent refund arises under
          these Terms. Nothing in this section limits any right a tutor has under the Australian Consumer Law in
          respect of a commission they paid.
        </p>

        <h2>4. Anti-circumvention</h2>
        <p>
          The tutor commission described in section 2 is the only money TUTUMatch charges. A tutor who takes on a
          student introduced through TUTUMatch and deliberately conceals the match to avoid that commission is in
          breach of these Terms. Repeated or deliberate concealment is grounds for suspension or permanent
          removal from the directory.
        </p>

        <h2>5. What we ask of tutors (and what parents verify themselves)</h2>
        <p>
          <strong>TUTUMatch does not verify any tutor.</strong> Listings are tutor-provided and self-attested. The
          platform performs no identity checks, no Working With Children Check verifications, no credential
          confirmations, no background checks, and no character assessments — at signup or at any later point.
        </p>
        <p>
          The platform <strong>asks</strong> each tutor to have, and to be prepared to provide directly to any
          parent who requests it:
        </p>
        <ul>
          <li>a current and valid NSW Working With Children Check (WWCC) number, together with the full name and date of birth registered against that WWCC</li>
          <li>a government-issued photo ID matching the WWCC details</li>
          <li>truthful information in every field of their listing (subjects, ATAR, year levels taught, area, rate, availability, bio)</li>
        </ul>
        <p>
          Each tutor self-attests, at signup and on accepting these Terms, that they are 18 or older, hold a valid
          WWCC, and will provide WWCC details to any parent who asks. False attestation is a breach of these Terms
          and grounds for permanent suspension; depending on the conduct involved, it may also be reported to the
          NSW Office of the Children&apos;s Guardian, the NSW Police, or other authorities. TUTUMatch retains
          attestation records, IP addresses, and audit logs for this purpose.
        </p>
        <p>
          <strong>Parents must verify each tutor&apos;s WWCC themselves before any lesson</strong>, using the free
          public lookup tool operated by the{" "}
          <a href="https://www.kidsguardian.nsw.gov.au/working-with-children/check-an-employee-or-volunteer" target="_blank" rel="noopener noreferrer">
            NSW Office of the Children&apos;s Guardian
          </a>. The check takes approximately 30 seconds and is free of charge. TUTUMatch displays no verification
          badges, ticks, or trust marks, because TUTUMatch performs no verification.
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

        <h2>7. No guarantee of accuracy, quality, or outcomes</h2>
        <p>
          TUTUMatch makes <strong>no representation or warranty</strong> — express or implied — about:
        </p>
        <ul>
          <li>the accuracy of any information in any tutor listing, including (without limit) identity, age, ATAR, HSC results, school attended, qualifications, subjects taught, suburb, rate, availability, biography, or WWCC status</li>
          <li>any tutor&apos;s teaching ability, experience, or effectiveness</li>
          <li>the suitability of any tutor for any particular student, subject, or learning need</li>
          <li>any academic outcome (ATAR, marks, grades, university admission, scholarship)</li>
          <li>the continuous availability of any tutor, the platform, or any feature of it</li>
        </ul>
        <p>
          Listings are user-generated content. TUTUMatch does not edit, fact-check, or moderate listings for
          accuracy. Parents must conduct their own due diligence on any tutor — including verifying the
          tutor&apos;s WWCC, asking for evidence of qualifications, and forming their own view on suitability —
          before booking a lesson. Tutoring is a service provided by an independent tutor; outcomes depend on the
          tutor, the student, and factors outside the platform&apos;s control.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          <strong>You use TUTUMatch at your own risk.</strong> To the maximum extent permitted by law:
        </p>
        <ul>
          <li>
            TUTUMatch&apos;s total liability arising from or in connection with the platform, your use of it, any
            tutor introduction, or any lesson is <strong>limited, to the maximum extent permitted by law, to
            AU$20</strong>. Parents pay TUTUMatch nothing; a tutor&apos;s liability cap is the greater of AU$20
            and the total commission that tutor has paid TUTUMatch in the 12 months before the claim.
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

        <h2 id="13">13. Tutor indemnity</h2>
        <p>
          This section applies to <strong>tutors</strong>. It is a material part of the bargain — without it,
          TUTUMatch could not justify operating a low-cost directory connecting tutors with parents. By signing
          up as a tutor and accepting it explicitly in the signup form, you agree to the following.
        </p>
        <p>
          You (the <strong>Tutor</strong>) agree to <strong>indemnify, defend at our request, and hold harmless</strong>{" "}
          TUTUMatch and its directors, officers, employees, agents, and contractors (each an{" "}
          <em>Indemnified Party</em>) from and against any and all claims, demands, actions, proceedings, losses,
          damages, liabilities, costs, and expenses (including reasonable legal fees on an indemnity basis, expert
          fees, settlement amounts, and judgment amounts) that any Indemnified Party suffers, incurs, or is
          required to pay arising out of or in connection with:
        </p>
        <ol className="legal-sublist">
          <li>your acts, omissions, conduct, or negligence in providing or offering tutoring services, whether on or off the TUTUMatch platform;</li>
          <li>any incident — including injury, harassment, abuse, theft, property damage, or any criminal act — occurring before, during, or after a lesson facilitated through the platform;</li>
          <li>your breach of these Terms, the <a href="/legal/child-safety">Child Safety Policy</a>, or the <a href="/legal/privacy">Privacy Policy</a>;</li>
          <li>any misrepresentation by you, or inaccuracy in information you supplied, concerning your identity, age, date of birth, qualifications, ATAR, HSC results, WWCC status, prior conduct, or any other profile field;</li>
          <li>any claim by a third party that materials, content, lesson notes, or resources you provided infringe their rights (including intellectual property, privacy, or confidentiality rights);</li>
          <li>your failure to pay any commission due to TUTUMatch, or to issue tax-compliant invoices or receipts to parents;</li>
          <li>any tax, GST, superannuation, insurance, worker&apos;s compensation, or income-reporting obligation arising from your tutoring work that you failed to meet;</li>
          <li>any breach by you of the <em>Child Protection (Working with Children) Act 2012 (NSW)</em>, the <em>Children and Young Persons (Care and Protection) Act 1998 (NSW)</em>, or any related child-safety law;</li>
          <li>any defamatory, harassing, threatening, or unlawful statement you made in messages, profile content, or otherwise on the platform;</li>
          <li>any false statement you made to TUTUMatch in connection with your application, verification, dispute, refund, or account.</li>
        </ol>
        <p>
          This indemnity:
        </p>
        <ul>
          <li><strong>Survives termination</strong> of your account, suspension, or removal from the platform — including for incidents that come to light after your account is closed.</li>
          <li><strong>Is independent of insurance</strong>. TUTUMatch is not required to first exhaust any insurance policy or other remedy before claiming under this indemnity.</li>
          <li><strong>Covers settlement amounts</strong> reasonably entered into by an Indemnified Party where the underlying claim would, if proven, fall within this indemnity.</li>
          <li><strong>Does not extend</strong> to claims caused <strong>solely</strong> by an Indemnified Party&apos;s own negligence or willful misconduct. Where the loss is caused partly by you and partly by TUTUMatch, your liability is reduced proportionately to your share of responsibility.</li>
        </ul>
        <p>
          <strong>Notice and conduct of claims.</strong> If a claim covered by this indemnity is made or
          threatened against any Indemnified Party, TUTUMatch will notify you in writing without unreasonable
          delay. You must, at TUTUMatch&apos;s election, either (i) defend the claim using legal counsel approved
          by TUTUMatch (such approval not to be unreasonably withheld), or (ii) reimburse TUTUMatch&apos;s
          reasonable defence costs and any settlement or judgment amount. You agree to provide all reasonable
          cooperation, information, and documents required for the defence of any claim. TUTUMatch reserves the
          right to participate in or take over the defence of any claim at its own cost.
        </p>

        <h2 id="14">14. Parent / user indemnity</h2>
        <p>
          This section applies to <strong>all users</strong> who are not tutors (parents, students who hold their
          own account, and any other user). You agree to indemnify TUTUMatch and the Indemnified Parties against
          any claims, losses, costs, or damages arising from:
        </p>
        <ol className="legal-sublist">
          <li>your breach of these Terms;</li>
          <li>any false, malicious, or knowingly inaccurate report you submit through the Report button or otherwise;</li>
          <li>any defamatory, abusive, threatening, or unlawful content you post in messages, reports, or other communications on the platform;</li>
          <li>your misuse of any tutor&apos;s contact details obtained through the directory, including unsolicited marketing, spam, or harassment;</li>
          <li>any unauthorised use of your account where the unauthorised use was made possible by your failure to keep credentials secure.</li>
        </ol>
        <p>
          <strong>This clause does not exclude or limit any consumer guarantee or right that you have under the
          Australian Consumer Law or any other law that cannot be lawfully excluded.</strong>
        </p>

        <h2>15. Beta status</h2>
        <p>
          TUTUMatch is currently in <strong>early beta</strong>. The service may have bugs, downtime, or feature
          limitations. We&apos;re a small team learning as we go. By using TUTUMatch during beta, you accept that
          some features (file storage encryption, automated WWCC API integration, transactional email reliability)
          are still being hardened.
        </p>

        <h2>16. Changes</h2>
        <p>
          We may update these Terms. The current version is shown at the top of this page and is recorded against
          your account each time you accept it. Material changes will be notified by email to your account
          address. Continued use of the platform after that notice constitutes acceptance of the updated version.
        </p>

        <h2>17. Governing law</h2>
        <p>
          These Terms are governed by the laws of New South Wales, Australia. Any dispute is to be resolved
          exclusively in the courts of New South Wales. The parties submit to that jurisdiction.
        </p>

        <h2>18. Contact</h2>
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

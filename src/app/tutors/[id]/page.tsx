import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { ArrowIcon, LockIcon } from "@/components/landing/icons";
import { findSampleTutor } from "@/lib/sample-tutors";
import { findSchool, OTHER_AREA_SCHOOL } from "@/lib/schools";

export const metadata = { title: "Tutor profile · TUTUMatch" };

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  // Sample-tutor preview path. Real approved profiles will use the same
  // shape but route by their DB id.
  const sample = findSampleTutor(params.id);
  if (!sample) notFound();

  const area = findSchool(sample.tutoringAreaSchoolId) ?? OTHER_AREA_SCHOOL;
  const attended = sample.attendedSchoolId ? findSchool(sample.attendedSchoolId) : undefined;

  return (
    <>
      <TopNav />
      <main className="page-shell profile-shell">
        <div className="back-row">
          <Link className="link-like" href={`/schools/${area.id}`}>← Back to {area.name}</Link>
        </div>

        <div className="profile-head">
          <div className="profile-ph">{sample.initials}</div>
          <div className="profile-head-text">
            <h1 className="profile-name">
              {sample.name}
              <span className="example inline">Example</span>
            </h1>
            <div className="profile-meta">
              {sample.suburb}
              <span className="sep">·</span>
              <span className="atar">ATAR {sample.atar}</span>
              <span className="sep">·</span>
              <span>{sample.mode}</span>
            </div>
            <div className="profile-schools">
              <span><strong>Tutors near:</strong> {area.name}</span>
              {(attended || sample.attendedOther) && (
                <span><strong>High school:</strong> {attended?.name ?? sample.attendedOther}</span>
              )}
            </div>
          </div>
          <div className="profile-rate">
            <div className="profile-rate-num">${sample.rate}<small>/hr</small></div>
            <div className="profile-rate-label">tutor sets the rate</div>
          </div>
        </div>

        <section className="profile-section">
          <h2>HSC subjects &amp; results</h2>
          <div className="subs">
            {sample.subjects.map((s, i) => (
              <span className="sub" key={i}>
                {s.s} <b>{s.b}</b>
              </span>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>About</h2>
          <p className="profile-bio-stub">
            (Bio shown here on real profiles. For sample tutors we don&apos;t include one — once you submit a tutor
            application your written bio appears in this spot once approved.)
          </p>
        </section>

        <section className="profile-contact-card">
          <div className="profile-contact-card-head">
            <h2>Want to contact this tutor?</h2>
            <p className="profile-contact-sub">
              Browsing is free. To message {sample.name.split(" ")[0]} and reveal their phone, email and full name,
              there&apos;s a one-time <strong>$20</strong> match fee. Read this first:
            </p>
          </div>
          <ul className="refund-list">
            <li>
              <strong>$20 off your first lesson.</strong> The tutor applies a $20 discount to your first invoice, so
              the net cost to you ends up at $0.
            </li>
            <li>
              <strong>Full refund if no agreement.</strong> If you and the tutor can&apos;t agree on a first lesson —
              for any reason at all — your $20 is refunded in full. No questions, no forms.
            </li>
            <li>
              <strong>5-day automatic refund.</strong> If the tutor doesn&apos;t reply to your first message within
              5 days, the $20 comes back to your card automatically.
            </li>
            <li>
              <strong>Nothing is charged yet.</strong> You only pay on the next screen, after you&apos;ve read the
              terms and confirmed.
            </li>
          </ul>
          <div className="profile-contact-actions">
            <Link className="btn brand lg" href={`/unlock/${params.id}`}>
              <LockIcon /> Continue to contact details <ArrowIcon />
            </Link>
            <span className="profile-contact-fine">
              You won&apos;t be charged until you confirm on the next page.
            </span>
          </div>
        </section>
      </main>
    </>
  );
}

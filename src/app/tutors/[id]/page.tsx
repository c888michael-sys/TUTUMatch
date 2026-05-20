import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { ArrowIcon, LockIcon } from "@/components/landing/icons";
import { OTHER_AREA_SCHOOL } from "@/lib/schools";
import { findSchoolBySlug } from "@/lib/schools-store";
import { findApplicationById } from "@/lib/db";

export const metadata = { title: "Tutor profile · TUTUMatch" };
export const dynamic = "force-dynamic";

function yearsLabel(years: number[]): string {
  if (years.length === 0) return "—";
  if (years.length === 6) return "Years 7–12";
  return "Y" + [...years].sort((a, b) => a - b).join(", Y");
}

export default async function TutorProfilePage({ params }: { params: { id: string } }) {
  const app = await findApplicationById(params.id);
  if (!app) notFound();

  const t = {
    initials: `${app.firstName[0] ?? ""}${app.lastInitial}`,
    name: `${app.firstName} ${app.lastInitial}.`,
    suburb: app.suburb ?? (app.tutoringAreaOther ?? "—"),
    atar: app.atar.toFixed(2),
    mode:
      app.mode === "EITHER" ? "Online · In-person" :
      app.mode === "ONLINE" ? "Online" : "In-person",
    rate: Math.round(app.hourlyRateCents / 100),
    subjects: app.offeredSubjects.map((o) => ({ s: o.subject, b: yearsLabel(o.yearLevels) })),
    tutoringAreaSchoolId: app.tutoringAreaSchoolId,
    attendedSchoolId: app.schoolId,
    attendedOther: app.otherSchoolName,
    bio: app.publicBio,
  };

  const [area, attended] = await Promise.all([
    findSchoolBySlug(t.tutoringAreaSchoolId).then((s) => s ?? OTHER_AREA_SCHOOL),
    t.attendedSchoolId ? findSchoolBySlug(t.attendedSchoolId) : Promise.resolve(undefined),
  ]);
  const isLive = app.status === "APPROVED";

  return (
    <>
      <TopNav />
      <main className="page-shell profile-shell">
        <div className="back-row">
          <Link className="link-like" href={`/schools/${area.id}`}>← Back to {area.name}</Link>
        </div>

        <div className="profile-head">
          <div className="profile-ph">{t.initials}</div>
          <div className="profile-head-text">
            <h1 className="profile-name">
              {t.name}
              {!isLive && <span className="example inline">{app.status.replace("_", " ")}</span>}
            </h1>
            <div className="profile-meta">
              {t.suburb}
              <span className="sep">·</span>
              <span className="atar">ATAR {t.atar}</span>
              <span className="sep">·</span>
              <span>{t.mode}</span>
            </div>
            <div className="profile-schools">
              <span><strong>Tutors near:</strong> {area.name}</span>
              {(attended || t.attendedOther) && (
                <span><strong>High school:</strong> {attended?.name ?? t.attendedOther}</span>
              )}
            </div>
          </div>
          <div className="profile-rate">
            <div className="profile-rate-num">${t.rate}<small>/hr</small></div>
            <div className="profile-rate-label">tutor sets the rate</div>
          </div>
        </div>

        <section className="profile-section">
          <h2>HSC subjects &amp; year levels taught</h2>
          <div className="subs">
            {t.subjects.map((s, i) => (
              <span className="sub" key={i}>
                {s.s} <b>{s.b}</b>
              </span>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>About</h2>
          <p className="profile-bio">{t.bio}</p>
        </section>

        {isLive && (
          <section className="profile-contact-card">
            <div className="profile-contact-card-head">
              <h2>Want to contact this tutor?</h2>
              <p className="profile-contact-sub">
                Browsing is free. To message {t.name.split(" ")[0]} and reveal their phone, email and full name,
                there&apos;s a one-time <strong>$20</strong> match fee. Read this first:
              </p>
            </div>
            <ul className="refund-list">
              <li>
                <strong>$20 off your first lesson.</strong> The tutor applies a $20 discount to your first invoice,
                so the net cost to you ends up at $0.
              </li>
              <li>
                <strong>Full refund if no agreement.</strong> If you and the tutor can&apos;t agree on a first
                lesson — for any reason at all — your $20 is refunded in full. No questions, no forms.
              </li>
              <li>
                <strong>5-day automatic refund.</strong> If the tutor doesn&apos;t reply to your first message
                within 5 days, the $20 comes back to your card automatically.
              </li>
              <li>
                <strong>Nothing is charged yet.</strong> You only pay on the next screen, after you&apos;ve read
                the terms and confirmed.
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
        )}

        {!isLive && (
          <section className="stub-note">
            This profile is <strong>{app.status.replace("_", " ").toLowerCase()}</strong> — not currently visible
            to parents. It will be once an admin approves it.
          </section>
        )}
      </main>
    </>
  );
}

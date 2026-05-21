import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { ArrowIcon } from "@/components/landing/icons";
import { ReportButton } from "@/components/report/ReportButton";
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

        <section className="profile-section profile-directory-note">
          <p>
            <strong>TUTUMatch is a directory.</strong> This listing was provided by the tutor. TUTUMatch
            does not verify tutor qualifications, identity, or Working With Children Check status —{" "}
            <a href="https://www.kidsguardian.nsw.gov.au/working-with-children/check-an-employee-or-volunteer" target="_blank" rel="noopener noreferrer">
              verify the tutor&apos;s WWCC yourself
            </a>{" "}
            with the NSW Office of the Children&apos;s Guardian (free, 30 seconds) before booking a lesson.
          </p>
        </section>

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
                It&apos;s free. Get {t.name.split(" ")[0]}&apos;s full name, phone, and email, and reach out
                directly — TUTUMatch never charges parents.
              </p>
            </div>
            <div className="profile-contact-actions">
              <Link className="btn brand lg" href={`/contact/${params.id}`}>
                I want this tutor — see contact details <ArrowIcon />
              </Link>
              <span className="profile-contact-fine">
                Free, and no account needed. You arrange the lesson directly with the tutor.
              </span>
            </div>
          </section>
        )}

        <div className="report-row">
          <ReportButton
            subjectKind="APPLICATION"
            subjectId={app.id}
            subjectLabel={`${app.firstName} ${app.lastInitial}.`}
            variant="inline"
          />
          <span className="report-row-note">
            Spot something off? Misleading qualifications, contact-info bypass, or a safety concern —
            tell us.
          </span>
        </div>

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

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { ReviewActions } from "@/components/admin/ReviewActions";
import { findApplicationById, findUserById } from "@/lib/db";
import { getSession } from "@/lib/session";
import { minutesToLabel } from "@/lib/tutor-form";

export const metadata = { title: "Inspect application · Admin · TUTUMatch" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING_REVIEW: "Pending review",
  APPROVED: "Approved",
  PAUSED: "Paused",
  REJECTED: "Rejected",
};

export default async function ApplicationDetail({ params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) redirect(`/login?next=/admin/applications/${params.id}`);
  if (session.role !== "ADMIN") {
    return (
      <>
        <TopNav />
        <main className="page-shell">
          <h1>Forbidden</h1>
          <p>Admin access only.</p>
        </main>
      </>
    );
  }

  const app = await findApplicationById(params.id);
  if (!app) notFound();
  const owner = await findUserById(app.userId);

  return (
    <>
      <TopNav />
      <main className="page-shell admin-detail">
        <div className="back-row">
          <Link className="link-like" href="/admin">← Back to applications</Link>
        </div>
        <header className="detail-head">
          <h1>
            {app.firstName} {app.lastInitial}.{" "}
            <span className={`status-pill inline ${app.status.toLowerCase()}`}>{STATUS_LABEL[app.status]}</span>
          </h1>
          <div className="detail-meta">
            Submitted {new Date(app.submittedAt).toLocaleString("en-AU")} · account {owner?.email ?? app.userId}
          </div>
        </header>

        <ReviewActions
          id={app.id}
          initialStatus={app.status}
          initialNotes={app.reviewerNotes}
        />

        <div className="admin-quick-actions">
          <Link className="btn ghost sm" href={`/tutors/${app.id}`} target="_blank">
            View public profile ↗
          </Link>
          <Link className="btn ghost sm" href={`/unlock/${app.id}`} target="_blank">
            Test unlock + chat flow ↗
          </Link>
        </div>

        {app.bioFlags && app.bioFlags.length > 0 && (
          <div className="warning-banner">
            ⚠ Bio scanner flagged: {app.bioFlags.join(", ")}. Review the bio before approving.
          </div>
        )}

        <div className="detail-grid">
          <DetailBlock title="Identity & contact">
            <Row k="Full name" v={`${app.firstName} ${app.fullLastName}`} />
            <Row k="Public display" v={`${app.firstName} ${app.lastInitial}.`} />
            <Row k="DOB" v={app.dateOfBirth} />
            <Row k="WWCC name" v={app.wwccFullName} />
            <Row k="WWCC number" v={app.wwccNumber} mono />
            <Row k="Phone" v={app.phone} mono />
            <Row k="Contact email" v={app.contactEmail} mono />
            <Row k="Socials" v={app.socials || "—"} />
          </DetailBlock>

          <DetailBlock title="Academic">
            <Row k="ATAR" v={app.atar.toFixed(2)} mono />
            <Row k="School" v={app.schoolId ? app.schoolId : app.otherSchoolName ?? "—"} />
            <Row k="HSC results" v={
              <ul className="inline-list">
                {app.hscResults.map((r, i) => (
                  <li key={i}>{r.subject} · <span className="mono">{r.bandOrMark}</span></li>
                ))}
              </ul>
            } />
            <Row
              k="Subjects offered"
              v={
                <ul className="inline-list">
                  {app.offeredSubjects.map((o, i) => {
                    const allYears = o.yearLevels.length === 6;
                    const yearLabel = allYears
                      ? "all years"
                      : o.yearLevels.length === 0
                        ? "(no years)"
                        : `Y${[...o.yearLevels].sort((a, b) => a - b).join(", Y")}`;
                    return (
                      <li key={i}>
                        {o.subject} · <span className="mono">{yearLabel}</span>
                      </li>
                    );
                  })}
                </ul>
              }
            />
          </DetailBlock>

          <DetailBlock title="Pricing & location">
            <Row k="Hourly rate" v={`$${(app.hourlyRateCents / 100).toFixed(0)}/hr`} mono />
            <Row
              k="Tutoring area"
              v={
                app.tutoringAreaSchoolId === "other"
                  ? `Other — ${app.tutoringAreaOther ?? "(not specified)"}`
                  : `Near ${app.tutoringAreaSchoolId}`
              }
            />
            <Row k="Suburb" v={app.suburb || "—"} />
            <Row k="Postcode" v={app.postcode || "—"} />
            <Row k="Mode" v={app.mode.replace("_", "-").toLowerCase()} />
          </DetailBlock>

          <DetailBlock title="Availability">
            <ul className="inline-list">
              {Object.entries(app.availability).map(([day, slots]) => (
                <li key={day}>
                  <strong>{day}:</strong>{" "}
                  {slots && slots.length > 0
                    ? slots.map((s) => `${minutesToLabel(s.startMinutes)}–${minutesToLabel(s.endMinutes)}`).join(", ")
                    : "—"}
                </li>
              ))}
            </ul>
          </DetailBlock>

          <DetailBlock title="Bio (public)" full>
            <pre className="bio-pre">{app.publicBio}</pre>
          </DetailBlock>

          <DetailBlock title="Verification documents" full>
            <Row k="Government ID" v={app.idDocumentNote || "(none — request via email)"} />
            <Row k="HSC document" v={app.hscDocumentNote || "(none — request via email)"} />
            <p className="muted small">
              File uploads aren&apos;t wired up yet. Until they are, request scans from the tutor by email and verify
              manually against the WWCC + ATAR claims above.
            </p>
          </DetailBlock>
        </div>

        {app.reviewedAt && (
          <div className="prev-review">
            <strong>Previously reviewed:</strong> {new Date(app.reviewedAt).toLocaleString("en-AU")} by{" "}
            {app.reviewerEmail ?? "?"} — status <code>{app.status}</code>.
            {app.reviewerNotes && <div className="muted">Notes: {app.reviewerNotes}</div>}
          </div>
        )}
      </main>
    </>
  );
}

function DetailBlock({
  title,
  full,
  children,
}: {
  title: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`detail-block ${full ? "full" : ""}`}>
      <h2>{title}</h2>
      <div className="detail-rows">{children}</div>
    </section>
  );
}

function Row({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="detail-row">
      <div className="detail-row-k">{k}</div>
      <div className={`detail-row-v ${mono ? "mono" : ""}`}>{v}</div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { ReportResolveForm } from "@/components/admin/ReportResolveForm";
import {
  findApplicationById,
  findUserById,
  listReports,
  REPORT_REASON_LABELS,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Reports · Admin · TUTUMatch" };
export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
} as const;

const ACTION_LABEL = {
  NONE: "—",
  WARNED_USER: "Warned user",
  SUSPENDED_USER: "Suspended user",
  REJECTED_APPLICATION: "Rejected application",
} as const;

export default async function AdminReportsPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/admin/reports");
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

  const reports = await listReports();
  reports.sort((a, b) => {
    // Open first, then by createdAt desc
    const aOpen = a.status === "OPEN" ? 1 : 0;
    const bOpen = b.status === "OPEN" ? 1 : 0;
    if (aOpen !== bOpen) return bOpen - aOpen;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const open = reports.filter((r) => r.status === "OPEN");

  // Enrich each report with subject + reporter details
  const enriched = await Promise.all(
    reports.map(async (r) => {
      const reporter = await findUserById(r.reporterUserId);
      let subjectName = r.subjectId;
      let subjectUserId: string | undefined;
      if (r.subjectKind === "APPLICATION") {
        const app = await findApplicationById(r.subjectId);
        if (app) {
          subjectName = `${app.firstName} ${app.lastInitial}. (${app.contactEmail})`;
          subjectUserId = app.userId;
        }
      } else if (r.subjectKind === "USER") {
        const u = await findUserById(r.subjectId);
        if (u) subjectName = u.email;
        subjectUserId = r.subjectId;
      }
      return { report: r, reporterEmail: reporter?.email ?? r.reporterEmail, subjectName, subjectUserId };
    })
  );

  return (
    <>
      <TopNav />
      <main className="page-shell admin-shell">
        <div className="back-row">
          <Link className="link-like" href="/admin">← Back to applications</Link>
        </div>
        <h1>Reports</h1>
        <p>
          {reports.length} total · <strong>{open.length} open</strong>. Reports filed by parents and tutors against
          tutor listings or other users. Resolve them by recording the outcome — optionally suspending the
          subject user.
        </p>

        {reports.length === 0 ? (
          <div className="stub-note">
            No reports yet. Report buttons live on tutor profile pages — anyone signed in can submit one.
          </div>
        ) : (
          <div className="report-list">
            {enriched.map(({ report: r, reporterEmail, subjectName, subjectUserId }) => (
              <details key={r.id} className={`report-card ${r.status.toLowerCase()}`} open={r.status === "OPEN"}>
                <summary>
                  <span className={`status-pill ${r.status.toLowerCase()}`}>{STATUS_LABEL[r.status]}</span>
                  <span className="report-reason">{REPORT_REASON_LABELS[r.reason]}</span>
                  <span className="report-subject">
                    <strong>{subjectName}</strong> <span className="muted small">({r.subjectKind})</span>
                  </span>
                  <span className="report-when mono-cell">
                    {new Date(r.createdAt).toLocaleString("en-AU")}
                  </span>
                </summary>
                <div className="report-body">
                  <div className="report-meta">
                    <div><strong>Reporter:</strong> {reporterEmail}</div>
                    <div><strong>Subject:</strong> {subjectName} (ID <code>{r.subjectId}</code>)</div>
                    {r.subjectKind === "APPLICATION" && (
                      <div>
                        <strong>Application:</strong>{" "}
                        <Link href={`/admin/applications/${r.subjectId}`} className="link-like" target="_blank">
                          Open application ↗
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="report-desc">
                    <strong>Reporter said:</strong>
                    <pre>{r.description}</pre>
                  </div>

                  {r.status !== "OPEN" && (
                    <div className="report-resolution">
                      <div>
                        <strong>Resolved</strong> {r.resolvedAt && new Date(r.resolvedAt).toLocaleString("en-AU")}
                        {" "}by {r.resolverEmail ?? "?"}.
                      </div>
                      <div>
                        <strong>Action:</strong> {ACTION_LABEL[r.actionTaken ?? "NONE"]}
                      </div>
                      {r.resolverNotes && (
                        <div>
                          <strong>Notes:</strong> {r.resolverNotes}
                        </div>
                      )}
                    </div>
                  )}

                  {r.status === "OPEN" && (
                    <ReportResolveForm reportId={r.id} suspendableUserId={subjectUserId} />
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

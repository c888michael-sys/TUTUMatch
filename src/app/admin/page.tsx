import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { listApplications } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Admin · TUTUMatch" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING_REVIEW: "Pending review",
  APPROVED: "Approved",
  PAUSED: "Paused",
  REJECTED: "Rejected",
};

export default async function AdminPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") {
    return (
      <>
        <TopNav />
        <main className="page-shell">
          <h1>Admin</h1>
          <div className="stub-note">
            You&apos;re logged in as <strong>{session.email}</strong> but not as an admin. Add this email to{" "}
            <code>ADMIN_EMAILS</code> in <code>.env.local</code> and sign up again, or have an existing admin promote
            you.
          </div>
        </main>
      </>
    );
  }

  const apps = await listApplications();
  apps.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const pending = apps.filter((a) => a.status === "PENDING_REVIEW");

  return (
    <>
      <TopNav />
      <main className="page-shell admin-shell">
        <h1>Admin · Tutor applications</h1>
        <p>
          {apps.length} application{apps.length === 1 ? "" : "s"} total · {pending.length} pending review.
        </p>

        {apps.length === 0 ? (
          <div className="stub-note">No applications yet. Have a tutor submit via <Link href="/tutor/signup">/tutor/signup</Link>.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Tutor</th>
                <th>High school</th>
                <th>Tutoring area</th>
                <th>ATAR</th>
                <th>Rate</th>
                <th>Status</th>
                <th>Flags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className={`status-${a.status.toLowerCase()}`}>
                  <td className="mono-cell">{new Date(a.submittedAt).toLocaleString("en-AU")}</td>
                  <td>
                    {a.firstName} {a.lastInitial}. <span className="mono-cell muted">({a.contactEmail})</span>
                  </td>
                  <td>{a.schoolId ?? a.otherSchoolName ?? "—"}</td>
                  <td>
                    {a.tutoringAreaSchoolId === "other"
                      ? `Other — ${a.tutoringAreaOther ?? ""}`
                      : a.tutoringAreaSchoolId ?? "—"}
                  </td>
                  <td className="mono-cell">{a.atar.toFixed(2)}</td>
                  <td className="mono-cell">${(a.hourlyRateCents / 100).toFixed(0)}/hr</td>
                  <td>
                    <span className={`status-pill ${a.status.toLowerCase()}`}>{STATUS_LABEL[a.status]}</span>
                    {a.reviewerEmail === "auto" && <span className="auto-tag">AUTO</span>}
                  </td>
                  <td className="mono-cell">{a.bioFlags?.length ? a.bioFlags.join(", ") : "—"}</td>
                  <td>
                    <Link className="btn ghost sm" href={`/admin/applications/${a.id}`}>Inspect →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

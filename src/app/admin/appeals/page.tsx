import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { listAppeals, findMatchById, findApplicationById, type Appeal } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Appeals · Admin · TUTUMatch" };
export const dynamic = "force-dynamic";

async function enrichAppeal(appeal: Appeal) {
  const match = await findMatchById(appeal.matchId);
  const app = match ? await findApplicationById(match.tutorApplicationId) : undefined;
  return {
    appeal,
    tutorName: app ? `${app.firstName} ${app.lastInitial}.` : "Unknown",
    parentEmail: match?.parentEmail ?? "—",
  };
}

export default async function AdminAppealsPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/admin/appeals");
  if (session.role !== "ADMIN") {
    return (
      <>
        <TopNav />
        <main className="page-shell"><h1>Forbidden</h1><p>Admin access only.</p></main>
      </>
    );
  }

  const appeals = await listAppeals();
  appeals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const enriched = await Promise.all(appeals.map(enrichAppeal));

  const pending = enriched.filter((e) => e.appeal.status === "PENDING");
  const resolved = enriched.filter((e) => e.appeal.status !== "PENDING");

  return (
    <>
      <TopNav />
      <main className="page-shell admin-shell">
        <div className="back-row">
          <Link className="link-like" href="/admin">← Admin home</Link>
        </div>
        <h1>Admin · Appeals</h1>
        <p>{pending.length} pending · {resolved.length} resolved.</p>

        {pending.length === 0 && resolved.length === 0 && (
          <div className="stub-note">No appeals yet.</div>
        )}

        {pending.length > 0 && (
          <>
            <h2>Pending review</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Filed</th>
                  <th>Tutor</th>
                  <th>Parent</th>
                  <th>Evidence</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pending.map(({ appeal, tutorName, parentEmail }) => (
                  <tr key={appeal.id}>
                    <td className="mono-cell">{new Date(appeal.createdAt).toLocaleString("en-AU")}</td>
                    <td>{tutorName}</td>
                    <td className="mono-cell">{parentEmail}</td>
                    <td className="mono-cell">{appeal.evidenceUploadIds.length} file(s)</td>
                    <td>
                      <Link className="btn brand sm" href={`/admin/appeals/${appeal.id}`}>Review →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {resolved.length > 0 && (
          <>
            <h2 style={{ marginTop: 32 }}>Resolved</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Filed</th>
                  <th>Tutor</th>
                  <th>Parent</th>
                  <th>Decision</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {resolved.map(({ appeal, tutorName, parentEmail }) => (
                  <tr key={appeal.id} className={appeal.status === "APPROVED" ? "status-approved" : "status-rejected"}>
                    <td className="mono-cell">{new Date(appeal.createdAt).toLocaleString("en-AU")}</td>
                    <td>{tutorName}</td>
                    <td className="mono-cell">{parentEmail}</td>
                    <td>
                      <span className={`status-pill ${appeal.status.toLowerCase()}`}>{appeal.status}</span>
                    </td>
                    <td>
                      <Link className="btn ghost sm" href={`/admin/appeals/${appeal.id}`}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </>
  );
}

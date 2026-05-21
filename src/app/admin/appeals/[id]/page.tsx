import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { AppealDecisionForm } from "@/components/admin/AppealDecisionForm";
import { findAppealById, findMatchById, findApplicationById } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Review appeal · Admin · TUTUMatch" };
export const dynamic = "force-dynamic";

// Filename-based heuristic: does any evidence ID look like a bank transfer?
function hasBankTransferHint(uploadIds: string[]): boolean {
  return uploadIds.some((id) => /bank|transfer|receipt|statement|payment|bsb/i.test(id));
}

export default async function AppealDetailPage({ params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) redirect(`/login?next=/admin/appeals/${params.id}`);
  if (session.role !== "ADMIN") {
    return (
      <>
        <TopNav />
        <main className="page-shell"><h1>Forbidden</h1><p>Admin access only.</p></main>
      </>
    );
  }

  const appeal = await findAppealById(params.id);
  if (!appeal) notFound();

  const match = await findMatchById(appeal.matchId);
  const app = match ? await findApplicationById(match.tutorApplicationId) : undefined;
  const bankHint = hasBankTransferHint(appeal.evidenceUploadIds);

  return (
    <>
      <TopNav />
      <main className="page-shell admin-detail">
        <div className="back-row">
          <Link className="link-like" href="/admin/appeals">← Back to appeals</Link>
        </div>

        <header className="detail-head">
          <h1>
            Appeal{" "}
            <span className={`status-pill inline ${appeal.status.toLowerCase()}`}>{appeal.status}</span>
          </h1>
          <div className="detail-meta">
            Filed {new Date(appeal.createdAt).toLocaleString("en-AU")}
            {appeal.resolvedAt && ` · Resolved ${new Date(appeal.resolvedAt).toLocaleString("en-AU")}`}
          </div>
        </header>

        {bankHint && (
          <div className="warning-banner">
            Evidence filenames suggest a bank transfer or receipt. If the name on the transfer matches
            the tutor, this is an automatic pass per platform policy.
          </div>
        )}

        <div className="detail-grid">
          <div className="detail-block">
            <h3>Match details</h3>
            {match ? (
              <>
                <div><strong>Parent:</strong> {match.parentEmail}</div>
                <div><strong>Tutor:</strong> {app ? `${app.firstName} ${app.fullLastName}` : appeal.tutorUserId}</div>
                <div><strong>Match created:</strong> {new Date(match.createdAt).toLocaleString("en-AU")}</div>
                <div><strong>Parent said:</strong> {match.parentConfirmation ?? "—"}</div>
                <div><strong>Tutor self-report:</strong> {match.tutorSelfReport ?? "—"}</div>
                <div className="muted small">Match ID: {match.id}</div>
              </>
            ) : (
              <p className="muted">Match record not found.</p>
            )}
          </div>

          <div className="detail-block">
            <h3>Tutor&apos;s appeal statement</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{appeal.description}</p>
          </div>

          {appeal.evidenceUploadIds.length > 0 && (
            <div className="detail-block">
              <h3>Evidence files ({appeal.evidenceUploadIds.length})</h3>
              <ul>
                {appeal.evidenceUploadIds.map((uid) => (
                  <li key={uid}>
                    <a href={`/api/uploads/${uid}`} target="_blank" rel="noopener noreferrer" className="link-like">
                      View file {uid.slice(-8)} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {appeal.reviewerNotes && (
            <div className="detail-block">
              <h3>Reviewer notes</h3>
              <p>{appeal.reviewerNotes}</p>
              <div className="muted small">by {appeal.reviewerEmail}</div>
            </div>
          )}
        </div>

        {appeal.status === "PENDING" && <AppealDecisionForm appealId={appeal.id} />}
      </main>
    </>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { VisibilityToggle } from "@/components/tutor/VisibilityToggle";
import { SelfReportButton } from "@/components/tutor/SelfReportButton";
import { findApplicationByUserId, findUserById, listMatchesForUser } from "@/lib/db";
import { strikeSummary } from "@/lib/strike";
import { clearSession, getSession } from "@/lib/session";

export const metadata = { title: "Dashboard · TUTUMatch" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING_REVIEW: "Pending review",
  APPROVED: "Approved — your profile is live",
  PAUSED: "Paused by admin",
  REJECTED: "Rejected",
};

const MATCH_STATUS_LABEL: Record<string, string> = {
  AWAITING_RESOLUTION: "Awaiting resolution",
  RESOLVED_TUTOR_CONFIRMED: "Confirmed by you",
  RESOLVED_PARENT_CONFIRMED: "Confirmed by parent",
  RESOLVED_NO_MATCH: "No match",
  RESOLVED_APPEALED_WON: "Appeal won",
  RESOLVED_APPEALED_LOST: "Appeal lost",
  AUTO_CLOSED_NO_RESPONSE: "Auto-closed",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { submitted?: string; updated?: string; rejected?: string };
}) {
  const session = getSession();
  if (!session) redirect("/login?next=/dashboard");

  const me = await findUserById(session.userId);
  if (me?.suspended) {
    clearSession();
    return (
      <>
        <TopNav />
        <main className="page-shell">
          <div className="reject-banner">
            <strong>Your account has been suspended.</strong>{" "}
            {me.suspendedReason ?? "Suspension reason not recorded."}
            <div style={{ marginTop: 12 }}>
              To appeal, email{" "}
              <a href="mailto:appeals@tutumatch.com.au?subject=Account suspension appeal">
                appeals@tutumatch.com.au
              </a>{" "}
              with the details of your situation. Include your account email and any context — admins review
              appeals manually.
            </div>
            <div className="muted small" style={{ marginTop: 12 }}>
              You&apos;ve been signed out of this device. You won&apos;t be able to sign back in until the suspension
              is lifted.
            </div>
          </div>
          <p>
            <Link className="btn ghost" href="/">Back to the home page</Link>
          </p>
        </main>
      </>
    );
  }

  const app = await findApplicationByUserId(session.userId);
  const isLiveTutor = !!app && app.status === "APPROVED";
  const visibility = app?.visibility ?? true;
  const matches = app ? await listMatchesForUser(session.userId) : [];
  const pendingMatches = matches.filter((m) => m.status === "AWAITING_RESOLUTION");
  const recentMatches = matches.filter((m) => m.status !== "AWAITING_RESOLUTION").slice(0, 5);
  const strikeMsg = app ? strikeSummary(app) : null;

  return (
    <>
      <TopNav />
      <main className="page-shell">
        <h1>Dashboard</h1>
        <p>
          Logged in as <strong>{session.email}</strong> ({session.role.toLowerCase()}).
        </p>

        {searchParams.submitted === "1" && (
          <div className="success-banner">
            ✓ Application submitted. An admin will review it shortly — refresh this page for status.
          </div>
        )}
        {searchParams.updated === "1" && (
          <div className="success-banner">
            ✓ Changes saved. Your listing is back in <strong>Pending review</strong> while admin re-approves.
          </div>
        )}
        {searchParams.rejected === "auto" && (
          <div className="reject-banner">
            <strong>Your application was automatically rejected.</strong> TUTUMatch requires all tutors to be 18 or
            older — the date of birth you submitted indicates you&apos;re under 18. This is an automated decision.
            See the reviewer notes below for the full explanation.
          </div>
        )}

        {session.role === "ADMIN" && (
          <div className="stub-note">
            Admin tools:{" "}
            <Link href="/admin">Tutor applications →</Link>{" "}
            <Link href="/admin/appeals">Appeals →</Link>
          </div>
        )}

        {strikeMsg && (
          <div className="reject-banner">
            <strong>Strike notice:</strong> {strikeMsg}
          </div>
        )}

        <h2>Your tutor profile</h2>
        {!app ? (
          <div className="dashboard-card">
            <p>You haven&apos;t submitted a tutor application yet.</p>
            <p>
              <Link className="btn brand" href="/tutor/signup">Start an application →</Link>
            </p>
          </div>
        ) : (
          <div className="dashboard-app">
            <div className="dashboard-app-row">
              <div className="dashboard-app-status">
                <div className="dashboard-app-status-label">Status</div>
                <div>
                  <span className={`status-pill ${app.status.toLowerCase()}`}>
                    {STATUS_LABEL[app.status]}
                  </span>
                </div>
              </div>
              <div className="dashboard-app-actions">
                <Link className="btn ghost" href={`/tutors/${app.id}`}>
                  View public profile ↗
                </Link>
                <Link className="btn brand" href="/tutor/edit">
                  Edit profile
                </Link>
              </div>
            </div>
            <div className="dashboard-app-meta">
              <div><strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleString("en-AU")}</div>
              {app.reviewedAt && (
                <div>
                  <strong>Last reviewed:</strong> {new Date(app.reviewedAt).toLocaleString("en-AU")} by{" "}
                  {app.reviewerEmail ?? "admin"}.
                </div>
              )}
              {app.reviewerNotes && (
                <div className="dashboard-app-notes">
                  <strong>Reviewer notes:</strong> {app.reviewerNotes}
                </div>
              )}
              {(app.strikeCount ?? 0) > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Strikes:</strong>{" "}
                  <span style={{ color: "var(--error, #dc2626)" }}>
                    {app.strikeCount}/3{app.noHonestyDiscount ? " (no honesty discount — perpetual)" : ""}
                  </span>
                </div>
              )}
              {(app.matchesCompletedCount ?? 0) > 0 && (
                <div><strong>Confirmed matches:</strong> {app.matchesCompletedCount}</div>
              )}
            </div>

            <div className="dashboard-app-section">
              <h3>Visibility</h3>
              <VisibilityToggle
                initial={visibility}
                disabled={!isLiveTutor}
                disabledReason={
                  app.status === "PENDING_REVIEW"
                    ? "Visibility goes live once an admin approves your profile."
                    : app.status === "REJECTED"
                      ? "Profile rejected — fix and re-submit before toggling visibility."
                      : "Visibility is admin-controlled while paused."
                }
              />
            </div>
          </div>
        )}

        {pendingMatches.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2>Pending matches — action required</h2>
            <p className="muted small">
              A parent has selected you. Self-report within 48 hours to claim the $15 honesty rate
              and keep your listing visible.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pendingMatches.map((m) => (
                <div key={m.id} className="dashboard-card" style={{ borderLeft: "3px solid var(--brand)" }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Parent:</strong> {m.parentEmail}
                  </div>
                  <div className="muted small" style={{ marginBottom: 12 }}>
                    Match opened: {new Date(m.createdAt).toLocaleString("en-AU")} ·
                    Hidden until: {new Date(m.tutorHiddenUntil).toLocaleString("en-AU")}
                    {m.isFreeFirstMatch && " · First match — no commission!"}
                  </div>
                  <SelfReportButton matchId={m.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {recentMatches.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2>Recent match history</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Parent</th>
                  <th>Status</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((m) => (
                  <tr key={m.id}>
                    <td className="mono-cell">{new Date(m.createdAt).toLocaleDateString("en-AU")}</td>
                    <td>{m.parentEmail}</td>
                    <td>
                      <span className="status-pill approved">
                        {MATCH_STATUS_LABEL[m.status] ?? m.status}
                      </span>
                    </td>
                    <td className="mono-cell">
                      {m.amountChargedCents !== undefined
                        ? m.amountChargedCents === 0
                          ? "Free (first match)"
                          : `$${(m.amountChargedCents / 100).toFixed(0)}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 style={{ marginTop: 32 }}>Browse</h2>
        <p>Take a look at the public site as your students would:</p>
        <p>
          <Link className="btn ghost" href="/browse">All tutors</Link>{" "}
          <Link className="btn ghost" href="/schools/killara">Killara High</Link>{" "}
          <Link className="btn ghost" href="/schools/masada">Masada College</Link>{" "}
          <Link className="btn ghost" href="/schools/other">Other Locations</Link>
        </p>
      </main>
    </>
  );
}

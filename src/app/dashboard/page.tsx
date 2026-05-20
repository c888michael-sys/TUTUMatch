import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { VisibilityToggle } from "@/components/tutor/VisibilityToggle";
import {
  findApplicationByUserId,
  findUserById,
  listUnlocksForUser,
  processOverdueRefunds,
} from "@/lib/db";
import { clearSession, getSession } from "@/lib/session";

export const metadata = { title: "Dashboard · TUTUMatch" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING_REVIEW: "Pending review",
  APPROVED: "Approved — your profile is live",
  PAUSED: "Paused by admin",
  REJECTED: "Rejected",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { submitted?: string; updated?: string; rejected?: string };
}) {
  const session = getSession();
  if (!session) redirect("/login?next=/dashboard");

  // Lazy refund cron: every dashboard load gives the system a chance to
  // process unlocks past their 5-day window. In production this also runs
  // from a Vercel cron, but a passive trigger here keeps local dev honest.
  const processedRefundIds = await processOverdueRefunds();

  // Re-load the current user fresh from the store so a just-suspended
  // tutor sees the banner immediately even though their cookie session is
  // still valid.
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
              with the details of your situation. Include your account email and any context about the conversation
              that triggered this — admins review appeals manually.
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
  const unlocks = await listUnlocksForUser(session.userId);
  const tutorUnlocks = unlocks.filter((u) => u.tutorUserId === session.userId);
  const parentUnlocks = unlocks.filter((u) => u.parentUserId === session.userId);

  // Parents who unlocked this tutor but the tutor hasn't replied to yet.
  // We need to push this aggressively — the tutor's account gets suspended
  // if they ignore it for 5 days.
  const awaitingReply = tutorUnlocks.filter(
    (u) => u.status === "PAID" && !u.tutorFirstReplyAt
  );

  const isLiveTutor = !!app && app.status === "APPROVED";
  const visibility = app?.visibility ?? true;

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
            ✓ Application submitted. An admin will review it within ~48 hours — refresh this page for status.
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
        {processedRefundIds.length > 0 && (
          <div className="success-banner">
            ✓ The system processed {processedRefundIds.length} overdue unlock
            {processedRefundIds.length === 1 ? "" : "s"}: the $20 was refunded to the parent and the unresponsive
            tutor was suspended.
          </div>
        )}

        {awaitingReply.length > 0 && (
          <div className="urgent-banner">
            <div className="urgent-banner-head">
              ⚠ Reply to {awaitingReply.length} parent{awaitingReply.length === 1 ? "" : "s"} ASAP
            </div>
            <ul className="urgent-banner-list">
              {awaitingReply.map((u) => {
                const msLeft = Date.parse(u.refundEligibleAt) - Date.now();
                const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
                const urgent = daysLeft <= 2;
                return (
                  <li key={u.id} className={urgent ? "urgent" : ""}>
                    <Link href={`/messages/${u.id}`}>Open thread</Link> · paid{" "}
                    {new Date(u.paidAt).toLocaleString("en-AU")} ·{" "}
                    <strong>
                      {daysLeft} day{daysLeft === 1 ? "" : "s"} left before auto-refund + suspension
                    </strong>
                  </li>
                );
              })}
            </ul>
            <p className="urgent-banner-note">
              Parents paid $20 expecting a fast response. If you don&apos;t reply within 5 days of their unlock,
              they&apos;re automatically refunded <strong>and your account is suspended</strong> until you appeal.
              Even a one-line reply stops the clock.
            </p>
          </div>
        )}

        {session.role === "ADMIN" && (
          <div className="stub-note">
            Admin tools: <Link href="/admin">Tutor applications →</Link>
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

            {tutorUnlocks.length > 0 && (
              <div className="dashboard-app-section">
                <h3>Parents who&apos;ve unlocked you ({tutorUnlocks.length})</h3>
                <p>
                  Open your <Link href="/messages">messages</Link> to chat. Remember to apply the $20 first-lesson
                  discount on each parent&apos;s first invoice.
                </p>
              </div>
            )}
          </div>
        )}

        <h2>Conversations</h2>
        {parentUnlocks.length === 0 && tutorUnlocks.length === 0 ? (
          <p>
            No conversations yet. Once you unlock a tutor (or a parent unlocks you), the thread shows up at{" "}
            <Link href="/messages">/messages</Link>.
          </p>
        ) : (
          <p>
            {parentUnlocks.length > 0 && (
              <>You&apos;ve unlocked <strong>{parentUnlocks.length}</strong> tutor{parentUnlocks.length === 1 ? "" : "s"}. </>
            )}
            {tutorUnlocks.length > 0 && (
              <><strong>{tutorUnlocks.length}</strong> parent{tutorUnlocks.length === 1 ? "" : "s"} unlocked your profile. </>
            )}
            <Link href="/messages">Go to messages →</Link>
          </p>
        )}

        <h2>Browse</h2>
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

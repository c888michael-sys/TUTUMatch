import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { findApplicationByUserId } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Dashboard · TutMatch" };
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
  searchParams: { submitted?: string };
}) {
  const session = getSession();
  if (!session) redirect("/login?next=/dashboard");

  const app = await findApplicationByUserId(session.userId);

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
            ✓ Application submitted. An admin will review it within ~48 hours. You can come back here for status.
          </div>
        )}

        {session.role === "ADMIN" && (
          <div className="stub-note">
            Admin tools: <Link href="/admin">Tutor applications →</Link>
          </div>
        )}

        <h2>Your tutor application</h2>
        {!app ? (
          <p>
            You haven&apos;t submitted a tutor application yet.{" "}
            <Link href="/tutor/signup">Start one →</Link>
          </p>
        ) : (
          <div className="dashboard-app">
            <div>
              <strong>Status:</strong> {STATUS_LABEL[app.status]}
            </div>
            <div>
              <strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleString("en-AU")}
            </div>
            {app.reviewedAt && (
              <div>
                <strong>Last reviewed:</strong> {new Date(app.reviewedAt).toLocaleString("en-AU")} by{" "}
                {app.reviewerEmail ?? "admin"}.
              </div>
            )}
            {app.reviewerNotes && (
              <div>
                <strong>Reviewer notes:</strong> {app.reviewerNotes}
              </div>
            )}
            {app.status === "REJECTED" && (
              <div>
                <Link className="btn brand" href="/tutor/signup">
                  Resubmit
                </Link>
              </div>
            )}
          </div>
        )}

        <h2>Browse / unlock</h2>
        <p>
          As a parent, browse tutors and unlock the ones you want to contact. Payment + chat aren&apos;t wired up
          yet.
        </p>
        <p>
          <Link className="btn ghost" href="/browse">Browse all tutors</Link>{" "}
          <Link className="btn ghost" href="/schools/killara">Killara High</Link>{" "}
          <Link className="btn ghost" href="/schools/masada">Masada College</Link>
        </p>
      </main>
    </>
  );
}

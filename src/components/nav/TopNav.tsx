import Link from "next/link";
import { getSession } from "@/lib/session";
import { listUnlocksForUser } from "@/lib/db";
import { LogoutButton } from "./LogoutButton";

export async function TopNav() {
  const session = getSession();

  // Count unlocks where the current user is the tutor and hasn't replied yet.
  // We surface this as a red badge on the Messages link so a tutor logging in
  // anywhere on the site sees the urgency immediately.
  let unrepliedCount = 0;
  if (session) {
    const unlocks = await listUnlocksForUser(session.userId);
    unrepliedCount = unlocks.filter(
      (u) => u.tutorUserId === session.userId && u.status === "PAID" && !u.tutorFirstReplyAt
    ).length;
  }

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="topnav-brand">
          <span className="mark" />
          TUTUMatch
          <span className="topnav-beta" title="TUTUMatch is in early beta — please read our Terms.">BETA</span>
        </Link>
        <nav className="topnav-links">
          <Link href="/browse">Browse tutors</Link>
          <Link href="/tutor/signup">For tutors</Link>
        </nav>
        <div className="topnav-actions">
          {session ? (
            <>
              <Link
                className={`btn ghost topnav-btn ${unrepliedCount > 0 ? "has-urgent" : ""}`}
                href="/messages"
              >
                Messages
                {unrepliedCount > 0 && (
                  <span className="topnav-badge" aria-label={`${unrepliedCount} unread`}>
                    {unrepliedCount}
                  </span>
                )}
              </Link>
              {session.role === "ADMIN" && (
                <Link className="btn ghost topnav-btn" href="/admin">
                  Admin
                </Link>
              )}
              <Link className="btn ghost topnav-btn" href="/dashboard">
                {session.email}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="btn ghost topnav-btn" href="/login">
                Log in
              </Link>
              <Link className="btn brand topnav-btn" href="/login?next=/tutor/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

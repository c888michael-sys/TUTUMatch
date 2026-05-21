import Link from "next/link";
import { getSession } from "@/lib/session";
import { LogoutButton } from "./LogoutButton";

export function TopNav() {
  const session = getSession();

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
          <Link href="/what-we-are">What we are</Link>
        </nav>
        <div className="topnav-actions">
          {session ? (
            <>
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

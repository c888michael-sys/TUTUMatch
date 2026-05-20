import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/tutor/SignupForm";
import { TopNav } from "@/components/nav/TopNav";
import { findApplicationByUserId } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "List as a tutor · TutMatch" };

export default async function TutorSignupPage() {
  const session = getSession();
  if (!session) {
    redirect("/login?next=/tutor/signup");
  }

  const existing = await findApplicationByUserId(session.userId);

  return (
    <>
      <TopNav />
      <main className="page-shell tform-shell">
        <h1>List as a tutor</h1>
        <p className="tform-intro">
          Fill in your profile and verification details. Your listing goes live after an admin reviews your WWCC,
          government ID, and HSC documents — usually within 48 hours.
        </p>

        {existing ? (
          <div className="stub-note">
            You&apos;ve already submitted an application — status: <strong>{existing.status}</strong>. See your{" "}
            <Link href="/dashboard">dashboard</Link> for details.
            {existing.status === "REJECTED" && (
              <> Resubmit below if the admin asked you to.</>
            )}
          </div>
        ) : null}

        {(!existing || existing.status === "REJECTED") && <SignupForm />}
      </main>
    </>
  );
}

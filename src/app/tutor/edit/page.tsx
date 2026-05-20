import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/tutor/SignupForm";
import { TopNav } from "@/components/nav/TopNav";
import { findApplicationByUserId } from "@/lib/db";
import { loadActiveSchools } from "@/lib/schools-store";
import { getSession } from "@/lib/session";

export const metadata = { title: "Edit your tutor profile · TUTUMatch" };
export const dynamic = "force-dynamic";

export default async function TutorEditPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/tutor/edit");

  const [existing, schools] = await Promise.all([
    findApplicationByUserId(session.userId),
    loadActiveSchools(),
  ]);
  if (!existing) {
    // Nothing to edit — bounce to the create flow.
    redirect("/tutor/signup");
  }

  return (
    <>
      <TopNav />
      <main className="page-shell tform-shell">
        <div className="back-row">
          <Link className="link-like" href="/dashboard">← Back to dashboard</Link>
        </div>
        <h1>Edit your tutor profile</h1>
        <p className="tform-intro">
          Update anything you need to. Saving sends your profile back to <strong>Pending review</strong> until an
          admin re-approves it — even a small change. This is intentional: child-safety claims need a fresh look.
        </p>

        <SignupForm mode="edit" initial={existing} schools={schools} />
      </main>
    </>
  );
}

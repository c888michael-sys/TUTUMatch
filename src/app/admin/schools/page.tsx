import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { SchoolEditor } from "@/components/admin/SchoolEditor";
import { loadSchools } from "@/lib/schools-store";
import { getSession } from "@/lib/session";

export const metadata = { title: "Schools · Admin · TUTUMatch" };
export const dynamic = "force-dynamic";

export default async function AdminSchoolsPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/admin/schools");
  if (session.role !== "ADMIN") {
    return (
      <>
        <TopNav />
        <main className="page-shell">
          <h1>Forbidden</h1>
          <p>Admin access only.</p>
        </main>
      </>
    );
  }

  const schools = await loadSchools();

  return (
    <>
      <TopNav />
      <main className="page-shell admin-shell">
        <div className="back-row">
          <Link className="link-like" href="/admin">← Back to applications</Link>
        </div>
        <h1>Schools</h1>
        <p>
          Add or edit the schools that appear as tabs on the public site (`/schools/[slug]`) and as options in the
          tutor signup form. Each school&apos;s brand colour drives the landing-page theming through CSS variables —
          no redeploy needed when you add one.
        </p>
        <div className="stub-note">
          <strong>Before activating a school:</strong> get written permission from the school to use their name +
          logo (auDA/AusInsurance/general defamation exposure). Save the evidence and link to it in your records
          before flipping <code>active</code> to true.
        </div>

        <SchoolEditor initial={schools} />
      </main>
    </>
  );
}

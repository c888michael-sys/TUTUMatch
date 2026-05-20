import Link from "next/link";
import { TopNav } from "@/components/nav/TopNav";

export const metadata = { title: "Tutor profile · TutMatch" };

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  return (
    <>
      <TopNav />
      <main className="page-shell">
        <h1>Tutor profile</h1>
        <div className="stub-note">
          STUB · Profile detail for tutor <code>{params.id}</code>. Once tutor applications get approved by an
          admin, this page will pull from the JSON store / DB and show the full public profile (bio, all HSC
          results, availability, rate, modes). Contact info stays masked until $20 unlock.
        </div>
        <p>The Unlock CTA goes to <Link href={`/unlock/${params.id}`}>{`/unlock/${params.id}`}</Link>.</p>
      </main>
    </>
  );
}

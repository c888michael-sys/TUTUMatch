import Link from "next/link";

export const metadata = { title: "Tutor profile · TutMatch" };

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  return (
    <main className="page-shell">
      <h1>Tutor profile</h1>
      <div className="stub-note">
        STUB · Profile detail for tutor <code>{params.id}</code>. Full bio, all HSC subject results, availability,
        rate, modes. Contact info masked until unlock.
      </div>
      <p>The Unlock CTA goes to <Link href={`/unlock/${params.id}`}>{`/unlock/${params.id}`}</Link>.</p>
    </main>
  );
}

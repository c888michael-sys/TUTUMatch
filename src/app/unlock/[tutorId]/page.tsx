import { TopNav } from "@/components/nav/TopNav";

export const metadata = { title: "Unlock tutor · TutMatch" };

export default function UnlockPage({ params }: { params: { tutorId: string } }) {
  return (
    <>
      <TopNav />
      <main className="page-shell">
        <h1>Unlock this tutor</h1>
        <div className="stub-note">
          STUB · Stripe Checkout / Payment Element for the $20 unlock fee. Tutor id: <code>{params.tutorId}</code>.
          Payment + post-unlock chat get built next.
        </div>
      </main>
    </>
  );
}

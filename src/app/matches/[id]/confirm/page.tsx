import { TopNav } from "@/components/nav/TopNav";
import { ParentConfirmForm } from "@/components/contact/ParentConfirmForm";

export const metadata = { title: "Confirm lesson · TUTUMatch" };

export default function ParentConfirmPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  const token = searchParams.token ?? "";

  if (!token) {
    return (
      <>
        <TopNav />
        <main className="page-shell">
          <h1>Confirmation link invalid</h1>
          <p>This link is missing a confirmation token. Please use the link from your email.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <main className="page-shell" style={{ maxWidth: 520 }}>
        <h1>Did you have a lesson?</h1>
        <ParentConfirmForm matchId={params.id} token={token} />
      </main>
    </>
  );
}

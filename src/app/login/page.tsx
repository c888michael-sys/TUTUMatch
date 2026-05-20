import { Suspense } from "react";
import { AuthForms } from "@/components/auth/AuthForms";
import { TopNav } from "@/components/nav/TopNav";

export const metadata = { title: "Log in · TUTUMatch" };

export default function LoginPage() {
  return (
    <>
      <TopNav />
      <main className="page-shell auth-shell">
        <h1>Welcome back</h1>
        <p>Log in to manage your tutor profile or to unlock tutors. New here? Create an account in the same form.</p>
        <Suspense fallback={null}>
          <AuthForms defaultMode="login" />
        </Suspense>
      </main>
    </>
  );
}

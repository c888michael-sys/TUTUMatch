export const metadata = { title: "Log in · TutMatch" };

export default function LoginPage() {
  return (
    <main className="page-shell">
      <h1>Log in</h1>
      <div className="stub-note">
        STUB · NextAuth (credentials + OAuth). Parents and tutors share this entry point — role is on the{" "}
        <code>User</code> record.
      </div>
      <p>For under-18 students, the parent should be the account holder per the T&amp;Cs.</p>
    </main>
  );
}

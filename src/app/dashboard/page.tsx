export const metadata = { title: "Dashboard · TutMatch" };

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <h1>Dashboard</h1>
      <div className="stub-note">
        STUB · Role-aware dashboard. Routes per role:
      </div>
      <h2>Tutor</h2>
      <ul>
        <li>Profile status (pending / approved / paused) + visibility toggle.</li>
        <li>Unlock count (lifetime), recent unlocks.</li>
        <li>Inbox: messages from parents who have unlocked.</li>
        <li>Edit profile / availability.</li>
      </ul>
      <h2>Parent</h2>
      <ul>
        <li>Unlocked tutors (contact info revealed).</li>
        <li>Inbox.</li>
        <li>&ldquo;Request refund&rdquo; button on each unlock past its 5-day window with no tutor reply.</li>
      </ul>
    </main>
  );
}

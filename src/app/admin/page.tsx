export const metadata = { title: "Admin · TutMatch" };

export default function AdminPage() {
  return (
    <main className="page-shell">
      <h1>Admin</h1>
      <div className="stub-note">
        STUB · Admin panel. Access gated by <code>User.role = ADMIN</code> (set via the <code>ADMIN_EMAILS</code> env
        list at signup, or manually).
      </div>
      <h2>Verification queue</h2>
      <ul>
        <li>Side-by-side: uploaded ID, WWCC details, HSC document, profile content.</li>
        <li>Approve / reject / request-more-info actions per <code>Verification</code> row.</li>
        <li>Promote <code>TutorProfile.status</code> to <code>APPROVED</code> when all three checks pass.</li>
      </ul>
      <h2>Refund queue</h2>
      <ul>
        <li>
          Auto-flag <code>Unlock</code>s where <code>tutorFirstReplyAt IS NULL</code> and{" "}
          <code>refundEligibleAt &lt; now()</code>.
        </li>
        <li>One-click refund → creates <code>Refund</code> row + Stripe refund + email to parent.</li>
        <li>Manual override: issue refunds outside the auto-flag queue.</li>
      </ul>
      <h2>Schools CRUD</h2>
      <ul>
        <li>Add / edit / deactivate schools. Adding a school = adding a landing page at <code>/schools/[slug]</code>.</li>
        <li>Fields: slug, name, shortName, logo, primary colour, brand-deep, brand-soft, tagline, active, permission evidence URL.</li>
        <li>No code deploy needed.</li>
      </ul>
      <h2>Users + reports + revenue</h2>
      <ul>
        <li>Suspend / ban / delete users.</li>
        <li>Dispute / report queue (<code>Report</code> table).</li>
        <li>Transaction log + revenue dashboard from <code>Payment</code> and <code>Refund</code>.</li>
      </ul>
    </main>
  );
}

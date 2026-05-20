export const metadata = { title: "Unlock tutor · TutMatch" };

export default function UnlockPage({ params }: { params: { tutorId: string } }) {
  return (
    <main className="page-shell">
      <h1>Unlock this tutor</h1>
      <div className="stub-note">
        STUB · Stripe Checkout / Payment Element for the $20 unlock fee. Tutor id: <code>{params.tutorId}</code>.
      </div>
      <h2>Flow</h2>
      <ol>
        <li>Require parent account (sign up / log in if not authenticated).</li>
        <li>Create a Stripe PaymentIntent (or Checkout Session) for <strong>AU$20.00</strong>.</li>
        <li>On <code>payment_intent.succeeded</code> webhook, mark <code>Unlock.status = PAID</code>, set <code>refundEligibleAt = paidAt + 5d</code>, reveal tutor contact info to this parent, and enable in-platform chat.</li>
        <li>Notify the tutor via email: &ldquo;[Parent] has unlocked your profile — remember the $20 first-lesson discount.&rdquo;</li>
      </ol>
    </main>
  );
}

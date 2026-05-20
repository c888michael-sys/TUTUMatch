import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { UnsuspendButton } from "@/components/admin/UnsuspendButton";
import {
  findApplicationById,
  findUserById,
  listUnlocks,
  processOverdueRefunds,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Refunds & suspensions · Admin · TUTUMatch" };
export const dynamic = "force-dynamic";

export default async function AdminRefundsPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/admin/refunds");
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

  // Give the system a chance to flush any overdue refunds before rendering.
  await processOverdueRefunds();

  const unlocks = await listUnlocks();

  // Bucket them
  const now = Date.now();
  const refunded = unlocks.filter((u) => u.status === "REFUNDED");
  const eligibleSoon = unlocks.filter(
    (u) =>
      u.status === "PAID" &&
      !u.tutorFirstReplyAt &&
      Date.parse(u.refundEligibleAt) - now < 1000 * 60 * 60 * 24 * 2 // < 2 days left
  );
  const active = unlocks.filter((u) => u.status === "PAID");

  return (
    <>
      <TopNav />
      <main className="page-shell admin-shell">
        <div className="back-row">
          <Link className="link-like" href="/admin">← Back to applications</Link>
        </div>
        <h1>Refunds &amp; suspensions</h1>
        <p>
          The auto-refund processor flips a paid unlock to <code>REFUNDED</code> and suspends the tutor when they
          go 5 days without replying. It runs lazily on dashboard / messages / this page&apos;s load. Once Stripe
          is wired, the same processor will trigger the actual money movement.
        </p>

        <h2>Auto-refunded ({refunded.length})</h2>
        {refunded.length === 0 ? (
          <p>No refunds processed yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Refunded at</th>
                <th>Parent</th>
                <th>Tutor</th>
                <th>Reason</th>
                <th>Tutor status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {await Promise.all(
                refunded.map(async (u) => {
                  const parent = await findUserById(u.parentUserId);
                  const tutorUser = await findUserById(u.tutorUserId);
                  const app = await findApplicationById(u.tutorApplicationId);
                  return (
                    <tr key={u.id}>
                      <td className="mono-cell">
                        {u.refundedAt ? new Date(u.refundedAt).toLocaleString("en-AU") : "—"}
                      </td>
                      <td className="mono-cell">{parent?.email ?? u.parentUserId}</td>
                      <td>
                        {app ? `${app.firstName} ${app.lastInitial}.` : tutorUser?.email ?? u.tutorUserId}
                        <span className="mono-cell muted"> ({tutorUser?.email ?? "—"})</span>
                      </td>
                      <td className="mono-cell">{u.refundReason ?? "—"}</td>
                      <td>
                        {tutorUser?.suspended ? (
                          <span className="status-pill rejected">Suspended</span>
                        ) : (
                          <span className="status-pill approved">Active</span>
                        )}
                      </td>
                      <td>
                        {tutorUser?.suspended && (
                          <UnsuspendButton userId={tutorUser.id} email={tutorUser.email} />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        <h2 style={{ marginTop: 36 }}>Approaching the 5-day window ({eligibleSoon.length})</h2>
        {eligibleSoon.length === 0 ? (
          <p>No active unlocks within 2 days of refund eligibility.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Paid at</th>
                <th>Parent</th>
                <th>Tutor</th>
                <th>Days left</th>
                <th>Thread</th>
              </tr>
            </thead>
            <tbody>
              {await Promise.all(
                eligibleSoon.map(async (u) => {
                  const parent = await findUserById(u.parentUserId);
                  const app = await findApplicationById(u.tutorApplicationId);
                  const ms = Date.parse(u.refundEligibleAt) - Date.now();
                  const days = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
                  return (
                    <tr key={u.id}>
                      <td className="mono-cell">{new Date(u.paidAt).toLocaleString("en-AU")}</td>
                      <td className="mono-cell">{parent?.email ?? u.parentUserId}</td>
                      <td>{app ? `${app.firstName} ${app.lastInitial}.` : u.tutorUserId}</td>
                      <td className="mono-cell" style={{ color: days <= 1 ? "#B91C1C" : undefined }}>
                        {days} day{days === 1 ? "" : "s"}
                      </td>
                      <td>
                        <Link className="link-like" href={`/messages/${u.id}`}>Open ↗</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        <h2 style={{ marginTop: 36 }}>All active unlocks ({active.length})</h2>
        <p className="muted small">
          For completeness — these are paid unlocks the tutor has either already replied to, or that still have
          more than 2 days before the refund window kicks in.
        </p>
      </main>
    </>
  );
}

import { NextResponse } from "next/server";

// GET /api/cron/refund-flag
//
// Scheduled task (Vercel Cron or external) that runs every ~15 minutes and
// surfaces unlocks past the 5-day no-reply window into the admin refund
// queue. It does not auto-issue refunds — admin still clicks approve so we
// have a human in the loop on disputes.
//
// SELECT * FROM unlocks
//   WHERE status = 'PAID'
//     AND tutor_first_reply_at IS NULL
//     AND refund_eligible_at < now()
//     AND NOT EXISTS (SELECT 1 FROM refunds r WHERE r.unlock_id = unlocks.id);
//
// For each match: create a "REFUND_FLAGGED" event so it surfaces in /admin.

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Require the CRON_SECRET header in production to stop external traffic.
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const got = req.headers.get("x-cron-secret");
    if (got !== expected) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    error: "not_implemented",
    message: "Stub — wire up Prisma + the refund-flagging query above.",
  });
}

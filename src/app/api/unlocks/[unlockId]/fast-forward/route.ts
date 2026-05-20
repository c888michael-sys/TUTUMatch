import { NextResponse } from "next/server";
import {
  findUnlockById,
  patchUnlock,
  processOverdueRefunds,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// POST /api/unlocks/[unlockId]/fast-forward
//
// DEV-ONLY shortcut: backdates refundEligibleAt to two minutes ago and
// runs the overdue-refund processor immediately. Used to demo the
// "tutor doesn't reply within 5 days → refund + suspension" flow without
// waiting five real days.
//
// Only the parent on the unlock can call this. Disabled in production.

export async function POST(_req: Request, { params }: { params: { unlockId: string } }) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev_only" }, { status: 403 });
  }

  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const unlock = await findUnlockById(params.unlockId);
  if (!unlock) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (unlock.parentUserId !== session.userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (unlock.status !== "PAID") {
    return NextResponse.json({ error: "not_active" }, { status: 400 });
  }

  await patchUnlock(unlock.id, {
    refundEligibleAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  });
  const processed = await processOverdueRefunds();
  return NextResponse.json({ ok: true, processed });
}

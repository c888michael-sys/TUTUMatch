import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createUnlock,
  findApplicationById,
  findExistingUnlock,
  newId,
  type Unlock,
} from "@/lib/db";
import { getSession } from "@/lib/session";

// POST /api/unlocks/dev-create
//
// Local-only shortcut that creates an Unlock in PAID state without going
// through Stripe. Lets us demo the chat flow before payments are wired.
//
// When Stripe is live, this route should be deleted (or env-gated to
// non-production only). It is intentionally written so the data shape it
// produces is identical to what the real Stripe webhook will create.

export const runtime = "nodejs";

const Body = z.object({
  tutorApplicationId: z.string().min(1),
});

const FIVE_DAYS_MS = 1000 * 60 * 60 * 24 * 5;

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "dev_only", message: "Dev-create is disabled in production." },
      { status: 403 }
    );
  }

  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const app = await findApplicationById(parsed.data.tutorApplicationId);
  if (!app) return NextResponse.json({ error: "tutor_not_found" }, { status: 404 });
  if (app.userId === session.userId) {
    return NextResponse.json({ error: "cannot_unlock_self" }, { status: 400 });
  }

  const existing = await findExistingUnlock(session.userId, app.id);
  if (existing) {
    return NextResponse.json({ ok: true, unlockId: existing.id, reused: true });
  }

  const now = new Date();
  const unlock: Unlock = {
    id: newId("unlock"),
    parentUserId: session.userId,
    tutorApplicationId: app.id,
    tutorUserId: app.userId,
    amountCents: 2000,
    status: "PAID",
    paidAt: now.toISOString(),
    refundEligibleAt: new Date(now.getTime() + FIVE_DAYS_MS).toISOString(),
    isDev: true,
  };
  await createUnlock(unlock);

  return NextResponse.json({ ok: true, unlockId: unlock.id, reused: false });
}

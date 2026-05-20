import { NextResponse } from "next/server";
import { z } from "zod";

// POST /api/refund
//
// Two callers:
//   - Parent dashboard "Request refund" button, post-5-day window.
//   - Admin one-click approval from the auto-flagged queue.
//
// Validates that:
//   - Unlock exists, status = PAID, refundEligibleAt is in the past,
//     tutorFirstReplyAt is NULL, and no Refund row yet.
//
// Then: creates Refund row (PENDING) + Stripe refund.
// The charge.refunded webhook completes the loop.
//
// STUB.

const Body = z.object({
  unlockId: z.string().min(1),
  reason: z.enum(["TUTOR_NO_REPLY_5_DAY", "ADMIN_DISCRETION", "PARENT_REPORTED_DISCOUNT_NOT_APPLIED", "OTHER"]),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json(
    { error: "not_implemented", message: "Stub — see prisma/schema.prisma `Refund`." },
    { status: 501 }
  );
}

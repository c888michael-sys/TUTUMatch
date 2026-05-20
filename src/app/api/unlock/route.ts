import { NextResponse } from "next/server";
import { z } from "zod";

// POST /api/unlock
//
// Body: { tutorProfileId: string }
//
// Creates a PENDING_PAYMENT Unlock row + a Stripe PaymentIntent for AU$20.
// Client then confirms on Stripe; the webhook at /api/stripe/webhook flips
// the unlock to PAID, sets refundEligibleAt, and emails the tutor.
//
// STUB — see prisma/schema.prisma `Unlock` for the data shape.

const Body = z.object({
  tutorProfileId: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  // TODO:
  //   1. Require authenticated parent (NextAuth session).
  //   2. Check no existing PAID Unlock for (parentUserId, tutorProfileId).
  //   3. Create Unlock row in PENDING_PAYMENT state.
  //   4. Stripe.paymentIntents.create({ amount: 2000, currency: "aud", metadata: { unlockId } }).
  //   5. Return { unlockId, clientSecret } for the client to confirm.

  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "Stub — wire up NextAuth + Prisma + Stripe before this can run. See prisma/schema.prisma `Unlock`.",
    },
    { status: 501 }
  );
}

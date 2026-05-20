import { NextResponse } from "next/server";

// POST /api/stripe/webhook
//
// Stripe webhook handler. Reads raw body for signature verification.
//
// Events we care about:
//   - payment_intent.succeeded   → mark Unlock PAID + set refundEligibleAt = now + 5d
//                                  + email tutor with the "remember the $20 discount" reminder
//   - payment_intent.payment_failed → leave Unlock as PENDING_PAYMENT, surface to user
//   - charge.refunded            → mark Refund PROCESSED + email parent
//
// STUB — wiring requires STRIPE_WEBHOOK_SECRET.

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  // const raw = await req.text();
  // const event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  // switch (event.type) { ... }

  return NextResponse.json(
    {
      error: "not_implemented",
      message: "Stub — install `stripe` and verify the webhook signature.",
    },
    { status: 501 }
  );
}

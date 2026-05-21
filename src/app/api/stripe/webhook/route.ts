import { NextResponse } from "next/server";

// POST /api/stripe/webhook
//
// Stripe webhook handler. Reads raw body for signature verification.
//
// Events we care about (wired in session 3, when tutor-side Stripe Connect lands):
//   - payment_intent.succeeded   → mark the related Match commission as paid
//   - payment_intent.payment_failed → hide the tutor's listing pending a payment-method update
//   - charge.refunded            → handle a TUTUMatch Permanent refund
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

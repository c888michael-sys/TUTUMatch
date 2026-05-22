// Stripe client + commission-charging helpers.
//
// TUTUMatch uses plain Stripe (no Connect): the platform charges tutors a
// commission on a card they have saved. Parents never pay TUTUMatch, so there
// is no money to route between parties — there is only a tutor card to charge.

import Stripe from "stripe";
import { patchApplication, type TutorApplication } from "./db";

const secretKey = process.env.STRIPE_SECRET_KEY ?? "";

// Stripe is "enabled" only when a real secret key is configured. Until then
// (e.g. before .env.local is filled in) every payment path no-ops cleanly so
// the rest of the app keeps working.
export const stripeEnabled = secretKey.startsWith("sk_") && !secretKey.includes("REPLACE_ME");

export const stripe: Stripe | null = stripeEnabled ? new Stripe(secretKey) : null;

// Ensure the tutor has a Stripe Customer; returns the customer id (or null if
// Stripe isn't configured). Persists a newly created customer onto the record.
export async function ensureStripeCustomer(app: TutorApplication): Promise<string | null> {
  if (!stripe) return null;
  if (app.stripeCustomerId) return app.stripeCustomerId;
  const customer = await stripe.customers.create({
    email: app.contactEmail,
    name: `${app.firstName} ${app.fullLastName}`,
    metadata: { tutorApplicationId: app.id, tutorUserId: app.userId },
  });
  await patchApplication(app.id, { stripeCustomerId: customer.id });
  return customer.id;
}

export type ChargeResult =
  | { ok: true; chargeId: string }
  | { ok: false; reason: "stripe_disabled" | "no_card" | "charge_failed"; message?: string };

// Charge a tutor their commission off-session, against the card they saved.
// Returns a structured result rather than throwing so callers can resolve the
// match regardless and surface a "payment pending" state on failure.
export async function chargeTutorCommission(
  app: TutorApplication,
  amountCents: number,
  description: string
): Promise<ChargeResult> {
  if (!stripe) return { ok: false, reason: "stripe_disabled" };
  if (!app.stripeCustomerId || !app.stripeDefaultPaymentMethodId) {
    return { ok: false, reason: "no_card" };
  }
  try {
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "aud",
      customer: app.stripeCustomerId,
      payment_method: app.stripeDefaultPaymentMethodId,
      off_session: true,
      confirm: true,
      description,
      metadata: { tutorApplicationId: app.id, tutorUserId: app.userId },
    });
    return { ok: true, chargeId: intent.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    return { ok: false, reason: "charge_failed", message };
  }
}

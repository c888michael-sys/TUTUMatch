import { NextResponse } from "next/server";
import { z } from "zod";
import { findMatchById, findApplicationById, patchMatch, patchApplication, hashToken } from "@/lib/db";
import { applyStrike, commissionCents, isFirstFreeMatch } from "@/lib/strike";
import { chargeTutorCommission } from "@/lib/stripe";
import { sendTutorStrikeEmail } from "@/lib/email";

export const runtime = "nodejs";

const Body = z.object({
  response: z.enum(["YES", "NO", "NOT_YET"]),
  token: z.string().min(1),
});

// POST /api/matches/[id]/parent-confirm
// No session required — validated by single-use token from the confirmation email link.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "validation" }, { status: 400 });

  const match = await findMatchById(params.id);
  if (!match) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (match.status !== "AWAITING_RESOLUTION") {
    return NextResponse.json({ error: "already_resolved", status: match.status }, { status: 409 });
  }

  const tokenHash = hashToken(parsed.data.token);
  if (!match.parentConfirmTokenHash || match.parentConfirmTokenHash !== tokenHash) {
    return NextResponse.json({ error: "invalid_token" }, { status: 403 });
  }

  const app = await findApplicationById(match.tutorApplicationId);
  if (!app) return NextResponse.json({ error: "tutor_not_found" }, { status: 404 });

  const now = new Date().toISOString();
  const { response } = parsed.data;

  if (response === "NOT_YET") {
    const sent = (match.parentConfirmRemindersSent ?? 0) + 1;
    await patchMatch(params.id, {
      parentConfirmation: "NOT_YET",
      parentConfirmedAt: now,
      parentConfirmRemindersSent: sent,
    });
    return NextResponse.json({ result: "not_yet", remindersSent: sent });
  }

  if (response === "NO") {
    // Keep status AWAITING_RESOLUTION so the tutor can appeal within 7 days.
    await patchMatch(params.id, { parentConfirmation: "NO", parentConfirmedAt: now });
    await patchApplication(app.id, { hiddenUntil: undefined });
    return NextResponse.json({ result: "no_match" });
  }

  // YES — parent confirms a lesson happened
  const tutorLied = match.tutorSelfReport === "NO";
  const free = isFirstFreeMatch(app);
  const cents = free ? 0 : commissionCents(app, false); // $20 (no honesty discount)

  let stripeChargeId: string | undefined;
  if (cents > 0) {
    const charge = await chargeTutorCommission(
      app,
      cents,
      `TUTUMatch commission — parent-confirmed match ${match.id}`
    );
    if (charge.ok) stripeChargeId = charge.chargeId;
    else console.warn(`[stripe] commission not charged for match ${match.id}: ${charge.reason}`);
  }

  await patchMatch(params.id, {
    parentConfirmation: "YES",
    parentConfirmedAt: now,
    status: "RESOLVED_PARENT_CONFIRMED",
    resolvedAt: now,
    amountChargedCents: cents,
    stripeChargeId,
  });
  await patchApplication(app.id, {
    hiddenUntil: undefined,
    matchesCompletedCount: (app.matchesCompletedCount ?? 0) + 1,
  });

  if (tutorLied) {
    const updated = await applyStrike(app, match);
    await sendTutorStrikeEmail({
      tutorEmail: app.contactEmail,
      tutorFirstName: app.firstName,
      strikeNumber: updated.strikeCount ?? 1,
      hiddenUntil: updated.hiddenUntil ?? "",
    });
  }

  return NextResponse.json({ result: "confirmed", chargedCents: cents, strikeApplied: tutorLied });
}

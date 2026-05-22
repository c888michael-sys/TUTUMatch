import { NextResponse } from "next/server";
import { z } from "zod";
import { findMatchById, findApplicationById, patchMatch, patchApplication } from "@/lib/db";
import { commissionCents, isFirstFreeMatch } from "@/lib/strike";
import { chargeTutorCommission } from "@/lib/stripe";
import { getSession } from "@/lib/session";
import { sendTutorSelfReportResultEmail } from "@/lib/email";

export const runtime = "nodejs";

const Body = z.object({ report: z.enum(["YES", "NO"]) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "TUTOR") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "validation" }, { status: 400 });

  const match = await findMatchById(params.id);
  if (!match) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (match.tutorUserId !== session.userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (match.status !== "AWAITING_RESOLUTION") {
    return NextResponse.json({ error: "already_resolved" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const app = await findApplicationById(match.tutorApplicationId);
  if (!app) return NextResponse.json({ error: "tutor_not_found" }, { status: 404 });

  if (parsed.data.report === "NO") {
    await patchMatch(params.id, {
      tutorSelfReport: "NO",
      tutorSelfReportedAt: now,
      status: "RESOLVED_NO_MATCH",
      resolvedAt: now,
    });
    await patchApplication(app.id, { hiddenUntil: undefined });
    await sendTutorSelfReportResultEmail({
      tutorEmail: app.contactEmail,
      tutorFirstName: app.firstName,
      result: "no_charge",
    });
    return NextResponse.json({ result: "no_match", chargedCents: 0 });
  }

  // YES — tutor confirms a match happened
  const free = isFirstFreeMatch(app);
  const cents = free ? 0 : commissionCents(app, true); // $15 honesty rate

  let stripeChargeId: string | undefined;
  if (cents > 0) {
    const charge = await chargeTutorCommission(
      app,
      cents,
      `TUTUMatch commission — self-reported match ${match.id}`
    );
    if (charge.ok) stripeChargeId = charge.chargeId;
    else console.warn(`[stripe] commission not charged for match ${match.id}: ${charge.reason}`);
  }

  await patchMatch(params.id, {
    tutorSelfReport: "YES",
    tutorSelfReportedAt: now,
    status: "RESOLVED_TUTOR_CONFIRMED",
    resolvedAt: now,
    amountChargedCents: cents,
    stripeChargeId,
  });
  await patchApplication(app.id, {
    hiddenUntil: undefined,
    matchesCompletedCount: (app.matchesCompletedCount ?? 0) + 1,
  });
  await sendTutorSelfReportResultEmail({
    tutorEmail: app.contactEmail,
    tutorFirstName: app.firstName,
    result: cents === 1500 ? "charged_15" : "charged_20",
  });

  return NextResponse.json({ result: "confirmed", chargedCents: cents, isFreeFirstMatch: free });
}

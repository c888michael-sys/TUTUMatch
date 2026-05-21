import { NextResponse } from "next/server";
import { z } from "zod";
import {
  findAppealById, patchAppeal, findMatchById, findApplicationById,
  patchMatch, patchApplication,
} from "@/lib/db";
import { applyStrike, commissionCents, isFirstFreeMatch } from "@/lib/strike";
import { getSession } from "@/lib/session";
import { sendTutorStrikeEmail } from "@/lib/email";

export const runtime = "nodejs";

const Body = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional(),
});

// POST /api/admin/appeals/[id]
// Admin approves (tutor wins: charged $20, no strike) or rejects (strike applied).
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "validation" }, { status: 400 });

  const appeal = await findAppealById(params.id);
  if (!appeal) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (appeal.status !== "PENDING") return NextResponse.json({ error: "already_decided" }, { status: 409 });

  const match = await findMatchById(appeal.matchId);
  const app = match ? await findApplicationById(match.tutorApplicationId) : undefined;
  if (!match || !app) return NextResponse.json({ error: "match_not_found" }, { status: 404 });

  const now = new Date().toISOString();

  await patchAppeal(params.id, {
    status: parsed.data.decision,
    reviewerEmail: session.email,
    reviewerNotes: parsed.data.notes,
    resolvedAt: now,
  });

  if (parsed.data.decision === "APPROVED") {
    // Tutor wins: charge $20 standard (no honesty discount — they didn't self-report)
    const free = isFirstFreeMatch(app);
    const cents = free ? 0 : 2000;
    // TODO (session 3 Stripe): charge tutor via Stripe Connect
    console.log("[stripe:stub] Charge tutor", app.userId, cents, "cents (appeal approved, match", match.id + ")");
    await patchMatch(appeal.matchId, {
      status: "RESOLVED_APPEALED_WON",
      resolvedAt: now,
      amountChargedCents: cents,
    });
    await patchApplication(app.id, {
      hiddenUntil: undefined,
      matchesCompletedCount: (app.matchesCompletedCount ?? 0) + 1,
    });
  } else {
    // Tutor loses: apply strike
    const updated = await applyStrike(app, match);
    await patchMatch(appeal.matchId, { status: "RESOLVED_APPEALED_LOST", resolvedAt: now });
    await sendTutorStrikeEmail({
      tutorEmail: app.contactEmail,
      tutorFirstName: app.firstName,
      strikeNumber: updated.strikeCount ?? 1,
      hiddenUntil: updated.hiddenUntil ?? "",
    });
  }

  return NextResponse.json({ decision: parsed.data.decision });
}

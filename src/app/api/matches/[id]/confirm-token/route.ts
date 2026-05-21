import { NextResponse } from "next/server";
import { findMatchById, findApplicationById, patchMatch, generateToken, hashToken } from "@/lib/db";
import { getSession } from "@/lib/session";
import { sendParentConfirmEmail } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/matches/[id]/confirm-token
// Admin/cron: issue a fresh parent-confirm token and send the email.
// Called by the cron job at 48h, 7d, 14d, 30d after match creation.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const match = await findMatchById(params.id);
  if (!match) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (match.status !== "AWAITING_RESOLUTION") {
    return NextResponse.json({ error: "already_resolved" }, { status: 409 });
  }

  const app = await findApplicationById(match.tutorApplicationId);
  const token = generateToken();
  await patchMatch(params.id, { parentConfirmTokenHash: hashToken(token) });

  await sendParentConfirmEmail({
    parentEmail: match.parentEmail,
    tutorFirstName: app?.firstName ?? "your tutor",
    matchId: match.id,
    confirmToken: token,
    reminderNumber: match.parentConfirmRemindersSent ?? 0,
  });

  return NextResponse.json({ sent: true });
}

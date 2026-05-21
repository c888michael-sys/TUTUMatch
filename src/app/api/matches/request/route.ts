import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createMatch,
  findApplicationById,
  findOpenMatch,
  newId,
  patchApplication,
  type Match,
} from "@/lib/db";
import { getSession } from "@/lib/session";
import { sendTutorMatchNotification } from "@/lib/email";

// POST /api/matches/request
//
// The free "I want this tutor" action. Creates a Match record, temp-hides the
// tutor's listing for 48h, notifies the tutor, and returns the tutor's contact
// details so the parent can reach out directly. No payment — parents never pay.

export const runtime = "nodejs";

const MATCH_WINDOW_MS = 1000 * 60 * 60 * 48; // 48 hours

const Body = z.object({
  tutorApplicationId: z.string().min(1),
  parentEmail: z.string().email("Enter a valid email address"),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }
  const { tutorApplicationId, parentEmail } = parsed.data;

  const app = await findApplicationById(tutorApplicationId);
  if (!app || app.status !== "APPROVED") {
    return NextResponse.json({ error: "tutor_not_found" }, { status: 404 });
  }

  const session = getSession();

  // The contact details the parent receives once the match is created.
  const tutor = {
    firstName: app.firstName,
    fullName: `${app.firstName} ${app.fullLastName}`,
    phone: app.phone,
    email: app.contactEmail,
  };

  // Dedupe: a parent who clicks twice gets the same match back, not a new one.
  const existing = await findOpenMatch(app.id, parentEmail);
  if (existing) {
    return NextResponse.json({ matchId: existing.id, tutor, reused: true }, { status: 200 });
  }

  const now = new Date();
  const hiddenUntil = new Date(now.getTime() + MATCH_WINDOW_MS).toISOString();

  const match: Match = {
    id: newId("app_match"),
    parentEmail,
    parentUserId: session?.userId,
    tutorApplicationId: app.id,
    tutorUserId: app.userId,
    status: "AWAITING_RESOLUTION",
    createdAt: now.toISOString(),
    tutorHiddenUntil: hiddenUntil,
    parentConfirmRemindersSent: 0,
    isFreeFirstMatch: (app.matchesCompletedCount ?? 0) === 0,
  };
  await createMatch(match);

  // Temp-hide the tutor's listing from public browse for the 48h window so two
  // parents can't simultaneously "claim" the same tutor.
  await patchApplication(app.id, { hiddenUntil });

  // Notify the tutor. Placeholder — logs to console; wired to Resend in session 5.
  await sendTutorMatchNotification({
    tutorEmail: app.contactEmail,
    tutorFirstName: app.firstName,
    parentEmail,
    matchId: match.id,
  });

  return NextResponse.json({ matchId: match.id, tutor, reused: false }, { status: 201 });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { findMatchById, findApplicationById, createAppeal, patchMatch, newId } from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const Body = z.object({
  description: z.string().min(20, "Please describe your appeal in at least 20 characters."),
  evidenceUploadIds: z.array(z.string()).max(5).default([]),
});

// POST /api/matches/[id]/appeal
// Tutor files an appeal after the parent said NO.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "TUTOR") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const match = await findMatchById(params.id);
  if (!match) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (match.tutorUserId !== session.userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (match.parentConfirmation !== "NO") {
    return NextResponse.json({ error: "appeal_requires_parent_no" }, { status: 409 });
  }
  if (match.appealId) {
    return NextResponse.json({ error: "appeal_already_filed" }, { status: 409 });
  }

  const app = await findApplicationById(match.tutorApplicationId);
  if (!app) return NextResponse.json({ error: "tutor_not_found" }, { status: 404 });

  const appealId = newId("appeal");
  await createAppeal({
    id: appealId,
    matchId: match.id,
    tutorUserId: session.userId,
    description: parsed.data.description,
    evidenceUploadIds: parsed.data.evidenceUploadIds,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  });
  await patchMatch(params.id, { appealId });

  return NextResponse.json({ appealId }, { status: 201 });
}

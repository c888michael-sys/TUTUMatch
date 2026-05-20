import { NextResponse } from "next/server";
import { z } from "zod";
import { findApplicationByUserId, upsertApplication } from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// PATCH /api/tutor/applications/visibility
// Body: { visibility: boolean }
//
// Tutor-only quick toggle. Does NOT change status or trigger re-review —
// visibility is an independent control they own. Hidden profiles still
// exist in the DB and the admin can still see them; they just don't
// appear in /browse or /schools/[slug].

const Body = z.object({ visibility: z.boolean() });

export async function PATCH(req: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const existing = await findApplicationByUserId(session.userId);
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const updated = { ...existing, visibility: parsed.data.visibility };
  await upsertApplication(updated);
  return NextResponse.json({ ok: true, visibility: updated.visibility });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { findApplicationById, updateApplicationStatus } from "@/lib/db";

export const runtime = "nodejs";

const PatchBody = z.object({
  status: z.enum(["PENDING_REVIEW", "APPROVED", "PAUSED", "REJECTED"]),
  notes: z.string().max(1000).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const app = await findApplicationById(params.id);
  if (!app) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ application: app });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const json = await req.json().catch(() => ({}));
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await updateApplicationStatus(
    params.id,
    parsed.data.status,
    session.email,
    parsed.data.notes
  );
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ application: updated });
}

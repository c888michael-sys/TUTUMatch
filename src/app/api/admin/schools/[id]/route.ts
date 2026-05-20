import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { deleteSchool, loadSchools, upsertSchool } from "@/lib/schools-store";

export const runtime = "nodejs";

const ColorRe = /^#[0-9A-Fa-f]{6}$/;

const Patch = z
  .object({
    name: z.string().trim().min(2).max(120),
    short: z.string().trim().min(1).max(40),
    tagline: z.string().trim().min(1).max(200),
    brand: z.string().regex(ColorRe),
    brandDeep: z.string().regex(ColorRe),
    brandSoft: z.string().regex(ColorRe),
    active: z.boolean(),
  })
  .partial();

function requireAdmin() {
  const session = getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (params.id === "default" || params.id === "other") {
    return NextResponse.json({ error: "reserved" }, { status: 400 });
  }
  const json = await req.json().catch(() => ({}));
  const parsed = Patch.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }
  const all = await loadSchools();
  const existing = all.find((s) => s.id === params.id);
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const merged = { ...existing, ...parsed.data, id: existing.id };
  await upsertSchool(merged);
  return NextResponse.json({ ok: true, school: merged });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (params.id === "default" || params.id === "other") {
    return NextResponse.json({ error: "reserved" }, { status: 400 });
  }
  const ok = await deleteSchool(params.id);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

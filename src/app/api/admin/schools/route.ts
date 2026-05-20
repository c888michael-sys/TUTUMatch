import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { loadSchools, upsertSchool } from "@/lib/schools-store";
import { slugify } from "@/lib/schools";

export const runtime = "nodejs";

const ColorRe = /^#[0-9A-Fa-f]{6}$/;

const Body = z.object({
  // Optional slug override; if omitted we derive from `name`.
  id: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters / digits / hyphens").min(2).max(60).optional(),
  name: z.string().trim().min(2).max(120),
  short: z.string().trim().min(1).max(40),
  tagline: z.string().trim().min(1).max(200),
  brand: z.string().regex(ColorRe, "Use a #RRGGBB hex value"),
  brandDeep: z.string().regex(ColorRe, "Use a #RRGGBB hex value"),
  brandSoft: z.string().regex(ColorRe, "Use a #RRGGBB hex value"),
  active: z.boolean(),
});

async function requireAdmin() {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const schools = await loadSchools();
  return NextResponse.json({ schools });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }
  const all = await loadSchools();
  const id = parsed.data.id ?? slugify(parsed.data.name);
  if (!id || id === "default" || id === "other") {
    return NextResponse.json(
      { error: "validation", details: { fieldErrors: { id: ["Reserved slug — pick a different one"] } } },
      { status: 400 }
    );
  }
  if (all.some((s) => s.id === id)) {
    return NextResponse.json(
      { error: "validation", details: { fieldErrors: { id: ["A school with this slug already exists"] } } },
      { status: 409 }
    );
  }
  const school = { ...parsed.data, id };
  await upsertSchool(school);
  return NextResponse.json({ ok: true, school });
}

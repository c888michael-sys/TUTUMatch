import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createReport,
  newId,
  REPORT_REASON_LABELS,
  type Report,
  type ReportKind,
  type ReportReason,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const Body = z.object({
  subjectKind: z.enum(["USER", "APPLICATION", "MESSAGE"]),
  subjectId: z.string().min(1),
  subjectThreadId: z.string().optional(),
  reason: z.string().refine((r) => r in REPORT_REASON_LABELS, { message: "Pick a valid reason" }),
  description: z.string().trim().min(10, "Tell us what happened (at least 10 chars)").max(2000),
});

export async function POST(req: Request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const report: Report = {
    id: newId("rpt"),
    reporterUserId: session.userId,
    reporterEmail: session.email,
    subjectKind: parsed.data.subjectKind as ReportKind,
    subjectId: parsed.data.subjectId,
    subjectThreadId: parsed.data.subjectThreadId,
    reason: parsed.data.reason as ReportReason,
    description: parsed.data.description,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };
  await createReport(report);
  return NextResponse.json({ ok: true, reportId: report.id });
}

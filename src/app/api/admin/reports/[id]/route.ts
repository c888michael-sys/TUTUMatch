import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  findReportById,
  findUserById,
  listUsers,
  patchReport,
  type ReportAction,
  type StoredUser,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

const Patch = z.object({
  status: z.enum(["OPEN", "RESOLVED", "DISMISSED"]),
  resolverNotes: z.string().max(2000).optional(),
  actionTaken: z
    .enum(["NONE", "WARNED_USER", "SUSPENDED_USER", "REJECTED_APPLICATION", "REFUNDED_PARENT"])
    .optional(),
  // When actionTaken is SUSPENDED_USER, the admin can pass the user id to suspend.
  // Defaults to the report's subject when subjectKind === "USER".
  suspendUserId: z.string().optional(),
});

async function writeUsers(users: StoredUser[]) {
  const tmp = `${USERS_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2));
  await fs.rename(tmp, USERS_FILE);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const report = await findReportById(params.id);
  if (!report) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const json = await req.json().catch(() => ({}));
  const parsed = Patch.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  // If the admin chose to suspend a user as the action, do it now.
  if (parsed.data.actionTaken === "SUSPENDED_USER") {
    const userId =
      parsed.data.suspendUserId ?? (report.subjectKind === "USER" ? report.subjectId : undefined);
    if (userId) {
      const target = await findUserById(userId);
      if (target && !target.suspended) {
        const users = await listUsers();
        const updated = users.map((u) =>
          u.id === userId
            ? {
                ...u,
                suspended: true,
                suspendedAt: new Date().toISOString(),
                suspendedReason: `Report ${report.id} resolved with SUSPENDED_USER. Notes: ${parsed.data.resolverNotes ?? ""}`,
              }
            : u
        );
        await writeUsers(updated);
      }
    }
  }

  const updated = await patchReport(params.id, {
    status: parsed.data.status,
    resolvedAt: parsed.data.status === "OPEN" ? undefined : new Date().toISOString(),
    resolverEmail: parsed.data.status === "OPEN" ? undefined : session.email,
    resolverNotes: parsed.data.resolverNotes,
    actionTaken: parsed.data.actionTaken as ReportAction | undefined,
  });

  return NextResponse.json({ ok: true, report: updated });
}

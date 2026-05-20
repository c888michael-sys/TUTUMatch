import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { findUserById, listUsers, type StoredUser } from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// POST /api/admin/users/[id]/unsuspend
//
// Clears the suspension fields on a user record. Admin-only. The user can
// then log in again. Used when a tutor appeals successfully.

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

async function writeUsers(users: StoredUser[]) {
  const tmp = `${USERS_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2));
  await fs.rename(tmp, USERS_FILE);
}

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const target = await findUserById(params.id);
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!target.suspended) return NextResponse.json({ ok: true, alreadyActive: true });

  const users = await listUsers();
  const updated = users.map((u) =>
    u.id === params.id
      ? { ...u, suspended: false, suspendedAt: undefined, suspendedReason: undefined }
      : u
  );
  await writeUsers(updated);
  return NextResponse.json({ ok: true });
}

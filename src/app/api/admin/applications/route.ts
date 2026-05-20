import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listApplications } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const apps = await listApplications();
  // newest first
  apps.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return NextResponse.json({ applications: apps });
}

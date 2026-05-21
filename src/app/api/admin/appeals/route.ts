import { NextResponse } from "next/server";
import { listAppeals } from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const appeals = await listAppeals();
  appeals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(appeals);
}

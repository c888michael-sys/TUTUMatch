import { NextResponse } from "next/server";
import { findUpload, readUploadBytes } from "@/lib/uploads";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// GET /api/uploads/[id] — serves a tutor's verification document.
//
// Access:
//   - The uploading user (the tutor themselves) can fetch their own files.
//   - Admins can fetch any file.
// Anyone else gets 403.

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const record = await findUpload(params.id);
  if (!record) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const isOwner = record.userId === session.userId;
  const isAdmin = session.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const bytes = await readUploadBytes(record);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": record.contentType,
      // Browsers can preview PDFs/images inline. Use the original filename
      // for the download fallback so the admin can save a sensible name.
      "Content-Disposition": `inline; filename="${encodeURIComponent(record.filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

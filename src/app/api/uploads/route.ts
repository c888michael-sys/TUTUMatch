import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  isAllowedMime,
  maxBytes,
  saveUpload,
  type UploadKind,
} from "@/lib/uploads";

export const runtime = "nodejs";

// POST /api/uploads — multipart form-data
//   file: the document binary
//   kind: "id_document" | "wwcc_document" | "hsc_document"

const VALID_KINDS = new Set(["id_document", "wwcc_document", "hsc_document"]);

export async function POST(req: Request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const file = form.get("file");
  const kind = String(form.get("kind") ?? "");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (!VALID_KINDS.has(kind)) {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }
  if (!isAllowedMime(file.type)) {
    return NextResponse.json(
      { error: "invalid_type", message: "Only PDF, JPG, PNG, HEIC or WEBP are allowed." },
      { status: 400 }
    );
  }
  if (file.size > maxBytes()) {
    return NextResponse.json(
      { error: "too_large", message: `Max ${Math.round(maxBytes() / 1024 / 1024)} MB.` },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const record = await saveUpload({
    userId: session.userId,
    kind: kind as UploadKind,
    filename: file.name || "upload",
    contentType: file.type,
    bytes: buf,
  });

  return NextResponse.json({
    ok: true,
    upload: {
      id: record.id,
      kind: record.kind,
      filename: record.filename,
      sizeBytes: record.sizeBytes,
      createdAt: record.createdAt,
    },
  });
}

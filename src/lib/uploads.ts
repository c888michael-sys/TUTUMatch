// Local-only file storage for tutor verification documents.
//
// Files go to data/uploads/<userId>/<uploadId><ext>. The user record / tutor
// application stores the upload's id + original filename + MIME type, and we
// serve via signed-by-session route /api/uploads/[id] that re-checks access.
//
// This is NOT production-grade. Real launch needs Supabase Storage / S3 with
// signed URLs + at-rest encryption, and a virus scan. See the README
// roadmap. Until then this lets the workflow ship end-to-end.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "data", "uploads");

// Each user has a manifest in `data/uploads/<userId>/manifest.json` listing
// their uploads with metadata. Keeps lookups fast and reduces fs guesswork.
type Manifest = {
  uploads: UploadRecord[];
};

export type UploadKind = "id_document" | "wwcc_document" | "hsc_document" | "other";

export type UploadRecord = {
  id: string;
  userId: string;
  kind: UploadKind;
  filename: string;       // original filename
  contentType: string;
  sizeBytes: number;
  storedExt: string;      // ".pdf" / ".jpg" / etc
  createdAt: string;
};

function manifestPath(userId: string) {
  return path.join(ROOT, userId, "manifest.json");
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function readManifest(userId: string): Promise<Manifest> {
  try {
    const buf = await fs.readFile(manifestPath(userId), "utf8");
    return JSON.parse(buf) as Manifest;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { uploads: [] };
    throw err;
  }
}

async function writeManifest(userId: string, m: Manifest) {
  await ensureDir(path.join(ROOT, userId));
  const p = manifestPath(userId);
  const tmp = `${p}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(m, null, 2));
  await fs.rename(tmp, p);
}

// Allowed types — anything else is rejected at upload time.
const ALLOWED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/heic": ".heic",
  "image/webp": ".webp",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB — enough for a phone-snap of an ID

export function isAllowedMime(m: string): boolean {
  return m.toLowerCase() in ALLOWED_MIME;
}

export function maxBytes(): number {
  return MAX_BYTES;
}

export function pickExt(contentType: string): string {
  return ALLOWED_MIME[contentType.toLowerCase()] ?? ".bin";
}

function newUploadId(): string {
  return `up_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export async function saveUpload(opts: {
  userId: string;
  kind: UploadKind;
  filename: string;
  contentType: string;
  bytes: Buffer;
}): Promise<UploadRecord> {
  const ext = pickExt(opts.contentType);
  const id = newUploadId();
  const userDir = path.join(ROOT, opts.userId);
  await ensureDir(userDir);
  const filePath = path.join(userDir, id + ext);
  await fs.writeFile(filePath, opts.bytes);

  const record: UploadRecord = {
    id,
    userId: opts.userId,
    kind: opts.kind,
    filename: opts.filename,
    contentType: opts.contentType,
    sizeBytes: opts.bytes.length,
    storedExt: ext,
    createdAt: new Date().toISOString(),
  };
  const m = await readManifest(opts.userId);
  m.uploads.push(record);
  await writeManifest(opts.userId, m);
  return record;
}

export async function listUserUploads(userId: string): Promise<UploadRecord[]> {
  const m = await readManifest(userId);
  return m.uploads;
}

export async function findUpload(uploadId: string): Promise<UploadRecord | undefined> {
  // We don't know the user up front, so we walk the upload dirs. Cheap enough
  // for the JSON-store scale; once we move to a DB this becomes one query.
  try {
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const m = await readManifest(e.name);
      const hit = m.uploads.find((u) => u.id === uploadId);
      if (hit) return hit;
    }
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return undefined;
    throw err;
  }
  return undefined;
}

export async function readUploadBytes(record: UploadRecord): Promise<Buffer> {
  const filePath = path.join(ROOT, record.userId, record.id + record.storedExt);
  return fs.readFile(filePath);
}

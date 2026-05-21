"use client";

import { useRef, useState } from "react";

type Kind = "id_document" | "wwcc_document" | "hsc_document";

export function DocumentUploader({
  kind,
  label,
  hint,
  initialUploadId,
  initialFilename,
  onChange,
}: {
  kind: Kind;
  label: string;
  hint?: string;
  initialUploadId?: string;
  initialFilename?: string;
  onChange: (uploadId: string | undefined, filename?: string) => void;
}) {
  const [uploadId, setUploadId] = useState<string | undefined>(initialUploadId);
  const [filename, setFilename] = useState<string | undefined>(initialFilename);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setErr(data?.message ?? "Upload failed");
        return;
      }
      setUploadId(data.upload.id);
      setFilename(data.upload.filename);
      onChange(data.upload.id, data.upload.filename);
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    setUploadId(undefined);
    setFilename(undefined);
    onChange(undefined, undefined);
  }

  return (
    <div className="doc-uploader">
      <div className="doc-uploader-label">{label}</div>
      {uploadId ? (
        <div className="doc-uploader-current">
          <span className="doc-tick">✓</span>
          <a
            href={`/api/uploads/${uploadId}`}
            target="_blank"
            rel="noopener"
            className="doc-uploader-filename"
          >
            {filename ?? "Uploaded"}
          </a>
          <button type="button" className="btn ghost sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            Replace
          </button>
          <button type="button" className="btn ghost sm danger" onClick={clear} disabled={busy}>
            Remove
          </button>
        </div>
      ) : (
        <div className="doc-uploader-pick">
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? "Uploading…" : "Choose file"}
          </button>
          <span className="doc-uploader-empty">No file yet</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/jpg,image/png,image/heic,image/webp"
        onChange={onPick}
        style={{ display: "none" }}
      />
      {hint && !err && <small className="hint">{hint}</small>}
      {err && <small className="field-error">{err}</small>}
    </div>
  );
}

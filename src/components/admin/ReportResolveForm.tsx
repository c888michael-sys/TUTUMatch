"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Action = "NONE" | "WARNED_USER" | "SUSPENDED_USER" | "REJECTED_APPLICATION" | "REFUNDED_PARENT";

export function ReportResolveForm({
  reportId,
  suspendableUserId,
}: {
  reportId: string;
  suspendableUserId?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [action, setAction] = useState<Action>("NONE");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function send(status: "RESOLVED" | "DISMISSED") {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          resolverNotes: notes.trim() || undefined,
          actionTaken: status === "RESOLVED" ? action : "NONE",
          suspendUserId: action === "SUSPENDED_USER" ? suspendableUserId : undefined,
        }),
      });
      if (!res.ok) {
        setErr("Save failed");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="report-resolve">
      <div className="report-resolve-row">
        <label className="field">
          <span>Action taken</span>
          <select value={action} onChange={(e) => setAction(e.target.value as Action)}>
            <option value="NONE">None — just close it</option>
            <option value="WARNED_USER">Warned user (out-of-band email)</option>
            <option value="SUSPENDED_USER" disabled={!suspendableUserId}>
              Suspend user {suspendableUserId ? "" : "(no user id available)"}
            </option>
            <option value="REJECTED_APPLICATION">Rejected the application</option>
            <option value="REFUNDED_PARENT">Refunded the parent</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Reviewer notes (optional)</span>
        <textarea
          rows={3}
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you check? What did you decide?"
        />
      </label>
      {err && <div className="auth-error">{err}</div>}
      <div className="form-submit-row">
        <button type="button" className="btn brand" disabled={busy} onClick={() => send("RESOLVED")}>
          {busy ? "…" : "Resolve"}
        </button>
        <button type="button" className="btn ghost" disabled={busy} onClick={() => send("DISMISSED")}>
          {busy ? "…" : "Dismiss"}
        </button>
      </div>
    </div>
  );
}

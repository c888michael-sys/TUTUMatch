"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "PENDING_REVIEW" | "APPROVED" | "PAUSED" | "REJECTED";

export function ReviewActions({
  id,
  initialStatus,
  initialNotes,
}: {
  id: string;
  initialStatus: Status;
  initialNotes?: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function go(status: Status) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) {
        setMsg("Update failed.");
        return;
      }
      setMsg(`Marked ${status.replace("_", " ").toLowerCase()}.`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="review-actions">
      <div className="review-actions-row">
        <button className="btn brand" disabled={busy} onClick={() => go("APPROVED")}>
          Approve
        </button>
        <button className="btn ghost" disabled={busy} onClick={() => go("PAUSED")}>
          Pause
        </button>
        <button className="btn ghost danger" disabled={busy} onClick={() => go("REJECTED")}>
          Reject
        </button>
        <button className="btn ghost" disabled={busy} onClick={() => go("PENDING_REVIEW")}>
          Back to pending
        </button>
        <span className="review-msg">
          Current: <code>{initialStatus}</code> {msg && `· ${msg}`}
        </span>
      </div>
      <label className="field full-row">
        <span className="field-label">Reviewer notes (optional)</span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Reason for rejection / what's missing / approval rationale"
        />
      </label>
    </div>
  );
}

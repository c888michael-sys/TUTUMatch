"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UnsuspendButton({ userId, email }: { userId: string; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function unsuspend() {
    if (!confirm(`Unsuspend ${email}? They'll be able to log in again.`)) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/unsuspend`, { method: "POST" });
      if (!res.ok) {
        setMsg("Failed");
        return;
      }
      setMsg("Unsuspended");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button type="button" className="btn ghost sm" onClick={unsuspend} disabled={busy}>
        {busy ? "…" : "Unsuspend"}
      </button>
      {msg && <span className="muted small">{msg}</span>}
    </div>
  );
}

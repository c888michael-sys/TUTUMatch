"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// DEV-only helper button on the parent's side of the chat. Skips the 5-day
// wait by backdating refundEligibleAt and processing refunds immediately.
// Lets us demo the suspension/refund flow without waiting five real days.
// The underlying endpoint is disabled in production.

export function FastForwardRefund({
  unlockId,
  refundEligibleAt,
}: {
  unlockId: string;
  refundEligibleAt: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const eligibleIn = Math.max(0, Date.parse(refundEligibleAt) - Date.now());
  const daysLeft = Math.ceil(eligibleIn / (1000 * 60 * 60 * 24));

  async function fastForward() {
    if (!confirm("DEV: skip the 5-day wait and trigger the refund + tutor suspension now?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/unlocks/${unlockId}/fast-forward`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error === "dev_only" ? "Disabled in production." : "Couldn't fast-forward.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="dev-card">
      <div className="dev-card-head">DEV · Refund window</div>
      <p>
        Auto-refund eligible in <strong>{daysLeft} day{daysLeft === 1 ? "" : "s"}</strong>{" "}
        ({new Date(refundEligibleAt).toLocaleString("en-AU")}). If the tutor doesn&apos;t reply by then, you&apos;ll
        be refunded automatically and their account will be suspended.
      </p>
      <button type="button" className="btn ghost sm" onClick={fastForward} disabled={busy}>
        {busy ? "Working…" : "Skip the wait → trigger refund + suspension now"}
      </button>
      {msg && <div className="dev-card-msg">{msg}</div>}
    </section>
  );
}

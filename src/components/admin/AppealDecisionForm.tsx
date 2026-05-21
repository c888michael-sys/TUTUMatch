"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AppealDecisionForm({ appealId }: { appealId: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function decide(decision: "APPROVED" | "REJECTED") {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/appeals/${appealId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, notes }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/admin/appeals");
    router.refresh();
  }

  return (
    <div className="dashboard-card" style={{ marginTop: 24 }}>
      <h3>Make a decision</h3>
      <p className="muted small">
        <strong>Approve</strong> — tutor wins the dispute. They will be charged the standard $20 commission. No strike is applied.
        <br />
        <strong>Reject</strong> — appeal dismissed. A strike is applied to the tutor&apos;s profile.
      </p>

      <label style={{ display: "block", marginBottom: 8 }}>
        <span className="label-text">Reviewer notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g. Bank transfer receipt matches tutor name — automatic pass."
          style={{ width: "100%", marginTop: 4 }}
          disabled={loading}
        />
      </label>

      {error && <div className="reject-banner" style={{ marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="btn brand"
          onClick={() => decide("APPROVED")}
          disabled={loading}
        >
          ✓ Approve — tutor wins
        </button>
        <button
          className="btn ghost"
          onClick={() => decide("REJECTED")}
          disabled={loading}
          style={{ color: "var(--error, #dc2626)" }}
        >
          ✗ Reject — apply strike
        </button>
      </div>
    </div>
  );
}

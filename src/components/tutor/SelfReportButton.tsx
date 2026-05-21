"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SelfReportButton({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function report(r: "YES" | "NO") {
    setState("loading");
    setError("");
    const res = await fetch(`/api/matches/${matchId}/self-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report: r }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setState("idle");
      return;
    }
    if (r === "YES") {
      const charged = data.chargedCents ?? 0;
      setResult(
        data.isFreeFirstMatch
          ? "Match confirmed — first match is free. Your listing is back in browse."
          : charged === 1500
          ? "Match confirmed — $15 honesty rate applied. Your listing is back in browse."
          : "Match confirmed. Your listing is back in browse."
      );
    } else {
      setResult("No match recorded — no charge. Your listing is back in browse.");
    }
    setState("done");
    router.refresh();
  }

  if (state === "done") {
    return <div className="success-banner" style={{ marginTop: 0 }}>{result}</div>;
  }

  return (
    <div>
      <p className="muted small" style={{ marginBottom: 8 }}>
        Did you book a lesson with this parent?
      </p>
      {error && <div className="reject-banner" style={{ marginBottom: 8, fontSize: 13 }}>{error}</div>}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          className="btn brand"
          onClick={() => report("YES")}
          disabled={state === "loading"}
        >
          Yes — I had a lesson ($15 honesty rate)
        </button>
        <button
          className="btn ghost"
          onClick={() => report("NO")}
          disabled={state === "loading"}
        >
          No lesson happened
        </button>
      </div>
    </div>
  );
}

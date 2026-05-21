"use client";

import { useState } from "react";

export function ParentConfirmForm({ matchId, token }: { matchId: string; token: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function submit(response: "YES" | "NO" | "NOT_YET") {
    setState("loading");
    setError("");
    try {
      const res = await fetch(`/api/matches/${matchId}/parent-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "already_resolved") {
          setResult("This match has already been resolved. No further action needed.");
          setState("done");
        } else if (data.error === "invalid_token") {
          setError("This confirmation link is invalid or has expired. Check your email for the latest link.");
          setState("error");
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
          setState("error");
        }
        return;
      }
      if (response === "YES") {
        setResult("Thank you — we've recorded that a lesson took place. The tutor will be charged the standard commission.");
      } else if (response === "NO") {
        setResult("Got it — no lesson recorded. No charge has been made. The tutor may file a dispute if they disagree.");
      } else {
        setResult("No worries — we'll send another reminder in a few days. Reply when you're ready.");
      }
      setState("done");
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return <div className="success-banner" style={{ marginTop: 16 }}>{result}</div>;
  }

  return (
    <>
      <p>
        TUTUMatch needs to know whether a lesson took place with your tutor.
        Your answer determines whether the tutor is charged a commission.
      </p>
      <p className="muted small">
        Tutors pay TUTUMatch only when a real lesson is confirmed — parents never pay.
        Responses are logged for audit purposes.
      </p>

      {state === "error" && (
        <div className="reject-banner" style={{ marginBottom: 12 }}>{error}</div>
      )}

      {state === "loading" ? (
        <p>Saving your response&hellip;</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
          <button className="btn brand lg" onClick={() => submit("YES")}>
            Yes, we had a lesson
          </button>
          <button className="btn ghost lg" onClick={() => submit("NO")}>
            No, we did not have a lesson
          </button>
          <button className="btn ghost lg" onClick={() => submit("NOT_YET")}>
            Not yet — remind me later
          </button>
        </div>
      )}
    </>
  );
}

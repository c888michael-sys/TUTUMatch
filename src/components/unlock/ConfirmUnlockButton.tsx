"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon } from "@/components/landing/icons";

// Confirm-and-pay button.
//
// When `applicationId` is provided we hit the dev shortcut (POST
// /api/unlocks/dev-create) which creates a PAID Unlock locally and
// drops the user into the chat. This lets us demo end-to-end without
// Stripe wired. For sample tutors we just show a "not wired" hint —
// samples aren't real applications so there's nothing to unlock against.

export function ConfirmUnlockButton({
  applicationId,
  tutorFirstName,
}: {
  // Real `app_…` id when the unlock is for an approved tutor; null for samples.
  applicationId: string | null;
  tutorFirstName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onClick() {
    if (!applicationId) {
      setMsg(
        `Sample tutor — no real account to unlock. Submit a real tutor application from /tutor/signup, have an admin approve it, then come back from /admin to test the end-to-end chat.`
      );
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/unlocks/dev-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorApplicationId: applicationId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "unauthenticated") {
          router.replace(`/login?next=/unlock/${applicationId}`);
          return;
        }
        if (data.error === "cannot_unlock_self") {
          setMsg("You can't unlock your own tutor profile — try from a different account.");
          return;
        }
        if (data.error === "dev_only") {
          setMsg("Unlock isn't wired for production yet — Stripe goes here.");
          return;
        }
        setMsg(data.message ?? "Couldn't create the unlock — try again.");
        return;
      }
      router.replace(`/messages/${data.unlockId}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="confirm-unlock">
      <button type="button" className="btn brand lg" onClick={onClick} disabled={busy}>
        <LockIcon /> {busy ? "Unlocking…" : `Pay $20 to contact ${tutorFirstName}`}
      </button>
      {applicationId && (
        <span className="dev-hint">
          DEV mode: this skips the Stripe charge and creates the Unlock locally. Replace when Stripe is wired.
        </span>
      )}
      {msg && <div className="confirm-unlock-msg">{msg}</div>}
    </div>
  );
}

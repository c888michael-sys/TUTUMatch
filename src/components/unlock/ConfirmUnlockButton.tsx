"use client";

import { useState } from "react";
import { LockIcon } from "@/components/landing/icons";

// Confirm-and-pay button. Stripe integration isn't wired yet, so this just
// shows the user what *will* happen once payment is live.

export function ConfirmUnlockButton({
  tutorId: _tutorId,
  tutorFirstName,
}: {
  tutorId: string;
  tutorFirstName: string;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="confirm-unlock">
      <button
        type="button"
        className="btn brand lg"
        onClick={() =>
          setMsg(
            `Payment isn't wired up yet — but this is where the $20 charge for ${tutorFirstName} would happen via Stripe. You'd be refunded in full if no first lesson was agreed.`
          )
        }
      >
        <LockIcon /> Pay $20 to contact {tutorFirstName}
      </button>
      {msg && <div className="confirm-unlock-msg">{msg}</div>}
    </div>
  );
}

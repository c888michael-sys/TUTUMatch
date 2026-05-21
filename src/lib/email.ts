// Transactional email — placeholder. Logs to the console for now so the match
// flow is testable end-to-end without an email provider. Wire this to Resend
// (or similar) in session 5.

type TutorMatchNotification = {
  tutorEmail: string;
  tutorFirstName: string;
  parentEmail: string;
  matchId: string;
};

export async function sendTutorMatchNotification(n: TutorMatchNotification): Promise<void> {
  console.log(
    `[email:stub] To ${n.tutorEmail} — "${n.tutorFirstName}, ${n.parentEmail} selected you on ` +
      `TUTUMatch. If you book a lesson, self-report within 48 hours for the $15 honesty rate ` +
      `(and to keep your listing visible). Match ${n.matchId}."`
  );
}

type ParentConfirmEmail = {
  parentEmail: string;
  tutorFirstName: string;
  matchId: string;
  confirmToken: string;
  reminderNumber?: number; // 0 = first, 1 = 7d, 2 = 14d, 3 = 30d
};

export async function sendParentConfirmEmail(n: ParentConfirmEmail): Promise<void> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = `${base}/matches/${n.matchId}/confirm?token=${n.confirmToken}`;
  const label = n.reminderNumber ? `Reminder ${n.reminderNumber}` : "First contact";
  console.log(
    `[email:stub] (${label}) To ${n.parentEmail} — "Did you have a lesson with ${n.tutorFirstName}? ` +
    `Yes / No / Not yet → ${url}"`
  );
}

type TutorStrikeEmail = {
  tutorEmail: string;
  tutorFirstName: string;
  strikeNumber: number;
  hiddenUntil: string;
};

export async function sendTutorStrikeEmail(n: TutorStrikeEmail): Promise<void> {
  console.log(
    `[email:stub] To ${n.tutorEmail} — "Strike ${n.strikeNumber} applied, ${n.tutorFirstName}. Your profile is hidden until ${n.hiddenUntil}. Pay the missed $20 to reappear early."`
  );
}

type TutorSelfReportResultEmail = {
  tutorEmail: string;
  tutorFirstName: string;
  result: "charged_15" | "charged_20" | "no_charge";
};

export async function sendTutorSelfReportResultEmail(n: TutorSelfReportResultEmail): Promise<void> {
  const msg = n.result === "charged_15"
    ? "Honesty discount applied — $15 commission charged. Your listing is back in browse."
    : n.result === "charged_20"
    ? "Standard commission — $20 charged. Your listing is back in browse."
    : "No match confirmed — no charge. Your listing is back in browse.";
  console.log(`[email:stub] To ${n.tutorEmail} — "${n.tutorFirstName}, ${msg}"`);
}

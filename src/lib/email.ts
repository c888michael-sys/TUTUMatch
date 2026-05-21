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

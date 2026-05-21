import { patchApplication, type TutorApplication, type Match } from "@/lib/db";

const STRIKE_1_DAYS = 7;
const STRIKE_2_DAYS = 30;
const PERMANENT_UNTIL = "9999-12-31T00:00:00.000Z";

export type StrikeRecord = {
  appliedAt: string;
  matchId: string;
  parentEmail: string;
  strikeNumber: number;
};

export async function applyStrike(app: TutorApplication, match: Match): Promise<TutorApplication> {
  const prev = app.strikeCount ?? 0;
  const newCount = prev + 1;
  const now = new Date();

  const record: StrikeRecord = {
    appliedAt: now.toISOString(),
    matchId: match.id,
    parentEmail: match.parentEmail,
    strikeNumber: newCount,
  };

  const history = [...(app.strikeHistory ?? []), record];

  let hiddenUntil: string;
  if (newCount === 1) {
    hiddenUntil = new Date(now.getTime() + STRIKE_1_DAYS * 86400_000).toISOString();
  } else if (newCount === 2) {
    hiddenUntil = new Date(now.getTime() + STRIKE_2_DAYS * 86400_000).toISOString();
  } else {
    hiddenUntil = PERMANENT_UNTIL;
  }

  const patch: Partial<TutorApplication> = {
    strikeCount: newCount,
    strikeHistory: history,
    hiddenUntil,
    ...(newCount >= 3 ? { noHonestyDiscount: true } : {}),
  };

  const updated = await patchApplication(app.id, patch);
  return updated ?? { ...app, ...patch };
}

export function commissionCents(app: TutorApplication, isSelfReport: boolean): number {
  if (app.permanentListing) return 0;
  if (app.noHonestyDiscount) return 2000;
  return isSelfReport ? 1500 : 2000;
}

export function isFirstFreeMatch(app: TutorApplication): boolean {
  return (app.matchesCompletedCount ?? 0) === 0;
}

export function strikeSummary(app: TutorApplication): string | null {
  const n = app.strikeCount ?? 0;
  if (n === 0) return null;
  if (n === 1) return "Strike 1/3 — profile hidden 7 days. Pay missed $20 to reappear early.";
  if (n === 2) return "Strike 2/3 — profile hidden 30 days. Pay missed $20 to reappear early.";
  return "Strike 3+ — profile permanently hidden. Pay $20 to reappear (no honesty discount, ever).";
}

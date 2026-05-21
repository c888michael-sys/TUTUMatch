// Tiny JSON-file storage for local dev / demo. Swap for Prisma + Postgres
// once you have a DATABASE_URL. The shape of each record mirrors the
// `User` / `TutorProfile` entries in prisma/schema.prisma so the migration
// is a straight field-map.

import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(buf) as T;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, target);
}

export type Role = "PARENT" | "TUTOR" | "ADMIN";

export type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  // Account suspension state. Set when an admin suspends an account (e.g.
  // acting on a report). Suspended users can't log in; they appeal by email.
  suspended?: boolean;
  suspendedAt?: string;
  suspendedReason?: string;
};

export type ApplicationStatus = "PENDING_REVIEW" | "APPROVED" | "PAUSED" | "REJECTED";

export type HscResult = { subject: string; bandOrMark: string };
export type TimeSlot = { startMinutes: number; endMinutes: number };
export type Availability = Partial<Record<Weekday, TimeSlot[]>>;
export type Weekday = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type LessonMode = "IN_PERSON" | "ONLINE" | "EITHER";

export type TutorApplication = {
  id: string;
  userId: string;
  status: ApplicationStatus;
  // Tutor-controlled toggle. Independent of `status`. Even an APPROVED tutor
  // can hide their profile without going through admin re-review.
  // Older records may not have this field — treat undefined as `true`.
  visibility?: boolean;
  submittedAt: string;
  reviewedAt?: string;
  reviewerEmail?: string;
  reviewerNotes?: string;

  firstName: string;
  lastInitial: string;
  fullLastName: string;
  publicBio: string;
  photoUrl?: string;

  contactEmail: string;
  phone: string;
  socials?: string;

  dateOfBirth: string; // ISO date

  // High school attended (alma mater)
  schoolId?: string;
  otherSchoolName?: string;

  // Area the tutor is willing to tutor in — drives the browse-view tabs.
  // Either a real school slug ("killara"/"masada"/etc) or "other".
  tutoringAreaSchoolId: string;
  tutoringAreaOther?: string; // free-text suburb/area when tutoringAreaSchoolId = "other"

  atar: number;
  hscResults: HscResult[];
  // Each offer is a subject + the year levels the tutor teaches it to.
  offeredSubjects: { subject: string; yearLevels: number[] }[];

  hourlyRateCents: number;
  suburb?: string;     // now optional — area dropdown is the primary location signal
  postcode?: string;   // now optional
  mode: LessonMode;

  availability: Availability;

  wwccNumber: string;
  wwccFullName: string;
  wwccDob: string; // ISO date

  // Free-text fallback notes (kept for backwards compat — older records used
  // these before uploads existed; they let admins record where to request a
  // scan if the upload never happened).
  idDocumentNote?: string;
  hscDocumentNote?: string;

  // Terms-of-Service acceptance: version + timestamp the tutor confirmed.
  termsAcceptedVersion?: string;
  termsAcceptedAt?: string;

  // Upload IDs for documents the tutor optionally provides. Each points at a
  // record managed by src/lib/uploads.ts; admin views them via /api/uploads/[id].
  idDocumentUploadId?: string;
  wwccDocumentUploadId?: string;
  hscDocumentUploadId?: string;

  bioFlags?: string[]; // any contact-info patterns the scanner caught

  // Number of confirmed paid matches this tutor has completed. Drives the
  // first-match-free logic. Older records may not have this field — treat
  // undefined as 0.
  matchesCompletedCount?: number;
  strikeCount?: number;
  strikeHistory?: Array<{ appliedAt: string; matchId: string; parentEmail: string; strikeNumber: number }>;
  noHonestyDiscount?: boolean;
  permanentListing?: boolean;
  permanentListingPurchasedAt?: string;
  // When set and in the future, the tutor's listing is hidden from public
  // browse — either during the 48h window of an open match, or a strike period.
  hiddenUntil?: string;
};

const USERS_FILE = "users.json";
const APPS_FILE = "applications.json";
const MATCHES_FILE = "matches.json";
const APPEALS_FILE = "appeals.json";
const REPORTS_FILE = "reports.json";

// ───────────────────────────── Matches ─────────────────────────────

export type MatchStatus =
  | "AWAITING_RESOLUTION"        // created when parent clicks "I want this tutor"
  | "RESOLVED_TUTOR_CONFIRMED"   // tutor self-reported within 48h → $15 charged
  | "RESOLVED_PARENT_CONFIRMED"  // parent said YES after 48h → $20 charged
  | "RESOLVED_NO_MATCH"          // parent said NO or both confirmed no-match → no charge
  | "RESOLVED_APPEALED_WON"      // tutor appealed parent's NO and won → $20 charged
  | "RESOLVED_APPEALED_LOST"     // tutor appealed and lost → strike applied
  | "AUTO_CLOSED_NO_RESPONSE";   // 30d silence both sides → no charge

export type Match = {
  id: string;                          // app_match_<random>
  parentEmail: string;                 // captured even if parent isn't logged in
  parentUserId?: string;               // set if parent is signed in (rare in directory model)
  tutorApplicationId: string;
  tutorUserId: string;
  status: MatchStatus;
  createdAt: string;                   // ISO timestamp
  tutorHiddenUntil: string;            // createdAt + 48h
  resolvedAt?: string;
  amountChargedCents?: number;         // 1500 or 2000
  stripeChargeId?: string;
  parentConfirmation?: "YES" | "NO" | "NOT_YET";
  parentConfirmedAt?: string;
  tutorSelfReport?: "YES" | "NO";
  tutorSelfReportedAt?: string;
  parentConfirmTokenHash?: string;     // SHA-256 of the email-link token
  parentConfirmRemindersSent: number;  // 0, 1, 2, 3 (at 2d, 7d, 14d, 30d)
  appealId?: string;
  isFreeFirstMatch: boolean;           // true if tutor's matchesCompletedCount was 0
};

export async function listMatches(): Promise<Match[]> {
  return readJson<Match[]>(MATCHES_FILE, []);
}

export async function listMatchesForUser(userId: string): Promise<Match[]> {
  const all = await listMatches();
  return all.filter((m) => m.parentUserId === userId || m.tutorUserId === userId);
}

export async function findMatchById(id: string): Promise<Match | undefined> {
  const all = await listMatches();
  return all.find((m) => m.id === id);
}

// An open (unresolved) match between the same parent and tutor. Used to stop a
// parent creating duplicate match records by clicking "I want this tutor" twice.
export async function findOpenMatch(
  tutorApplicationId: string,
  parentEmail: string
): Promise<Match | undefined> {
  const all = await listMatches();
  return all.find(
    (m) =>
      m.tutorApplicationId === tutorApplicationId &&
      m.parentEmail.toLowerCase() === parentEmail.toLowerCase() &&
      m.status === "AWAITING_RESOLUTION"
  );
}

export async function createMatch(match: Match): Promise<void> {
  const all = await listMatches();
  all.push(match);
  await writeJson(MATCHES_FILE, all);
}

export async function patchMatch(id: string, patch: Partial<Match>): Promise<Match | undefined> {
  const all = await listMatches();
  const i = all.findIndex((m) => m.id === id);
  if (i < 0) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeJson(MATCHES_FILE, all);
  return all[i];
}

// ───────────────────────────── Appeals ─────────────────────────────

export type Appeal = {
  id: string;
  matchId: string;
  tutorUserId: string;                 // the tutor making the appeal
  description: string;                 // tutor's explanation
  evidenceUploadIds: string[];         // refs to /api/uploads/[id] files
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewerEmail?: string;
  reviewerNotes?: string;
  createdAt: string;
  resolvedAt?: string;
};

export async function listAppeals(): Promise<Appeal[]> {
  return readJson<Appeal[]>(APPEALS_FILE, []);
}

export async function findAppealById(id: string): Promise<Appeal | undefined> {
  const all = await listAppeals();
  return all.find((a) => a.id === id);
}

export async function createAppeal(appeal: Appeal): Promise<void> {
  const all = await listAppeals();
  all.push(appeal);
  await writeJson(APPEALS_FILE, all);
}

export async function patchAppeal(id: string, patch: Partial<Appeal>): Promise<Appeal | undefined> {
  const all = await listAppeals();
  const i = all.findIndex((a) => a.id === id);
  if (i < 0) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeJson(APPEALS_FILE, all);
  return all[i];
}

// ───────────────────────────── Reports / disputes ─────────────────────────────

export type ReportKind = "USER" | "APPLICATION";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

// Predefined reason codes. Free-text always goes in `description`.
export type ReportReason =
  | "contact_info_bypass"
  | "harassment"
  | "inappropriate_content"
  | "safety_concern"
  | "qualifications_misrepresented"
  | "no_show"
  | "spam"
  | "other";

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  contact_info_bypass: "Off-platform contact to dodge the match commission",
  harassment: "Harassment or abusive language",
  inappropriate_content: "Inappropriate or offensive content",
  safety_concern: "Child-safety concern",
  qualifications_misrepresented: "Misrepresenting qualifications / ATAR",
  no_show: "Tutor didn't show up to a booked lesson",
  spam: "Spam or scam",
  other: "Something else",
};

// Optional admin-recorded outcome at resolution time.
export type ReportAction =
  | "NONE"
  | "WARNED_USER"
  | "SUSPENDED_USER"
  | "REJECTED_APPLICATION";

export type Report = {
  id: string;
  reporterUserId: string;
  reporterEmail: string;            // snapshot at report time
  subjectKind: ReportKind;
  subjectId: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolverEmail?: string;
  resolverNotes?: string;
  actionTaken?: ReportAction;
};

export async function listReports(): Promise<Report[]> {
  return readJson<Report[]>(REPORTS_FILE, []);
}

export async function findReportById(id: string): Promise<Report | undefined> {
  const all = await listReports();
  return all.find((r) => r.id === id);
}

export async function createReport(r: Report): Promise<void> {
  const all = await listReports();
  all.push(r);
  await writeJson(REPORTS_FILE, all);
}

export async function patchReport(id: string, patch: Partial<Report>): Promise<Report | undefined> {
  const all = await listReports();
  const i = all.findIndex((r) => r.id === id);
  if (i < 0) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeJson(REPORTS_FILE, all);
  return all[i];
}

// ───────────────────────────── Suspension ─────────────────────────────

export async function suspendUser(userId: string, reason: string): Promise<void> {
  const users = await listUsers();
  const i = users.findIndex((u) => u.id === userId);
  if (i < 0) return;
  if (users[i].suspended) return; // already suspended; preserve first reason
  users[i] = {
    ...users[i],
    suspended: true,
    suspendedAt: new Date().toISOString(),
    suspendedReason: reason,
  };
  await writeJson(USERS_FILE, users);
}

export async function listUsers(): Promise<StoredUser[]> {
  return readJson<StoredUser[]>(USERS_FILE, []);
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await listUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const users = await listUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(user: StoredUser): Promise<void> {
  const users = await listUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error("email_taken");
  }
  users.push(user);
  await writeJson(USERS_FILE, users);
}

export async function listApplications(): Promise<TutorApplication[]> {
  return readJson<TutorApplication[]>(APPS_FILE, []);
}

export async function findApplicationById(id: string): Promise<TutorApplication | undefined> {
  const apps = await listApplications();
  return apps.find((a) => a.id === id);
}

export async function findApplicationByUserId(userId: string): Promise<TutorApplication | undefined> {
  const apps = await listApplications();
  return apps.find((a) => a.userId === userId);
}

// Approved + visible applications. This is what the public browse pages render.
// Treats a missing `visibility` field as `true` (legacy records). Listings whose
// `hiddenUntil` is in the future are temporarily withheld (open-match window).
export async function listApprovedTutors(): Promise<TutorApplication[]> {
  const apps = await listApplications();
  const now = Date.now();
  return apps.filter(
    (a) =>
      a.status === "APPROVED" &&
      (a.visibility ?? true) &&
      !(a.hiddenUntil && Date.parse(a.hiddenUntil) > now)
  );
}

export async function upsertApplication(app: TutorApplication): Promise<void> {
  const apps = await listApplications();
  const i = apps.findIndex((a) => a.id === app.id);
  if (i >= 0) apps[i] = app;
  else apps.push(app);
  await writeJson(APPS_FILE, apps);
}

export async function patchApplication(
  id: string,
  patch: Partial<TutorApplication>
): Promise<TutorApplication | undefined> {
  const apps = await listApplications();
  const i = apps.findIndex((a) => a.id === id);
  if (i < 0) return undefined;
  apps[i] = { ...apps[i], ...patch };
  await writeJson(APPS_FILE, apps);
  return apps[i];
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  reviewerEmail: string,
  notes?: string
): Promise<TutorApplication | undefined> {
  const apps = await listApplications();
  const i = apps.findIndex((a) => a.id === id);
  if (i < 0) return undefined;
  apps[i] = {
    ...apps[i],
    status,
    reviewedAt: new Date().toISOString(),
    reviewerEmail,
    reviewerNotes: notes,
  };
  await writeJson(APPS_FILE, apps);
  return apps[i];
}

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

// ───────────────────────────── Token helpers ─────────────────────────────

import crypto from "node:crypto";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

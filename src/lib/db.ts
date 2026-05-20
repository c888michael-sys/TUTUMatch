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

  // File uploads not yet implemented — admin should request these out-of-band
  // until storage is wired up.
  idDocumentNote?: string;
  hscDocumentNote?: string;

  bioFlags?: string[]; // any contact-info patterns the scanner caught
};

const USERS_FILE = "users.json";
const APPS_FILE = "applications.json";
const UNLOCKS_FILE = "unlocks.json";
const MESSAGES_FILE = "messages.json";

// ───────────────────────────── Unlocks + messages ─────────────────────────────

export type UnlockStatus = "PAID" | "REFUNDED";

export type Unlock = {
  id: string;
  parentUserId: string;
  tutorApplicationId: string;
  tutorUserId: string;
  amountCents: number;
  status: UnlockStatus;
  paidAt: string;          // ISO
  refundEligibleAt: string; // paidAt + 5 days
  tutorFirstReplyAt?: string;
  refundedAt?: string;
  refundReason?: string;
  // Dev-only: created via the local 'mark as paid' shortcut so we can demo
  // chat without Stripe. Will be filtered out once Stripe is live.
  isDev?: boolean;
};

export type Message = {
  id: string;
  unlockId: string;
  senderId: string;
  senderRole: "PARENT" | "TUTOR";
  body: string;
  createdAt: string;
};

export async function listUnlocks(): Promise<Unlock[]> {
  return readJson<Unlock[]>(UNLOCKS_FILE, []);
}

export async function listUnlocksForUser(userId: string): Promise<Unlock[]> {
  const all = await listUnlocks();
  return all.filter((u) => u.parentUserId === userId || u.tutorUserId === userId);
}

export async function findUnlockById(id: string): Promise<Unlock | undefined> {
  const all = await listUnlocks();
  return all.find((u) => u.id === id);
}

export async function findExistingUnlock(
  parentUserId: string,
  tutorApplicationId: string
): Promise<Unlock | undefined> {
  const all = await listUnlocks();
  return all.find(
    (u) =>
      u.parentUserId === parentUserId &&
      u.tutorApplicationId === tutorApplicationId &&
      u.status !== "REFUNDED"
  );
}

export async function createUnlock(unlock: Unlock): Promise<void> {
  const all = await listUnlocks();
  all.push(unlock);
  await writeJson(UNLOCKS_FILE, all);
}

export async function patchUnlock(id: string, patch: Partial<Unlock>): Promise<Unlock | undefined> {
  const all = await listUnlocks();
  const i = all.findIndex((u) => u.id === id);
  if (i < 0) return undefined;
  all[i] = { ...all[i], ...patch };
  await writeJson(UNLOCKS_FILE, all);
  return all[i];
}

export async function listMessages(unlockId: string): Promise<Message[]> {
  const all = await readJson<Message[]>(MESSAGES_FILE, []);
  return all
    .filter((m) => m.unlockId === unlockId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createMessage(msg: Message): Promise<void> {
  const all = await readJson<Message[]>(MESSAGES_FILE, []);
  all.push(msg);
  await writeJson(MESSAGES_FILE, all);
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

export async function upsertApplication(app: TutorApplication): Promise<void> {
  const apps = await listApplications();
  const i = apps.findIndex((a) => a.id === app.id);
  if (i >= 0) apps[i] = app;
  else apps.push(app);
  await writeJson(APPS_FILE, apps);
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

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

  schoolId?: string;
  otherSchoolName?: string;

  atar: number;
  hscResults: HscResult[];
  offeredSubjects: string[];
  yearLevels: number[];

  hourlyRateCents: number;
  suburb: string;
  postcode: string;
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

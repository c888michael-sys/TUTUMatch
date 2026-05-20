// Server-only schools store. Reads/writes data/schools.json. Seeds itself
// from SEED_SCHOOLS on first run so a fresh checkout has working demo
// landing pages.

import fs from "node:fs/promises";
import path from "node:path";
import { OTHER_AREA_SCHOOL, SEED_SCHOOLS, type School } from "./schools";

const DATA_DIR = path.join(process.cwd(), "data");
const SCHOOLS_FILE = path.join(DATA_DIR, "schools.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readSchoolsFile(): Promise<School[] | null> {
  try {
    const buf = await fs.readFile(SCHOOLS_FILE, "utf8");
    return JSON.parse(buf) as School[];
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return null;
    throw err;
  }
}

async function writeSchoolsFile(schools: School[]): Promise<void> {
  await ensureDir();
  const tmp = `${SCHOOLS_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(schools, null, 2));
  await fs.rename(tmp, SCHOOLS_FILE);
}

export async function loadSchools(): Promise<School[]> {
  const stored = await readSchoolsFile();
  if (stored) return stored;
  await writeSchoolsFile(SEED_SCHOOLS);
  return [...SEED_SCHOOLS];
}

export async function loadActiveSchools(): Promise<School[]> {
  const all = await loadSchools();
  return all.filter((s) => s.active);
}

export async function findSchoolBySlug(slug: string | undefined): Promise<School | undefined> {
  if (!slug) return undefined;
  if (slug === OTHER_AREA_SCHOOL.id) return OTHER_AREA_SCHOOL;
  const all = await loadSchools();
  return all.find((s) => s.id === slug && s.active);
}

export async function upsertSchool(school: School): Promise<void> {
  const all = await loadSchools();
  const i = all.findIndex((s) => s.id === school.id);
  if (i >= 0) all[i] = school;
  else all.push(school);
  await writeSchoolsFile(all);
}

export async function deleteSchool(id: string): Promise<boolean> {
  const all = await loadSchools();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  await writeSchoolsFile(next);
  return true;
}

// Used by /schools/[slug] + /browse + LandingPage + SignupForm via prop drilling.
export async function tutoringAreaOptionsStored(): Promise<School[]> {
  const active = await loadActiveSchools();
  return [...active, OTHER_AREA_SCHOOL];
}

// Client-safe schools module. No filesystem access here; server pages and
// admin endpoints use src/lib/schools-store.ts to read/write the JSON store.

export type School = {
  id: string;          // slug used in /schools/[slug] URLs
  name: string;
  short: string;
  tagline: string;
  brand: string;       // --brand
  brandDeep: string;   // --brand-deep
  brandSoft: string;   // --brand-soft
  active: boolean;
};

export const DEFAULT_SCHOOL: School = {
  id: "default",
  name: "TUTUMatch",
  short: "TUTUMatch",
  tagline: "NSW · independent marketplace",
  brand: "#0F4F4A",
  brandDeep: "#083633",
  brandSoft: "#E6F0EE",
  active: true,
};

// The "Other Locations" pseudo-school. Hardcoded because it's a synthetic
// catch-all for tutors who don't tutor near one of the listed schools.
export const OTHER_AREA_SCHOOL: School = {
  id: "other",
  name: "Other Locations",
  short: "Other",
  tagline: "Tutors based elsewhere across Sydney",
  brand: "#0F4F4A",
  brandDeep: "#083633",
  brandSoft: "#E6F0EE",
  active: true,
};

// Seed schools used to bootstrap the JSON store on first run. After the
// store exists these are no longer authoritative — `loadSchools()` returns
// whatever's in `data/schools.json`. Kept in source for the seed path and
// for typed examples in tests/docs.
export const SEED_SCHOOLS: School[] = [
  {
    id: "killara",
    name: "Killara High School",
    short: "Killara High",
    tagline: "Killara · Upper North Shore · comprehensive",
    brand: "#1B4332",
    brandDeep: "#0F2D1F",
    brandSoft: "#E3EFE8",
    active: true,
  },
  {
    id: "masada",
    name: "Masada College",
    short: "Masada",
    tagline: "St Ives · K–12 independent Jewish day school",
    brand: "#1E3A5F",
    brandDeep: "#122747",
    brandSoft: "#E3EAF2",
    active: true,
  },
];

// Legacy synchronous alias — many client components still import this.
// Kept identical to SEED_SCHOOLS for now. Once we move the form dropdowns
// to async-loaded school lists, this can go.
export const SCHOOLS = SEED_SCHOOLS;

// Lookups that work without filesystem access (used by client components).
// The server-side equivalents in schools-store.ts read from the live store.
export function findSchool(slug: string | undefined): School | undefined {
  if (!slug) return undefined;
  if (slug === OTHER_AREA_SCHOOL.id) return OTHER_AREA_SCHOOL;
  return SCHOOLS.find((s) => s.id === slug && s.active);
}

export function findSchoolInList(slug: string | undefined, schools: School[]): School | undefined {
  if (!slug) return undefined;
  if (slug === OTHER_AREA_SCHOOL.id) return OTHER_AREA_SCHOOL;
  return schools.find((s) => s.id === slug && s.active);
}

export function tutoringAreaOptions(): School[] {
  return [...SCHOOLS.filter((s) => s.active), OTHER_AREA_SCHOOL];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

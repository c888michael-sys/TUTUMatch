// Schools are managed via the admin panel in production (DB table `schools`).
// These are seed schools that pre-populate the DB and render the demo
// landing-page theming until the founder onboards real schools.

export type School = {
  id: string;          // slug used in /schools/[slug] URLs
  name: string;        // full display name (e.g., "Killara High School")
  short: string;       // chip label in the school selector
  tagline: string;     // one-line school descriptor
  brand: string;       // --brand
  brandDeep: string;   // --brand-deep
  brandSoft: string;   // --brand-soft
  active: boolean;     // admin toggle — hidden landing page when false
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

export const SCHOOLS: School[] = [
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

// Synthetic "school" used to represent the Other Locations tab in the
// browse view. A tutor with `tutoringAreaSchoolId = "other"` shows up here.
export const OTHER_AREA_SCHOOL: School = {
  id: "other",
  name: "Other Locations",
  short: "Other",
  tagline: "Tutors based elsewhere across NSW",
  brand: "#0F4F4A",
  brandDeep: "#083633",
  brandSoft: "#E6F0EE",
  active: true,
};

export function findSchool(slug: string | undefined): School | undefined {
  if (!slug) return undefined;
  if (slug === OTHER_AREA_SCHOOL.id) return OTHER_AREA_SCHOOL;
  return SCHOOLS.find((s) => s.id === slug && s.active);
}

// All entries that can appear as a tutoring-area tab on the browse view.
export function tutoringAreaOptions(): School[] {
  return [...SCHOOLS.filter((s) => s.active), OTHER_AREA_SCHOOL];
}

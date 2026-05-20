// Browse-card data layer. Approved tutor applications convert into a uniform
// `BrowseTutor` shape that the SchoolBrowse client component renders.

import type { TutorApplication } from "./db";
import type { Weekday } from "./tutor-form";
import { WEEKDAYS } from "./tutor-form";

export type BrowseTutor = {
  routeId: string;       // application id — drives `/tutors/<id>` and `/unlock/<id>`
  name: string;          // first name + last initial, e.g. "Lachlan H."
  initials: string;
  suburb: string;
  atar: string;
  subjects: { s: string; b: string }[];
  rate: number;          // dollars/hr
  mode: string;          // "Online · In-person" | "Online" | "In-person"
  tutoringAreaSchoolId: string;
  attendedSchoolId?: string;
  attendedOther?: string;
  availableDays: Weekday[];
  addedAt: string;       // ISO — default sort uses this
};

function modeLabel(m: "EITHER" | "ONLINE" | "IN_PERSON"): string {
  if (m === "EITHER") return "Online · In-person";
  if (m === "ONLINE") return "Online";
  return "In-person";
}

export function applicationToBrowse(app: TutorApplication): BrowseTutor {
  const subjects = app.offeredSubjects.map((o) => {
    const hsc = app.hscResults.find((r) => r.subject === o.subject);
    return { s: o.subject, b: hsc?.bandOrMark ?? "—" };
  });
  const availableDays = WEEKDAYS.filter((d) => {
    const slots = app.availability[d];
    return Array.isArray(slots) && slots.length > 0;
  });
  return {
    routeId: app.id,
    name: `${app.firstName} ${app.lastInitial}.`,
    initials: (app.firstName[0] ?? "?") + app.lastInitial,
    suburb: app.suburb ?? (app.tutoringAreaOther ?? "—"),
    atar: app.atar.toFixed(2),
    subjects,
    rate: Math.round(app.hourlyRateCents / 100),
    mode: modeLabel(app.mode),
    tutoringAreaSchoolId: app.tutoringAreaSchoolId,
    attendedSchoolId: app.schoolId,
    attendedOther: app.otherSchoolName,
    availableDays,
    addedAt: app.submittedAt,
  };
}

// Build the list for a given browse page.
// `schoolId` is "default" for /browse (all areas) or a specific slug.
export function buildBrowseList(
  schoolId: string,
  approvedApps: TutorApplication[]
): BrowseTutor[] {
  const isAll = schoolId === "default";
  return approvedApps
    .filter((a) => isAll || a.tutoringAreaSchoolId === schoolId)
    .map(applicationToBrowse);
}

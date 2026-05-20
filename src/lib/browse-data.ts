// Browse-card data layer. Both real approved tutor applications and the
// hardcoded demo samples are converted into a single shape (`BrowseTutor`)
// so the SchoolBrowse client component doesn't need to care which is which.

import { SAMPLE_TUTORS, type SampleTutor } from "./sample-tutors";
import type { TutorApplication } from "./db";
import type { Weekday } from "./tutor-form";
import { WEEKDAYS } from "./tutor-form";

export type BrowseTutor = {
  // What `/tutors/<id>` should be. `app_…` for real applications,
  // `sample-<schoolSlug>-<idx>` for demo data.
  routeId: string;
  isReal: boolean;

  name: string;       // first name + last initial
  initials: string;
  suburb: string;
  atar: string;       // string so "—" is OK if missing
  subjects: { s: string; b: string }[];
  rate: number;       // dollars/hr (whole number)
  mode: string;       // "Online · In-person" | "Online" | "In-person"
  tutoringAreaSchoolId: string;
  attendedSchoolId?: string;
  attendedOther?: string;
  availableDays: Weekday[];
  addedAt: string;    // ISO — drives the default "oldest first" sort
};

function modeLabel(m: "EITHER" | "ONLINE" | "IN_PERSON"): string {
  if (m === "EITHER") return "Online · In-person";
  if (m === "ONLINE") return "Online";
  return "In-person";
}

export function applicationToBrowse(app: TutorApplication): BrowseTutor {
  // Subjects rendered on the card come from `offeredSubjects`. We pair each
  // with the HSC band/mark the tutor reported for that subject (which gets
  // picked up by the sort-by-score logic in SchoolBrowse).
  const subjects = app.offeredSubjects.map((o) => {
    const hsc = app.hscResults.find((r) => r.subject === o.subject);
    return { s: o.subject, b: hsc?.bandOrMark ?? "—" };
  });
  // A day counts as "available" if there's at least one slot on it.
  const availableDays = WEEKDAYS.filter((d) => {
    const slots = app.availability[d];
    return Array.isArray(slots) && slots.length > 0;
  });

  return {
    routeId: app.id,
    isReal: true,
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

export function sampleToBrowse(s: SampleTutor, schoolKey: string, idx: number): BrowseTutor {
  return {
    routeId: `sample-${schoolKey}-${idx}`,
    isReal: false,
    name: s.name,
    initials: s.initials,
    suburb: s.suburb,
    atar: s.atar,
    subjects: s.subjects,
    rate: s.rate,
    mode: s.mode,
    tutoringAreaSchoolId: s.tutoringAreaSchoolId,
    attendedSchoolId: s.attendedSchoolId,
    attendedOther: s.attendedOther,
    availableDays: s.availableDays,
    addedAt: s.addedAt,
  };
}

// Build the merged list for a given browse page.
// `schoolId` is "default" for /browse (all areas) or a specific slug.
export function buildBrowseList(
  schoolId: string,
  approvedApps: TutorApplication[]
): BrowseTutor[] {
  const isAll = schoolId === "default";

  // Real applications first — they're the value we're trying to surface.
  const real = approvedApps
    .filter((a) => isAll || a.tutoringAreaSchoolId === schoolId)
    .map(applicationToBrowse);

  // Then samples, deduped by display name so the same demo tutor doesn't
  // appear twice on the "All tutors" page.
  const samples: BrowseTutor[] = [];
  const seen = new Set(real.map((r) => r.name));
  if (isAll) {
    for (const [k, list] of Object.entries(SAMPLE_TUTORS)) {
      if (k === "default") continue;
      list.forEach((s, i) => {
        if (seen.has(s.name)) return;
        seen.add(s.name);
        samples.push(sampleToBrowse(s, k, i));
      });
    }
  } else {
    (SAMPLE_TUTORS[schoolId] ?? []).forEach((s, i) => {
      if (seen.has(s.name)) return;
      seen.add(s.name);
      samples.push(sampleToBrowse(s, schoolId, i));
    });
  }

  return [...real, ...samples];
}

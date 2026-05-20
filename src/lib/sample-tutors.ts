// Demo data for the landing-page tutor cards. Real tutor listings come from
// the `tutor_profiles` table once admin verification is in place.
//
// Each tutor has a `tutoringAreaSchoolId` — that's what the school-tab browse
// filters on. `attendedSchoolId` records the high school they actually went
// to (alma mater) and is shown on the public profile.

export type SampleTutor = {
  name: string;       // first name + last initial only (publicly visible)
  initials: string;
  suburb: string;
  atar: string;
  subjects: { s: string; b: string }[];
  rate: number;
  mode: string;
  tutoringAreaSchoolId: string;   // "killara" | "masada" | "other"
  attendedSchoolId?: string;
  attendedOther?: string;
};

const KILLARA: SampleTutor[] = [
  {
    name: "Lachlan H.", initials: "LH", suburb: "Killara", atar: "98.65",
    subjects: [{ s: "Maths Ext 1", b: "E4" }, { s: "Physics", b: "94" }],
    rate: 60, mode: "Online · In-person",
    tutoringAreaSchoolId: "killara", attendedSchoolId: "killara",
  },
  {
    name: "Sophie X.", initials: "SX", suburb: "Lindfield", atar: "99.10",
    subjects: [{ s: "Biology", b: "95" }, { s: "Chemistry", b: "93" }],
    rate: 55, mode: "Online",
    tutoringAreaSchoolId: "killara", attendedSchoolId: "killara",
  },
  {
    name: "Aarav K.", initials: "AK", suburb: "Gordon", atar: "99.40",
    subjects: [{ s: "Maths Ext 2", b: "E4" }, { s: "Physics", b: "95" }],
    rate: 70, mode: "In-person",
    tutoringAreaSchoolId: "killara", attendedSchoolId: "killara",
  },
  {
    name: "Mia C.", initials: "MC", suburb: "Killara", atar: "98.20",
    subjects: [{ s: "English Adv", b: "93" }, { s: "Modern Hist", b: "92" }],
    rate: 50, mode: "Online · In-person",
    tutoringAreaSchoolId: "killara", attendedSchoolId: "killara",
  },
];

const MASADA: SampleTutor[] = [
  {
    name: "Daniel L.", initials: "DL", suburb: "St Ives", atar: "99.55",
    subjects: [{ s: "Maths Ext 1", b: "E4" }, { s: "Chemistry", b: "95" }],
    rate: 65, mode: "Online · In-person",
    tutoringAreaSchoolId: "masada", attendedSchoolId: "masada",
  },
  {
    name: "Hannah B.", initials: "HB", suburb: "Pymble", atar: "99.20",
    subjects: [{ s: "English Adv", b: "94" }, { s: "Economics", b: "93" }],
    rate: 60, mode: "Online",
    tutoringAreaSchoolId: "masada", attendedSchoolId: "masada",
  },
  {
    name: "Noah J.", initials: "NJ", suburb: "St Ives", atar: "98.70",
    subjects: [{ s: "Biology", b: "93" }, { s: "Maths Adv", b: "92" }],
    rate: 55, mode: "In-person",
    tutoringAreaSchoolId: "masada", attendedSchoolId: "masada",
  },
  {
    name: "Tali R.", initials: "TR", suburb: "Lindfield", atar: "99.75",
    subjects: [{ s: "Maths Ext 2", b: "E4" }, { s: "Physics", b: "96" }],
    rate: 75, mode: "Online · In-person",
    tutoringAreaSchoolId: "masada", attendedSchoolId: "masada",
  },
];

// Tutors who tutor outside the seed-school catchments (or whose alma mater
// isn't in the list yet). Show up under /schools/other.
const OTHER: SampleTutor[] = [
  {
    name: "Eli P.", initials: "EP", suburb: "Newtown", atar: "98.90",
    subjects: [{ s: "English Adv", b: "95" }, { s: "English Ext 1", b: "E4" }],
    rate: 55, mode: "Online · In-person",
    tutoringAreaSchoolId: "other",
    attendedOther: "Sydney Boys High",
  },
  {
    name: "Priya N.", initials: "PN", suburb: "Parramatta", atar: "99.20",
    subjects: [{ s: "Chemistry", b: "94" }, { s: "Maths Ext 1", b: "E4" }],
    rate: 60, mode: "Online",
    tutoringAreaSchoolId: "other",
    attendedOther: "James Ruse Agricultural High",
  },
  {
    name: "Joel W.", initials: "JW", suburb: "Bondi", atar: "97.85",
    subjects: [{ s: "Economics", b: "93" }, { s: "Business Studies", b: "92" }],
    rate: 50, mode: "In-person",
    tutoringAreaSchoolId: "other",
    attendedOther: "Cranbrook School",
  },
  {
    name: "Ava M.", initials: "AM", suburb: "Inner West", atar: "98.40",
    subjects: [{ s: "Biology", b: "94" }, { s: "PDHPE", b: "92" }],
    rate: 50, mode: "Online · In-person",
    tutoringAreaSchoolId: "other",
    attendedOther: "Fort Street High",
  },
];

export const SAMPLE_TUTORS: Record<string, SampleTutor[]> = {
  default: [...KILLARA.slice(0, 2), ...MASADA.slice(0, 1), ...OTHER.slice(0, 1)],
  killara: KILLARA,
  masada: MASADA,
  other: OTHER,
};

export function findSampleTutor(sampleId: string): SampleTutor | undefined {
  // sampleId format: "sample-<schoolSlug>-<index>"
  const match = sampleId.match(/^sample-([\w-]+)-(\d+)$/);
  if (!match) return undefined;
  const [, slug, idxStr] = match;
  const list = SAMPLE_TUTORS[slug];
  if (!list) return undefined;
  return list[parseInt(idxStr, 10)];
}

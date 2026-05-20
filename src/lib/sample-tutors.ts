// Demo data for the landing-page tutor cards. Real tutor listings come from
// the `tutor_profiles` table once admin verification is in place.

export type SampleTutor = {
  name: string;       // first name + last initial only (publicly visible)
  initials: string;
  suburb: string;
  atar: string;
  subjects: { s: string; b: string }[];
  rate: number;
  mode: string;
};

export const SAMPLE_TUTORS: Record<string, SampleTutor[]> = {
  default: [
    {
      name: "Lachlan H.", initials: "LH", suburb: "Killara", atar: "98.65",
      subjects: [{ s: "Maths Ext 1", b: "E4" }, { s: "Physics", b: "94" }],
      rate: 60, mode: "Online · In-person",
    },
    {
      name: "Sophie X.", initials: "SX", suburb: "Lindfield", atar: "99.10",
      subjects: [{ s: "Biology", b: "95" }, { s: "Chemistry", b: "93" }],
      rate: 55, mode: "Online",
    },
    {
      name: "Aarav K.", initials: "AK", suburb: "Gordon", atar: "99.40",
      subjects: [{ s: "Maths Ext 2", b: "E4" }, { s: "Physics", b: "95" }],
      rate: 70, mode: "In-person",
    },
    {
      name: "Mia C.", initials: "MC", suburb: "Killara", atar: "98.20",
      subjects: [{ s: "English Adv", b: "93" }, { s: "Modern Hist", b: "92" }],
      rate: 50, mode: "Online · In-person",
    },
  ],
  killara: [
    {
      name: "Lachlan H.", initials: "LH", suburb: "Killara", atar: "98.65",
      subjects: [{ s: "Maths Ext 1", b: "E4" }, { s: "Physics", b: "94" }],
      rate: 60, mode: "Online · In-person",
    },
    {
      name: "Sophie X.", initials: "SX", suburb: "Lindfield", atar: "99.10",
      subjects: [{ s: "Biology", b: "95" }, { s: "Chemistry", b: "93" }],
      rate: 55, mode: "Online",
    },
    {
      name: "Aarav K.", initials: "AK", suburb: "Gordon", atar: "99.40",
      subjects: [{ s: "Maths Ext 2", b: "E4" }, { s: "Physics", b: "95" }],
      rate: 70, mode: "In-person",
    },
    {
      name: "Mia C.", initials: "MC", suburb: "Killara", atar: "98.20",
      subjects: [{ s: "English Adv", b: "93" }, { s: "Modern Hist", b: "92" }],
      rate: 50, mode: "Online · In-person",
    },
  ],
  masada: [
    {
      name: "Daniel L.", initials: "DL", suburb: "St Ives", atar: "99.55",
      subjects: [{ s: "Maths Ext 1", b: "E4" }, { s: "Chemistry", b: "95" }],
      rate: 65, mode: "Online · In-person",
    },
    {
      name: "Hannah B.", initials: "HB", suburb: "Pymble", atar: "99.20",
      subjects: [{ s: "English Adv", b: "94" }, { s: "Economics", b: "93" }],
      rate: 60, mode: "Online",
    },
    {
      name: "Noah J.", initials: "NJ", suburb: "St Ives", atar: "98.70",
      subjects: [{ s: "Biology", b: "93" }, { s: "Maths Adv", b: "92" }],
      rate: 55, mode: "In-person",
    },
    {
      name: "Tali R.", initials: "TR", suburb: "Lindfield", atar: "99.75",
      subjects: [{ s: "Maths Ext 2", b: "E4" }, { s: "Physics", b: "96" }],
      rate: 75, mode: "Online · In-person",
    },
  ],
};

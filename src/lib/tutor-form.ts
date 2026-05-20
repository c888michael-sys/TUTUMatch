// Shared schema + validation helpers for the tutor signup form.
// Used by both the client form and the /api/tutor/applications endpoint
// so client-side and server-side rules can't drift apart.

import { z } from "zod";
import { HSC_SUBJECTS } from "./hsc-subjects";

// Sentinel value the high-school dropdown uses to switch on the "Other school"
// free-text field. Stored as a regular string in `schoolId` so the existing
// refine sees it like any other slug.
export const OTHER_SCHOOL_SENTINEL = "__other__";

export const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const YEAR_LEVELS = [7, 8, 9, 10, 11, 12] as const;

export const MIN_HOURLY_CENTS = 2000;   // $20
export const MAX_HOURLY_CENTS = 20000;  // $200

const timeSlotSchema = z
  .object({
    startMinutes: z.number().int().min(0).max(60 * 24 - 15),
    endMinutes: z.number().int().min(15).max(60 * 24),
  })
  .refine((s) => s.endMinutes > s.startMinutes, { message: "End time must be after start time" })
  .refine((s) => s.startMinutes % 15 === 0 && s.endMinutes % 15 === 0, {
    message: "Times must be in 15-minute increments",
  });

export const hscResultSchema = z.object({
  subject: z.string().refine((v) => HSC_SUBJECTS.includes(v), { message: "Pick from the HSC subject list" }),
  bandOrMark: z.string().min(1, "Required").max(20, "Too long"),
});

export const tutorApplicationSchema = z
  .object({
    firstName: z.string().trim().min(1, "Required").max(50),
    lastInitial: z
      .string()
      .trim()
      .length(1, "Single letter only")
      .regex(/^[A-Za-z]$/, "Must be a letter"),
    fullLastName: z.string().trim().min(1, "Required").max(80),
    publicBio: z.string().trim().min(20, "At least 20 characters").max(800, "Max 800 characters"),
    photoUrl: z.string().url().optional().or(z.literal("").transform(() => undefined)),

    contactEmail: z.string().email("Invalid email"),
    phone: z
      .string()
      .trim()
      .min(8, "Too short")
      .max(20)
      .regex(/^[\d+\s()-]+$/, "Digits, spaces, +, -, ( ) only"),
    socials: z.string().trim().max(200).optional().or(z.literal("").transform(() => undefined)),

    // We only enforce the date FORMAT in the schema. The 18+ age check is
    // applied at the API layer so an under-18 submission still produces an
    // application row — auto-rejected, with reviewer notes saying why.
    // That gives us an audit trail of attempts instead of a silent 400.
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),

    schoolId: z.string().optional().or(z.literal("").transform(() => undefined)),
    otherSchoolName: z.string().trim().max(120).optional().or(z.literal("").transform(() => undefined)),

    // Where the tutor is willing to tutor (drives /schools/[slug] browse tabs).
    tutoringAreaSchoolId: z.string().min(1, "Pick the area you'd tutor in"),
    tutoringAreaOther: z
      .string()
      .trim()
      .max(120)
      .optional()
      .or(z.literal("").transform(() => undefined)),

    atar: z
      .number({ invalid_type_error: "ATAR must be a number" })
      .min(0, "0 minimum")
      .max(99.95, "Max 99.95"),
    hscResults: z
      .array(hscResultSchema)
      .min(1, "Add at least one HSC result")
      .max(15, "Too many"),
    offeredSubjects: z
      .array(
        z.object({
          subject: z.string().refine((v) => HSC_SUBJECTS.includes(v), {
            message: "Pick from the HSC subject list",
          }),
          yearLevels: z
            .array(z.number().int().min(7).max(12))
            .min(1, "Pick at least one year for this subject"),
        })
      )
      .min(1, "Offer at least one subject"),

    hourlyRateCents: z
      .number()
      .int()
      .min(MIN_HOURLY_CENTS, `Min $${MIN_HOURLY_CENTS / 100}/hr`)
      .max(MAX_HOURLY_CENTS, `Max $${MAX_HOURLY_CENTS / 100}/hr`),
    suburb: z.string().trim().max(80).optional().or(z.literal("").transform(() => undefined)),
    postcode: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "4-digit Australian postcode")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    mode: z.enum(["IN_PERSON", "ONLINE", "EITHER"]),

    availability: z
      .object({
        MON: z.array(timeSlotSchema).optional(),
        TUE: z.array(timeSlotSchema).optional(),
        WED: z.array(timeSlotSchema).optional(),
        THU: z.array(timeSlotSchema).optional(),
        FRI: z.array(timeSlotSchema).optional(),
        SAT: z.array(timeSlotSchema).optional(),
        SUN: z.array(timeSlotSchema).optional(),
      })
      .refine((a) => Object.values(a).some((slots) => slots && slots.length > 0), {
        message: "Add at least one availability slot",
      }),

    wwccNumber: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9-]+$/, "Letters, digits, hyphens only")
      .min(6, "Too short")
      .max(20),
    wwccFullName: z.string().trim().min(1, "Required").max(120),
    wwccDob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),

    idDocumentNote: z.string().trim().max(200).optional().or(z.literal("").transform(() => undefined)),
    hscDocumentNote: z.string().trim().max(200).optional().or(z.literal("").transform(() => undefined)),
  })
  .refine((d) => d.schoolId || d.otherSchoolName, {
    message: "Pick your high school or enter it under Other",
    path: ["schoolId"],
  })
  .refine((d) => d.schoolId !== OTHER_SCHOOL_SENTINEL || (d.otherSchoolName && d.otherSchoolName.length > 0), {
    message: "Enter the name of your school",
    path: ["otherSchoolName"],
  })
  .refine(
    (d) => d.tutoringAreaSchoolId !== "other" || (d.tutoringAreaOther && d.tutoringAreaOther.length > 0),
    {
      message: "Tell us the suburb/area you'd tutor in",
      path: ["tutoringAreaOther"],
    }
  )
  .refine((d) => d.wwccDob === d.dateOfBirth, {
    message: "WWCC date of birth must match your date of birth",
    path: ["wwccDob"],
  })
  .refine(
    (d) => {
      // Subjects offered must be a subset of subjects the tutor has a HSC result in.
      const sat = new Set(d.hscResults.map((r) => r.subject));
      return d.offeredSubjects.every((o) => sat.has(o.subject));
    },
    {
      message: "You can only offer subjects you have an HSC result in",
      path: ["offeredSubjects"],
    }
  );

export type TutorApplicationInput = z.infer<typeof tutorApplicationSchema>;

export function ageInYears(isoDate: string, on: Date = new Date()): number {
  const dob = new Date(isoDate + "T00:00:00Z");
  if (Number.isNaN(dob.getTime())) return 0;
  const years = on.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    on.getUTCMonth() < dob.getUTCMonth() ||
    (on.getUTCMonth() === dob.getUTCMonth() && on.getUTCDate() < dob.getUTCDate());
  return beforeBirthday ? years - 1 : years;
}

// Contact-info scanner for bios + pre-unlock messages. Returns the patterns
// it found so the form / admin can surface specifics rather than just "blocked".
export function scanForContactInfo(text: string): string[] {
  const hits: string[] = [];
  // emails
  if (/[\w.+-]+@[\w-]+\.[\w.-]+/i.test(text)) hits.push("email_address");
  // phone-ish: 7+ consecutive digits, or AU mobile formats
  if (/(\+?\d[\s-]?){7,}/.test(text)) hits.push("phone_number");
  // social handles
  if (/(^|\s)@[A-Za-z0-9._]{3,}/i.test(text)) hits.push("social_handle");
  if (/\b(insta(gram)?|whatsapp|wechat|snapchat|telegram|signal|tiktok|fb|facebook)\b/i.test(text)) {
    hits.push("social_platform_mention");
  }
  // "DM me" / "message me on" patterns
  if (/\b(dm\s+me|message\s+me\s+on|find\s+me\s+on|reach\s+me\s+at)\b/i.test(text)) {
    hits.push("offplatform_contact_phrase");
  }
  return Array.from(new Set(hits));
}

export function minutesToLabel(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const period = h < 12 ? "am" : "pm";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${min.toString().padStart(2, "0")}${period}`;
}

export function generateTimeOptions(): { value: number; label: string }[] {
  const opts: { value: number; label: string }[] = [];
  for (let m = 0; m <= 60 * 24; m += 30) {
    opts.push({ value: m, label: minutesToLabel(m) });
  }
  return opts;
}

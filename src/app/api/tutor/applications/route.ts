import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  findApplicationByUserId,
  newId,
  upsertApplication,
  type TutorApplication,
} from "@/lib/db";
import { ageInYears, scanForContactInfo, tutorApplicationSchema } from "@/lib/tutor-form";

const UNDER_18_REJECTION_NOTE = (age: number, dob: string) =>
  `Automatically rejected: tutors must be 18 or older. Applicant DOB ${dob} (age ${age}). This decision is enforced by the platform on submission — admin override is possible but should require additional ID verification.`;

export const runtime = "nodejs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const existing = await findApplicationByUserId(session.userId);
  if (existing && existing.status !== "REJECTED") {
    return NextResponse.json({ error: "already_submitted", status: existing.status }, { status: 409 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = tutorApplicationSchema.safeParse(json);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return NextResponse.json(
      { error: "validation", fieldErrors: flat.fieldErrors, formErrors: flat.formErrors },
      { status: 400 }
    );
  }
  const v = parsed.data;

  const bioFlags = scanForContactInfo(v.publicBio);
  if (bioFlags.length > 0) {
    return NextResponse.json(
      {
        error: "validation",
        fieldErrors: { publicBio: [`Bio contains disallowed content (${bioFlags.join(", ")}). Remove it before submitting.`] },
      },
      { status: 400 }
    );
  }

  const age = ageInYears(v.dateOfBirth);
  const autoRejected = age < 18;
  const now = new Date().toISOString();

  const app: TutorApplication = {
    id: newId("app"),
    userId: session.userId,
    status: autoRejected ? "REJECTED" : "PENDING_REVIEW",
    visibility: !autoRejected,
    submittedAt: now,
    reviewedAt: autoRejected ? now : undefined,
    reviewerEmail: autoRejected ? "auto" : undefined,
    reviewerNotes: autoRejected ? UNDER_18_REJECTION_NOTE(age, v.dateOfBirth) : undefined,

    firstName: v.firstName,
    lastInitial: v.lastInitial.toUpperCase(),
    fullLastName: v.fullLastName,
    publicBio: v.publicBio,
    photoUrl: v.photoUrl,
    contactEmail: v.contactEmail,
    phone: v.phone,
    socials: v.socials,
    dateOfBirth: v.dateOfBirth,
    schoolId: v.schoolId,
    otherSchoolName: v.otherSchoolName,
    tutoringAreaSchoolId: v.tutoringAreaSchoolId,
    tutoringAreaOther: v.tutoringAreaOther,
    atar: v.atar,
    hscResults: v.hscResults,
    offeredSubjects: v.offeredSubjects,
    hourlyRateCents: v.hourlyRateCents,
    suburb: v.suburb,
    postcode: v.postcode,
    mode: v.mode,
    availability: v.availability,
    wwccNumber: v.wwccNumber,
    wwccFullName: v.wwccFullName,
    wwccDob: v.wwccDob,
    idDocumentNote: v.idDocumentNote,
    hscDocumentNote: v.hscDocumentNote,
    bioFlags,
  };
  await upsertApplication(app);

  return NextResponse.json({
    ok: true,
    applicationId: app.id,
    status: app.status,
    autoRejected,
  });
}

// PUT — update the current user's existing application. Validates with the
// same schema as create, then resets status back to PENDING_REVIEW so an
// admin re-reviews the change. We preserve id / userId / submittedAt /
// visibility so the existing listing identity sticks around.
export async function PUT(req: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const existing = await findApplicationByUserId(session.userId);
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = tutorApplicationSchema.safeParse(json);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return NextResponse.json(
      { error: "validation", fieldErrors: flat.fieldErrors, formErrors: flat.formErrors },
      { status: 400 }
    );
  }
  const v = parsed.data;

  const bioFlags = scanForContactInfo(v.publicBio);
  if (bioFlags.length > 0) {
    return NextResponse.json(
      {
        error: "validation",
        fieldErrors: { publicBio: [`Bio contains disallowed content (${bioFlags.join(", ")}). Remove it before saving.`] },
      },
      { status: 400 }
    );
  }

  const age = ageInYears(v.dateOfBirth);
  const autoRejected = age < 18;
  const now = new Date().toISOString();

  const updated: TutorApplication = {
    ...existing,
    status: autoRejected ? "REJECTED" : "PENDING_REVIEW",
    visibility: autoRejected ? false : existing.visibility,
    // Reset review trail. If auto-rejected, stamp the system as reviewer.
    reviewedAt: autoRejected ? now : undefined,
    reviewerEmail: autoRejected ? "auto" : undefined,
    reviewerNotes: autoRejected ? UNDER_18_REJECTION_NOTE(age, v.dateOfBirth) : undefined,

    firstName: v.firstName,
    lastInitial: v.lastInitial.toUpperCase(),
    fullLastName: v.fullLastName,
    publicBio: v.publicBio,
    photoUrl: v.photoUrl,
    contactEmail: v.contactEmail,
    phone: v.phone,
    socials: v.socials,
    dateOfBirth: v.dateOfBirth,
    schoolId: v.schoolId,
    otherSchoolName: v.otherSchoolName,
    tutoringAreaSchoolId: v.tutoringAreaSchoolId,
    tutoringAreaOther: v.tutoringAreaOther,
    atar: v.atar,
    hscResults: v.hscResults,
    offeredSubjects: v.offeredSubjects,
    hourlyRateCents: v.hourlyRateCents,
    suburb: v.suburb,
    postcode: v.postcode,
    mode: v.mode,
    availability: v.availability,
    wwccNumber: v.wwccNumber,
    wwccFullName: v.wwccFullName,
    wwccDob: v.wwccDob,
    idDocumentNote: v.idDocumentNote,
    hscDocumentNote: v.hscDocumentNote,
    bioFlags,
  };
  await upsertApplication(updated);

  return NextResponse.json({
    ok: true,
    applicationId: updated.id,
    status: updated.status,
    autoRejected,
  });
}

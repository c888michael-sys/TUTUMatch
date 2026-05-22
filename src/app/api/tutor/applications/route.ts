import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  findApplicationByUserId,
  newId,
  upsertApplication,
  type ApplicationStatus,
  type TutorApplication,
} from "@/lib/db";
import { tutorApplicationSchema } from "@/lib/tutor-form";
import { scanContent } from "@/lib/content-scanner";
import { TERMS_VERSION } from "@/lib/legal";

export const runtime = "nodejs";

// A clean listing is auto-approved and goes live immediately; a flagged one
// waits for spam/abuse review. Tutors self-declare being 18+ on the signup
// form — TUTUMatch does not verify dates of birth. (Phone-OTP gating is added
// in a later step, once an OTP provider is configured.)
function statusFromScan(flags: string[]): ApplicationStatus {
  return flags.length > 0 ? "PENDING_REVIEW" : "APPROVED";
}

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
  const now = new Date().toISOString();

  // Content scan — flagged listings go to spam/abuse review; clean ones are
  // auto-approved. A flag no longer blocks submission.
  const bioFlags = scanContent(v.publicBio);
  const status = statusFromScan(bioFlags);

  const app: TutorApplication = {
    id: newId("app"),
    userId: session.userId,
    status,
    visibility: true,
    submittedAt: now,
    reviewedAt: status === "APPROVED" ? now : undefined,
    reviewerEmail: status === "APPROVED" ? "auto" : undefined,
    reviewerNotes:
      status === "APPROVED" ? "Auto-approved — content scan found no flags." : undefined,

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
    idDocumentUploadId: v.idDocumentUploadId,
    wwccDocumentUploadId: v.wwccDocumentUploadId,
    hscDocumentUploadId: v.hscDocumentUploadId,
    termsAcceptedVersion: TERMS_VERSION,
    termsAcceptedAt: now,
    bioFlags,
  };
  await upsertApplication(app);

  return NextResponse.json({ ok: true, applicationId: app.id, status: app.status });
}

// PUT — update the current user's existing application. Validates with the
// same schema, re-runs the content scan, and re-derives status: a clean edit
// goes straight back live, a flagged edit returns to review. id / userId /
// submittedAt are preserved so the listing identity sticks.
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
  const now = new Date().toISOString();

  const bioFlags = scanContent(v.publicBio);
  const status = statusFromScan(bioFlags);

  const updated: TutorApplication = {
    ...existing,
    status,
    visibility: existing.visibility,
    reviewedAt: status === "APPROVED" ? now : undefined,
    reviewerEmail: status === "APPROVED" ? "auto" : undefined,
    reviewerNotes:
      status === "APPROVED" ? "Auto-approved — content scan found no flags." : undefined,

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
    idDocumentUploadId: v.idDocumentUploadId,
    wwccDocumentUploadId: v.wwccDocumentUploadId,
    hscDocumentUploadId: v.hscDocumentUploadId,
    termsAcceptedVersion: TERMS_VERSION,
    termsAcceptedAt: now,
    bioFlags,
  };
  await upsertApplication(updated);

  return NextResponse.json({ ok: true, applicationId: updated.id, status: updated.status });
}

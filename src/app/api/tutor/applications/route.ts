import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  findApplicationByUserId,
  newId,
  upsertApplication,
  type TutorApplication,
} from "@/lib/db";
import { scanForContactInfo, tutorApplicationSchema } from "@/lib/tutor-form";

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

  const app: TutorApplication = {
    id: newId("app"),
    userId: session.userId,
    status: "PENDING_REVIEW",
    submittedAt: new Date().toISOString(),

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

  return NextResponse.json({ ok: true, applicationId: app.id });
}

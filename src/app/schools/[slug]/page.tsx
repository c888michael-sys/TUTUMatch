import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolBrowse } from "@/components/school/SchoolBrowse";
import { TopNav } from "@/components/nav/TopNav";
import { OTHER_AREA_SCHOOL } from "@/lib/schools";
import { findSchoolBySlug, loadActiveSchools } from "@/lib/schools-store";
import { listApprovedTutors } from "@/lib/db";
import { buildBrowseList } from "@/lib/browse-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const school = await findSchoolBySlug(params.slug);
  if (!school) return { title: "School not found · TUTUMatch" };
  return {
    title: `Tutors at ${school.name} · TUTUMatch`,
    description: `Browse TUTUMatch tutors from ${school.name}. ${school.tagline}.`,
  };
}

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const [school, schools, approved] = await Promise.all([
    findSchoolBySlug(params.slug),
    loadActiveSchools(),
    listApprovedTutors(),
  ]);
  if (!school) notFound();
  // OTHER is always a valid landing target even if not in the active list
  void OTHER_AREA_SCHOOL;

  const tutors = buildBrowseList(school.id, approved);
  const realCount = approved.filter((a) => a.tutoringAreaSchoolId === school.id).length;

  return (
    <>
      <TopNav />
      <SchoolBrowse school={school} tutors={tutors} realCount={realCount} schools={schools} />
    </>
  );
}

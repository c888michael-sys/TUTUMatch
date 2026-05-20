import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolBrowse } from "@/components/school/SchoolBrowse";
import { TopNav } from "@/components/nav/TopNav";
import { OTHER_AREA_SCHOOL, SCHOOLS, findSchool } from "@/lib/schools";
import { listApprovedTutors } from "@/lib/db";
import { buildBrowseList } from "@/lib/browse-data";

// Pre-render the known school slugs at build time; the rendered output
// itself is still computed dynamically (force-dynamic below) so newly
// approved tutors appear instantly without a re-deploy.
export function generateStaticParams() {
  return [
    ...SCHOOLS.filter((s) => s.active).map((s) => ({ slug: s.id })),
    { slug: OTHER_AREA_SCHOOL.id },
  ];
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const school = findSchool(params.slug);
  if (!school) return { title: "School not found · TUTUMatch" };
  return {
    title: `Tutors at ${school.name} · TUTUMatch`,
    description: `Browse TUTUMatch tutors from ${school.name}. ${school.tagline}.`,
  };
}

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const school = findSchool(params.slug);
  if (!school) notFound();

  const approved = await listApprovedTutors();
  const tutors = buildBrowseList(school.id, approved);
  const realCount = approved.filter((a) => a.tutoringAreaSchoolId === school.id).length;

  return (
    <>
      <TopNav />
      <SchoolBrowse school={school} tutors={tutors} realCount={realCount} />
    </>
  );
}

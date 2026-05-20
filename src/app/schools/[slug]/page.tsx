import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolBrowse } from "@/components/school/SchoolBrowse";
import { TopNav } from "@/components/nav/TopNav";
import { SCHOOLS, findSchool } from "@/lib/schools";

export function generateStaticParams() {
  return SCHOOLS.filter((s) => s.active).map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const school = findSchool(params.slug);
  if (!school) return { title: "School not found · TutMatch" };
  return {
    title: `Tutors at ${school.name} · TutMatch`,
    description: `Browse TutMatch tutors from ${school.name}. ${school.tagline}.`,
  };
}

export default function SchoolPage({ params }: { params: { slug: string } }) {
  const school = findSchool(params.slug);
  if (!school) notFound();
  return (
    <>
      <TopNav />
      <SchoolBrowse school={school} />
    </>
  );
}

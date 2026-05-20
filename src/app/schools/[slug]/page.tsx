import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { SCHOOLS, findSchool } from "@/lib/schools";

export function generateStaticParams() {
  return SCHOOLS.filter((s) => s.active).map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const school = findSchool(params.slug);
  if (!school) return { title: "School not found · TutMatch" };
  return {
    title: `${school.name} · TutMatch`,
    description: `Find a TutMatch tutor from ${school.name}. ${school.tagline}.`,
  };
}

export default function SchoolPage({ params }: { params: { slug: string } }) {
  const school = findSchool(params.slug);
  if (!school) notFound();
  return <LandingPage school={school} />;
}

import { SchoolBrowse } from "@/components/school/SchoolBrowse";
import { TopNav } from "@/components/nav/TopNav";
import { DEFAULT_SCHOOL } from "@/lib/schools";
import { listApprovedTutors } from "@/lib/db";
import { buildBrowseList } from "@/lib/browse-data";

export const metadata = { title: "Browse tutors · TUTUMatch" };
export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const approved = await listApprovedTutors();
  const tutors = buildBrowseList(DEFAULT_SCHOOL.id, approved);
  return (
    <>
      <TopNav />
      <SchoolBrowse school={DEFAULT_SCHOOL} tutors={tutors} realCount={approved.length} />
    </>
  );
}

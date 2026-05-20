import { SchoolBrowse } from "@/components/school/SchoolBrowse";
import { TopNav } from "@/components/nav/TopNav";
import { DEFAULT_SCHOOL } from "@/lib/schools";

export const metadata = { title: "Browse tutors · TUTUMatch" };

export default function BrowsePage() {
  return (
    <>
      <TopNav />
      <SchoolBrowse school={DEFAULT_SCHOOL} />
    </>
  );
}

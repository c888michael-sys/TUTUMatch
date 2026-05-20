import { LandingPage } from "@/components/landing/LandingPage";
import { DEFAULT_SCHOOL } from "@/lib/schools";
import { loadActiveSchools } from "@/lib/schools-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const schools = await loadActiveSchools();
  return <LandingPage school={DEFAULT_SCHOOL} schools={schools} />;
}

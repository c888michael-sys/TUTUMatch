import { LandingPage } from "@/components/landing/LandingPage";
import { DEFAULT_SCHOOL } from "@/lib/schools";

export default function HomePage() {
  return <LandingPage school={DEFAULT_SCHOOL} />;
}

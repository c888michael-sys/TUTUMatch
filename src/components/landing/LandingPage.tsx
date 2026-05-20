import { Comparison } from "./Comparison";
import { Earnings } from "./Earnings";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";
import { Guarantee } from "./Guarantee";
import { Hero } from "./Hero";
import { HowMirrored } from "./HowMirrored";
import { Mechanic } from "./Mechanic";
import { Pitch } from "./Pitch";
import { SchoolBar } from "./SchoolBar";
import { StickyBar } from "./StickyBar";
import { Trust } from "./Trust";
import type { School } from "@/lib/schools";

export function LandingPage({ school }: { school: School }) {
  // Each school's brand colour set inline overrides the defaults baked into
  // globals.css. Anything driven by --brand / --brand-deep / --brand-soft
  // re-themes automatically without a recompile.
  const themeStyle: React.CSSProperties = {
    ["--brand" as string]: school.brand,
    ["--brand-deep" as string]: school.brandDeep,
    ["--brand-soft" as string]: school.brandSoft,
  };

  return (
    <div data-school={school.id} style={themeStyle}>
      <StickyBar />
      <Hero showFloats />
      <Pitch />
      <Mechanic />
      <SchoolBar current={school} />
      <HowMirrored />
      <Comparison brand="TUTUMatch" />
      <Trust />
      <Guarantee />
      <Earnings brand="TUTUMatch" />
      <FAQ />
      <FinalCTA school={school} />
      <Footer />
    </div>
  );
}

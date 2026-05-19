import { useState } from "react";
import { LandingNav }      from "./LandingNav";
import { HeroSection }     from "./HeroSection";
import { StatsSection }    from "./StatsSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorks }      from "./HowItWorks";
import { ForWhom }         from "./ForWhom";
import { Testimonials }    from "./Testimonials";
import { FaqSection }      from "./FaqSection";
import { LandingFooter }   from "./LandingFooter";
import {
  InstallGuideSheet,
  type InstallPlatform,
} from "@/components/app/InstallGuideSheet";

export default function LandingPage() {
  const [installSheet, setInstallSheet] = useState<InstallPlatform | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <ForWhom />
      <Testimonials />
      <FaqSection />
      <LandingFooter />

      <InstallGuideSheet
        open={installSheet !== null}
        platform={installSheet}
        onClose={() => setInstallSheet(null)}
      />
    </div>
  );
}

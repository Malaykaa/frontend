import { LandingNav }      from "./LandingNav";
import { HeroSection }     from "./HeroSection";
import { StatsSection }    from "./StatsSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorks }      from "./HowItWorks";
import { ForWhom }         from "./ForWhom";
import { Testimonials }    from "./Testimonials";
import { FaqSection }      from "./FaqSection";
import { LandingFooter }   from "./LandingFooter";

export default function LandingPage() {
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
    </div>
  );
}

import { LandingNav }       from "./LandingNav";
import { HeroSection }      from "./HeroSection";
import { StatsSection }     from "./StatsSection";
import { FeaturesSection }  from "./FeaturesSection";
import { HowItWorks }       from "./HowItWorks";
import { ForWhom }          from "./ForWhom";
import { TechSimulation }   from "./TechSimulation";
import { Testimonials }     from "./Testimonials";
import { B2BSection }       from "./B2BSection";
import { LandingFooter }    from "./LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <ForWhom />
      <TechSimulation />
      <B2BSection />
      <Testimonials />
      <LandingFooter />
    </div>
  );
}

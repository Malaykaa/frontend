import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HeroWhatsAppSimulation } from "./HeroWhatsAppSimulation";

export function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">

      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-violet-500/6 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 rounded-full bg-amber-400/4 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div className="space-y-6 text-center lg:text-left order-1 lg:order-1">

            {/* Mono label */}
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary"
              >
                {t("landing.badge")}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-0.5">
              {/* Line 1 — lighter, acts as lead-in */}
              <p className="text-2xl font-semibold tracking-tight text-foreground/60 sm:text-3xl">
                {t("landing.hero_headline")}
              </p>
              {/* Line 2 — ultra-bold, animated gradient */}
              <p
                className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.6rem]"
                style={{
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(90deg, hsl(var(--primary)), #8b5cf6, #06b6d4, hsl(var(--primary)))",
                  backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "hero-gradient 5s linear infinite",
                }}
              >
                {t("landing.hero_headline_2")}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[480px] mx-auto lg:mx-0">
              {t("landing.hero_subtitle_v2")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <Button
                size="lg"
                className="h-11 px-7 gap-2 text-sm font-bold shadow-lg shadow-primary/30 rounded-xl"
                onClick={() => navigate("/onboarding")}
              >
                {t("landing.cta_start")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-7 text-sm rounded-xl"
                onClick={() => navigate("/login")}
              >
                {t("landing.nav_login")}
              </Button>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1.5">
              {[t("landing.trust_1"), t("landing.trust_2"), t("landing.trust_3")].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: simulation d'une vraie conversation Malayka, jusqu'à
              l'alerte WhatsApp. Remplace l'ancien tableau de bord factice
              (barre de scan, liste de correspondances) : on montre le produit
              plutôt que de le mettre en scène. ── */}
          <div className="order-2 lg:order-2 flex justify-center lg:justify-end">
            <HeroWhatsAppSimulation />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-gradient {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        @keyframes scan-grow {
          from { width: 50%; }
          to   { width: 88%; }
        }
      `}</style>
    </section>
  );
}

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-amber-400/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col-reverse items-center gap-10 md:flex-row md:gap-16 md:items-center">

          {/* Left — Text */}
          <div className="flex-1 text-center md:text-left space-y-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/6 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                {t("landing.badge")}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t("landing.hero_headline")}
              </h1>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t("landing.hero_headline_2")}
              </h1>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {t("landing.hero_headline_accent")}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0 sm:text-lg">
              {t("landing.hero_subtitle_v2")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Button
                size="lg"
                className="gap-2 text-base font-semibold h-12 px-7 shadow-lg shadow-primary/20"
                onClick={() => navigate("/onboarding")}
              >
                {t("landing.cta_start")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base h-12 px-7"
                onClick={() => navigate("/login")}
              >
                {t("landing.nav_login")}
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1.5">
              {[
                t("landing.signup_hint").split("·")[0].trim(),
                t("landing.signup_hint").split("·")[1]?.trim(),
                t("landing.signup_hint").split("·")[2]?.trim(),
              ].filter(Boolean).map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Hero image */}
          <div className="flex-shrink-0 flex justify-center md:justify-end">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-primary/10 to-amber-400/10 blur-2xl" />
              <img
                src="/hero-woman.png.png"
                alt="Malayka — Mentor IA"
                className="relative z-10 h-[380px] w-auto object-contain drop-shadow-2xl md:h-[460px] lg:h-[520px]"
              />

              {/* Floating card — plan d'action */}
              <div className="absolute bottom-12 -left-6 z-20 hidden md:flex items-center gap-2.5 rounded-2xl border bg-background/95 backdrop-blur-sm px-3.5 py-2.5 shadow-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-none">Plan d'action créé</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Bourse d'études · 8 étapes</p>
                </div>
              </div>

              {/* Floating card — match */}
              <div className="absolute top-16 -right-4 z-20 hidden md:flex items-center gap-2 rounded-2xl border bg-background/95 backdrop-blur-sm px-3.5 py-2.5 shadow-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-none">92% match</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Nouvelle opportunité</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

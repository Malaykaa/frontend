import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sparkles } from "lucide-react";

export function CtaSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-14 md:py-20 relative overflow-hidden bg-primary">
      {/* Background mesh */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/8 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-3xl px-5 text-center space-y-7">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-2 ring-white/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Member badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
          <Users className="h-3.5 w-3.5 text-white/80" />
          <span className="text-xs font-semibold text-white/90">{t("landing.cta_final_members")}</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
            {t("landing.cta_final_label")}
          </p>
          <h2 className="text-3xl font-extrabold text-white leading-tight md:text-5xl">
            {t("landing.cta_final_title")}
          </h2>
        </div>

        <p className="text-base text-white/70 max-w-xl mx-auto leading-relaxed">
          {t("landing.cta_final_desc")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 gap-2 text-base font-bold h-13 px-8 shadow-2xl shadow-black/20"
            onClick={() => navigate("/onboarding")}
          >
            {t("landing.cta_start")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/10 border border-white/25 text-base h-13 px-8"
            onClick={() => navigate("/login")}
          >
            {t("landing.nav_login")}
          </Button>
        </div>

        <p className="text-xs text-white/40">{t("landing.signup_hint")}</p>
      </div>
    </section>
  );
}

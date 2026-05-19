import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";

export function CtaSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-5 text-center space-y-7">

        {/* Logo icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-2 ring-white/20">
            <img src="/icon.png" alt="" className="h-9 w-9 object-contain brightness-0 invert" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
          <Users className="h-3.5 w-3.5" />
          {t("landing.cta_final_members")}
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            {t("landing.cta_final_label")}
          </p>
          <h2 className="text-3xl font-extrabold text-white leading-tight md:text-5xl">
            {t("landing.cta_final_title")}
          </h2>
        </div>

        <p className="text-base text-white/75 max-w-xl mx-auto leading-relaxed">
          {t("landing.cta_final_desc")}
        </p>

        {/* CTA */}
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

        <p className="text-xs text-white/50">{t("landing.signup_hint")}</p>
      </div>
    </section>
  );
}

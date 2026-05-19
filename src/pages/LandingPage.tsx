import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { setLanguage } from "@/i18n";
import {
  Sparkles,
  Target,
  Zap,
  GraduationCap,
  Briefcase,
  FileText,
  ArrowRight,
  Star,
} from "lucide-react";
import {
  InstallGuideSheet,
  type InstallPlatform,
} from "@/components/app/InstallGuideSheet";

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [installSheet, setInstallSheet] = useState<InstallPlatform | null>(null);

  const testimonials = [
    { name: "Aminata K.", role: t("landing.testimonial_1_role"), text: t("landing.testimonial_1_text"), avatar: "AK" },
    { name: "Serge M.",   role: t("landing.testimonial_2_role"), text: t("landing.testimonial_2_text"), avatar: "SM" },
    { name: "Fatoumata D.", role: t("landing.testimonial_3_role"), text: t("landing.testimonial_3_text"), avatar: "FD" },
  ];

  const features = [
    { Icon: Target,       color: "bg-violet-100 text-violet-600",   titleKey: "landing.feature_1_title", descKey: "landing.feature_1_desc" },
    { Icon: Sparkles,     color: "bg-amber-100 text-amber-600",     titleKey: "landing.feature_2_title", descKey: "landing.feature_2_desc" },
    { Icon: FileText,     color: "bg-emerald-100 text-emerald-600", titleKey: "landing.feature_3_title", descKey: "landing.feature_3_desc" },
    { Icon: GraduationCap,color: "bg-sky-100 text-sky-600",         titleKey: "landing.feature_4_title", descKey: "landing.feature_4_desc" },
    { Icon: Briefcase,    color: "bg-rose-100 text-rose-600",       titleKey: "landing.feature_5_title", descKey: "landing.feature_5_desc" },
    { Icon: Zap,          color: "bg-orange-100 text-orange-600",   titleKey: "landing.feature_6_title", descKey: "landing.feature_6_desc" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3">
          <div className="flex items-center">
            <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
              onClick={() => setLanguage(i18n.language === "fr" ? "en" : "fr")}
            >
              {i18n.language === "fr" ? "EN" : "FR"}
            </button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              {t("auth.login")}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pt-14 pb-12 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-sm space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium text-primary">{t("landing.badge")}</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            {t("landing.hero_title")}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            {t("landing.hero_subtitle")}
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              size="lg"
              className="w-full gap-2 text-base"
              onClick={() => navigate("/onboarding")}
            >
              {t("landing.cta_start")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full text-base"
              onClick={() => navigate("/login")}
            >
              {t("landing.cta_login")}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("landing.signup_hint")}
          </p>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section className="border-y bg-muted/30 px-5 py-6">
        <div className="mx-auto grid max-w-sm grid-cols-3 gap-4 text-center">
          {[
            { value: "10k+", labelKey: "landing.stat_users"    },
            { value: "15+",  labelKey: "landing.stat_countries" },
            { value: "50k+", labelKey: "landing.stat_docs"     },
          ].map((s) => (
            <div key={s.labelKey}>
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{t(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Installer l'app ────────────────────────────────────── */}
      <section className="px-5 py-6">
        <div className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setInstallSheet("ios")}
            className="flex flex-1 items-center gap-3 rounded-xl bg-black px-5 py-3 hover:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 fill-white" aria-hidden>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.3-2.18 3.91.03 3.02 2.65 4.03 2.68 4.04l-.05.17zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="text-left">
              <p className="text-[10px] leading-none text-white/70">{t("landing.install_on")}</p>
              <p className="text-base font-semibold leading-tight text-white">iPhone / iPad</p>
            </div>
          </button>

          <button
            onClick={() => setInstallSheet("android")}
            className="flex flex-1 items-center gap-3 rounded-xl bg-black px-5 py-3 hover:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" aria-hidden>
              <path d="M3.18 23.76c.3.16.64.2.96.12l11.9-11.9L12 8.04 3.18 23.76z" fill="#EA4335"/>
              <path d="M21.54 10.27l-2.84-1.64-3.56 3.56 3.56 3.55 2.87-1.65c.82-.47.82-1.35-.03-1.82z" fill="#FBBC04"/>
              <path d="M3.18.24C2.86.06 2.5.07 2.23.28L14.04 12l3.06-3.06L3.18.24z" fill="#4285F4"/>
              <path d="M2.23 23.72c.27.21.63.22.95.04l14-8.08-3.14-3.14L2.23 23.72z" fill="#34A853"/>
            </svg>
            <div className="text-left">
              <p className="text-[10px] leading-none text-white/70">{t("landing.install_on")}</p>
              <p className="text-base font-semibold leading-tight text-white">Android</p>
            </div>
          </button>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-sm space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{t("landing.features_title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("landing.features_subtitle")}
            </p>
          </div>

          <div className="space-y-3">
            {features.map(({ Icon, color, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t(titleKey)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {t(descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="bg-muted/30 px-5 py-12">
        <div className="mx-auto max-w-sm space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{t("landing.testimonials_title")}</h2>
          </div>

          <div className="space-y-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {item.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      "{item.text}"
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {item.name} · {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────── */}
      <section className="px-5 py-14 text-center">
        <div className="mx-auto max-w-sm space-y-5">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">
            {t("landing.cta_final_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("landing.cta_final_desc")}
          </p>
          <Button
            size="lg"
            className="w-full gap-2 text-base"
            onClick={() => navigate("/onboarding")}
          >
            {t("landing.cta_start_arrow")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ── Install Sheet ───────────────────────────────────────── */}
      <InstallGuideSheet
        open={installSheet !== null}
        platform={installSheet}
        onClose={() => setInstallSheet(null)}
      />

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t px-5 py-6 text-center">
        <div className="mx-auto max-w-sm space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <img src="/logo.png" alt="Malayka" className="h-6 w-auto dark:invert" />
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Malayka · contact@99eange.com
          </p>
          <p className="text-xs text-muted-foreground">
            {t("landing.footer_tagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}

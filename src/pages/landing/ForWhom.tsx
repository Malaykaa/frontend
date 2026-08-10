import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Briefcase, Search, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROFILES = [
  {
    Icon: GraduationCap,
    titleKey: "landing.for_student_title",
    highlightKey: "landing.for_student_highlight",
    bullets: ["landing.for_student_1", "landing.for_student_2", "landing.for_student_3"],
    impactKey: "landing.for_whom_impact_student",
    accent: "border-t-sky-400",
    iconBg: "bg-sky-100 dark:bg-sky-900/50",
    iconColor: "text-sky-600 dark:text-sky-400",
    glowColor: "bg-sky-400/10",
    chipColor: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-700",
    dotColor: "bg-sky-400",
  },
  {
    Icon: Briefcase,
    titleKey: "landing.for_pro_title",
    highlightKey: "landing.for_pro_highlight",
    bullets: ["landing.for_pro_1", "landing.for_pro_2", "landing.for_pro_3"],
    impactKey: "landing.for_whom_impact_pro",
    accent: "border-t-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    glowColor: "bg-violet-400/10",
    chipColor: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-700",
    dotColor: "bg-violet-400",
  },
  {
    Icon: Search,
    titleKey: "landing.for_seeker_title",
    highlightKey: "landing.for_seeker_highlight",
    bullets: ["landing.for_seeker_1", "landing.for_seeker_2", "landing.for_seeker_3"],
    impactKey: "landing.for_whom_impact_seeker",
    accent: "border-t-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    glowColor: "bg-amber-400/10",
    chipColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700",
    dotColor: "bg-amber-400",
  },
  {
    Icon: Zap,
    titleKey: "landing.for_freelance_title",
    highlightKey: "landing.for_freelance_highlight",
    bullets: ["landing.for_freelance_1", "landing.for_freelance_2", "landing.for_freelance_3"],
    impactKey: "landing.for_whom_impact_freelance",
    accent: "border-t-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    glowColor: "bg-emerald-400/10",
    chipColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700",
    dotColor: "bg-emerald-400",
  },
];

export function ForWhom() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-14 md:py-20 relative overflow-hidden">

      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-6 bg-primary/40" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            {t("landing.for_whom_label")}
          </span>
          <span className="h-px w-6 bg-primary/40" />
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-2xl text-center mb-10 md:mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-4xl">
            {t("landing.for_whom_title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("landing.for_whom_subtitle")}
          </p>
        </div>

        {/* 2×2 persona grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROFILES.map((p) => (
            <div
              key={p.titleKey}
              className={`group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5`}
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full ${p.accent} border-t-4`} />

              {/* Subtle glow blob */}
              <div className={`pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full ${p.glowColor} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="flex flex-col flex-1 p-6 space-y-5">

                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${p.iconBg}`}>
                    <p.Icon className={`h-5 w-5 ${p.iconColor}`} />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-bold text-base leading-tight">{t(p.titleKey)}</h3>
                    <p className={`text-xs mt-1 font-medium ${p.iconColor}`}>{t(p.highlightKey)}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-border" />

                {/* Bullets */}
                <ul className="space-y-2.5 flex-1">
                  {p.bullets.map((key) => (
                    <li key={key} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                      <span className="text-sm text-foreground/80 leading-snug">{t(key)}</span>
                    </li>
                  ))}
                </ul>

                {/* Footer: CTA + impact chip */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <Button
                    size="sm"
                    className="gap-1.5 font-semibold text-xs h-8 px-4 rounded-lg"
                    onClick={() => navigate("/onboarding")}
                  >
                    {t("landing.cta_start")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${p.chipColor}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${p.dotColor} animate-pulse`} />
                    {t(p.impactKey)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

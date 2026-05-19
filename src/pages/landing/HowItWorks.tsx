import { useTranslation } from "react-i18next";
import { UserCircle2, BrainCircuit, Rocket } from "lucide-react";

const STEPS = [
  { num: "01", Icon: UserCircle2, color: "bg-primary/10 text-primary",      titleKey: "landing.how_1_title", descKey: "landing.how_1_desc" },
  { num: "02", Icon: BrainCircuit, color: "bg-violet-100 text-violet-600",  titleKey: "landing.how_2_title", descKey: "landing.how_2_desc" },
  { num: "03", Icon: Rocket,       color: "bg-emerald-100 text-emerald-600", titleKey: "landing.how_3_title", descKey: "landing.how_3_desc" },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28 bg-muted/20">
      <div className="mx-auto max-w-6xl px-5">

        {/* Header */}
        <div className="mx-auto max-w-xl text-center mb-14 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("landing.how_title")}
          </h2>
          <p className="text-base text-muted-foreground">{t("landing.how_subtitle")}</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="absolute top-10 left-1/6 right-1/6 hidden md:block h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {STEPS.map(({ num, Icon, color, titleKey, descKey }, i) => (
            <div key={num} className="flex flex-col items-center text-center gap-4">
              {/* Number + icon */}
              <div className="relative flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-primary/50 tracking-widest">{num}</span>
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color} shadow-sm ring-4 ring-background`}>
                  <Icon className="h-7 w-7" />
                </div>
                {/* Arrow connector on mobile */}
                {i < 2 && (
                  <div className="md:hidden mt-2 flex flex-col items-center gap-1">
                    <div className="h-5 w-px bg-border" />
                    <div className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                )}
              </div>

              <div className="space-y-2 max-w-xs">
                <p className="text-base font-bold text-foreground">{t(titleKey)}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

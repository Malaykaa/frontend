import { useTranslation } from "react-i18next";
import { UserCircle2, BrainCircuit, Rocket, LineChart } from "lucide-react";

const STEPS = [
  { num: "01", Icon: UserCircle2, color: "bg-primary/10 text-primary",        titleKey: "landing.how_1_title", descKey: "landing.how_1_desc" },
  { num: "02", Icon: BrainCircuit, color: "bg-violet-100 text-violet-600",    titleKey: "landing.how_2_title", descKey: "landing.how_2_desc" },
  { num: "03", Icon: Rocket,       color: "bg-emerald-100 text-emerald-600",  titleKey: "landing.how_3_title", descKey: "landing.how_3_desc" },
  { num: "04", Icon: LineChart,    color: "bg-amber-100 text-amber-600",      titleKey: "landing.how_4_title", descKey: "landing.how_4_desc" },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-10 md:py-14 bg-muted/20">
      <div className="mx-auto max-w-6xl px-5">

        {/* Header */}
        <div className="mx-auto max-w-xl text-center mb-8 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("landing.how_title")}
          </h2>
          <p className="text-base text-muted-foreground">{t("landing.how_subtitle")}</p>
        </div>

        {/* Steps — 2×2 grid on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10">
          {STEPS.map(({ num, Icon, color, titleKey, descKey }, i) => (
            <div key={num} className="flex gap-5 items-start">
              {/* Number + icon */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-[10px] font-bold text-primary/50 tracking-widest">{num}</span>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} shadow-sm ring-4 ring-background`}>
                  <Icon className="h-6 w-6" />
                </div>
                {/* Mobile connector */}
                {i < 3 && (
                  <div className="sm:hidden mt-1 flex flex-col items-center gap-0.5">
                    <div className="h-4 w-px bg-border" />
                    <div className="h-1 w-1 rounded-full bg-border" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-1">
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

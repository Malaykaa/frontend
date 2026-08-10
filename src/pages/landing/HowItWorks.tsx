import { useTranslation } from "react-i18next";
import { UserCircle2, BrainCircuit, Inbox, FileCheck } from "lucide-react";

const STEPS = [
  {
    num: "01",
    Icon: UserCircle2,
    text: "text-sky-400",
    bg: "bg-sky-500/15",
    border: "border-sky-500/20",
    glow: "shadow-sky-500/20",
    titleKey: "landing.how_1_title",
    descKey: "landing.how_1_desc",
  },
  {
    num: "02",
    Icon: BrainCircuit,
    text: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/20",
    titleKey: "landing.how_2_title",
    descKey: "landing.how_2_desc",
  },
  {
    num: "03",
    Icon: Inbox,
    text: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/20",
    titleKey: "landing.how_3_title",
    descKey: "landing.how_3_desc",
  },
  {
    num: "04",
    Icon: FileCheck,
    text: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/20",
    titleKey: "landing.how_4_title",
    descKey: "landing.how_4_desc",
  },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="bg-zinc-950 py-12 md:py-16 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow blob */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-5">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-6 bg-primary/40" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">Comment ça marche</span>
          <span className="h-px w-6 bg-primary/40" />
        </div>

        <div className="mx-auto max-w-xl text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 md:text-4xl">
            {t("landing.how_title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">{t("landing.how_subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STEPS.map(({ num, Icon, text, bg, border, glow, titleKey, descKey }) => (
            <div
              key={num}
              className={`group relative flex gap-4 rounded-2xl border bg-zinc-900/80 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${border} ${glow}`}
            >
              {/* Icon */}
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ring-1 ${border}`}>
                <Icon className={`h-5 w-5 ${text}`} />
              </div>

              {/* Content */}
              <div className="space-y-1 pt-0.5">
                <p className="text-sm font-bold text-zinc-100">{t(titleKey)}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{t(descKey)}</p>
              </div>

              {/* Watermark number */}
              <span
                className={`absolute bottom-3 right-4 font-mono text-4xl font-extrabold leading-none select-none opacity-10 ${text}`}
              >
                {num}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

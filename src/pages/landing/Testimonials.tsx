import { useTranslation } from "react-i18next";
import { Quote, Sparkles } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS — "Impact stories" bento layout
   Desktop: asymmetric 3-col grid  (span-2 / span-1 alternating per row)
   Mobile:  single column stack
   ══════════════════════════════════════════════════════════════════════════ */

type Testimonial = {
  name: string;
  role: string;
  text: string;
  metric: string;
  avatar: string;
  avatarColor: string;
  metricColor: string;
  accentGradient: string;
  glowColor: string;
  featured: boolean;
};

export function Testimonials() {
  const { t } = useTranslation();

  const items: Testimonial[] = [
    {
      name: "Moussa K.",
      avatar: "MK",
      avatarColor: "bg-sky-500/25 text-sky-200",
      role: t("landing.testimonial_1_role"),
      text: t("landing.testimonial_1_text"),
      metric: t("landing.testimonial_1_metric"),
      metricColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      accentGradient: "from-sky-500/25 via-sky-500/5 to-transparent",
      glowColor: "bg-sky-500/10",
      featured: true,
    },
    {
      name: "Naomi B.",
      avatar: "NB",
      avatarColor: "bg-emerald-500/25 text-emerald-200",
      role: t("landing.testimonial_2_role"),
      text: t("landing.testimonial_2_text"),
      metric: t("landing.testimonial_2_metric"),
      metricColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      accentGradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      glowColor: "bg-emerald-500/10",
      featured: false,
    },
    {
      name: "Dr. Amara S.",
      avatar: "AS",
      avatarColor: "bg-violet-500/25 text-violet-200",
      role: t("landing.testimonial_3_role"),
      text: t("landing.testimonial_3_text"),
      metric: t("landing.testimonial_3_metric"),
      metricColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      accentGradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      glowColor: "bg-violet-500/10",
      featured: false,
    },
    {
      name: "Kadiatou M.",
      avatar: "KM",
      avatarColor: "bg-amber-500/25 text-amber-200",
      role: t("landing.testimonial_4_role"),
      text: t("landing.testimonial_4_text"),
      metric: t("landing.testimonial_4_metric"),
      metricColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      accentGradient: "from-amber-500/20 via-amber-500/5 to-transparent",
      glowColor: "bg-amber-500/10",
      featured: true,
    },
  ];

  return (
    <section className="bg-zinc-950 py-14 md:py-20 relative overflow-hidden">

      {/* Background dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-violet-500/8 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-6 bg-primary/40" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            Témoignages
          </span>
          <span className="h-px w-6 bg-primary/40" />
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-xl text-center mb-10 md:mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50 md:text-4xl">
            {t("landing.testimonials_title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {t("landing.testimonials_subtitle")}
          </p>
        </div>

        {/* Bento grid — 3 cols desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">

          {/* Row 1: Card 0 (span-2, featured) + Card 1 (span-1) */}
          <TestimonialCard item={items[0]} span="md:col-span-2" />
          <TestimonialCard item={items[1]} span="md:col-span-1" />

          {/* Row 2: Card 2 (span-1) + Card 3 (span-2, featured) */}
          <TestimonialCard item={items[2]} span="md:col-span-1" />
          <TestimonialCard item={items[3]} span="md:col-span-2" />
        </div>
      </div>
    </section>
  );
}

/* ── Individual card ── */

function TestimonialCard({ item, span }: { item: Testimonial; span: string }) {
  const isFeatured = item.featured;

  return (
    <div
      className={`${span} relative flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden
        transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/50
        ${isFeatured ? "ring-1 ring-primary/20" : ""}`}
    >
      {/* Gradient accent overlay */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accentGradient}`} />

      {/* Top highlight line on featured */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      )}

      {/* Glow blob */}
      <div className={`pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full ${item.glowColor} blur-3xl`} />

      <div className={`relative flex flex-col flex-1 ${isFeatured ? "p-7 md:p-8" : "p-6"} gap-5`}>

        {/* Top row: metric + AI tag */}
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-bold tracking-wide ${item.metricColor}`}>
            <Sparkles className="h-2.5 w-2.5" />
            {item.metric}
          </span>
          {isFeatured && (
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-amber-400 text-[10px]">★</span>
              ))}
            </div>
          )}
        </div>

        {/* Quote */}
        <div className="flex-1 space-y-3">
          <Quote className={`${isFeatured ? "h-6 w-6" : "h-5 w-5"} text-zinc-700`} />
          <p className={`text-zinc-300 leading-relaxed ${isFeatured ? "text-[15px]" : "text-sm"}`}>
            "{item.text}"
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${item.avatarColor}`}>
            {item.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100 leading-none">{item.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{item.role}</p>
          </div>
          {!isFeatured && (
            <div className="ml-auto flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-amber-400 text-[9px]">★</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle2, Globe2, FileText,
  Bell, Zap, GraduationCap, Briefcase, Search, Sparkles,
} from "lucide-react";

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

          {/* ── Right: AI Dashboard ── */}
          <div className="order-2 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[390px]">

              {/* Glow behind panel */}
              <div className="absolute -inset-2 rounded-3xl bg-primary/15 blur-2xl" />

              {/* Main panel */}
              <div className="relative rounded-2xl border-2 border-primary/15 bg-secondary/40 dark:bg-card dark:border-border shadow-2xl overflow-hidden">

                {/* macOS bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">malayka.ai</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 dark:border-emerald-800 dark:bg-emerald-950/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Live</span>
                  </div>
                </div>

                <div className="p-4 space-y-3.5">

                  {/* Scan bar */}
                  <div className="rounded-xl bg-muted/50 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5 font-mono text-muted-foreground">
                        <Globe2 className="h-3 w-3 text-primary" />
                        1 247 sources analysées…
                      </span>
                      <span className="font-mono font-bold text-primary">73%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                        style={{ width: "73%", animation: "scan-grow 3s ease-in-out infinite alternate" }}
                      />
                    </div>
                    <div className="flex gap-1">
                      {["Abidjan", "Dakar", "Paris", "Douala"].map((c) => (
                        <span key={c} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Matches */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Résultats matchés
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">+5</span>
                    </div>
                    {[
                      { Icon: GraduationCap, label: "Bourse Master · Campus France", score: "96%", pill: "text-violet-600 bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-800" },
                      { Icon: Briefcase,     label: "Stage Développeur · Abidjan",   score: "91%", pill: "text-primary bg-primary/8 border-primary/25" },
                      { Icon: Search,        label: "Appel à projets · BDC CI",       score: "88%", pill: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800" },
                    ].map(({ Icon, label, score, pill }) => (
                      <div key={label} className="flex items-center gap-2.5 rounded-lg border bg-muted/20 px-2.5 py-1.5">
                        <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <p className="flex-1 truncate text-xs font-medium">{label}</p>
                        <span className={`shrink-0 rounded-full border px-1.5 py-px font-mono text-[10px] font-bold ${pill}`}>{score}</span>
                      </div>
                    ))}
                  </div>

                  {/* Doc generated */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-950/30">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <FileText className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Lettre de motivation générée</p>
                      <p className="text-[10px] text-emerald-600/70">PDF prêt · 8 secondes</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* WhatsApp floating */}
              <div className="absolute -bottom-4 -left-5 flex items-center gap-2 rounded-2xl border bg-background shadow-xl px-3 py-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                  <Bell className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold leading-none">WhatsApp · maintenant</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Bourse — 96% match 🎯</p>
                </div>
              </div>

              {/* Plan badge */}
              <div className="absolute -top-3 -right-4 flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 shadow-lg">
                <Zap className="h-3 w-3 text-amber-500" />
                <span className="font-mono text-[10px] font-bold">Plan · 8 étapes</span>
              </div>
            </div>
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

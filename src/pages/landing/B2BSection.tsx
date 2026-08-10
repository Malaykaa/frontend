import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  GraduationCap, Briefcase, CheckCircle2,
  Mail, ArrowRight, TrendingUp, Users, Clock, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ══════════════════════════════════════════════════════════════════════════
   TICKER — vertical slide: 2 lines visible, 0.5s overlap.
   New item enters from below, old item exits upward.
   ══════════════════════════════════════════════════════════════════════════ */

const SLOT_H  = 56;  // px — height of each item slot
const SLOT_G  = 6;   // px — gap between slots
const ANIM_MS = 520; // ms — slide duration

function useTicker(total: number, pauseMs = 3200) {
  const [offset, setOffset] = useState(0);
  const [sliding, setSliding] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const id = setInterval(() => {
      if (!alive.current) return;
      setSliding(true);
      setTimeout(() => {
        if (!alive.current) return;
        setOffset((o) => (o + 1) % total);
        setSliding(false);
      }, ANIM_MS);
    }, pauseMs + ANIM_MS);
    return () => { alive.current = false; clearInterval(id); };
  }, [total, pauseMs]);

  return { offset, sliding };
}

interface TickerProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  pause?: number;
}
function Ticker<T>({ items, renderItem, pause = 3200 }: TickerProps<T>) {
  const n = items.length;
  const { offset, sliding } = useTicker(n, pause);

  return (
    <div className="overflow-hidden" style={{ height: SLOT_H * 2 + SLOT_G }}>
      <div
        style={{
          transform: sliding ? `translateY(-${SLOT_H + SLOT_G}px)` : "translateY(0)",
          transition: sliding ? `transform ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1)` : "none",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: SLOT_H, marginBottom: i < 2 ? SLOT_G : 0 }}>
            {renderItem(items[(offset + i) % n])}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EDUCATION DASHBOARD
   ══════════════════════════════════════════════════════════════════════════ */

type ActItem = { text: string; type: "success" | "info" | "warning" };
const actStyle: Record<string, string> = {
  success: "text-emerald-700 bg-emerald-50 border-emerald-200",
  info:    "text-sky-700 bg-sky-50 border-sky-200",
  warning: "text-amber-700 bg-amber-50 border-amber-200",
};

function renderAct(item: ActItem) {
  return (
    <div className={`flex h-full items-center gap-2.5 rounded-2xl border px-3.5 text-[11px] leading-snug ${actStyle[item.type]}`}>
      <Activity className="h-3.5 w-3.5 shrink-0" />
      <span className="line-clamp-2">{item.text}</span>
    </div>
  );
}

function EduDashboard() {
  const { t } = useTranslation();
  const [scanPct, setScanPct] = useState(73);

  useEffect(() => {
    const id = setInterval(() => setScanPct((p) => (p >= 94 ? 52 : p + 1)), 220);
    return () => clearInterval(id);
  }, []);

  const actItems: ActItem[] = [
    { text: t("landing.b2b_act_1"), type: "success" },
    { text: t("landing.b2b_act_2"), type: "info"    },
    { text: t("landing.b2b_act_3"), type: "success" },
    { text: t("landing.b2b_act_4"), type: "warning" },
    { text: t("landing.b2b_act_5"), type: "success" },
  ];

  const learners = [
    { name: "Kofi A.",  steps: "5/6", pct: 87, color: "bg-emerald-500", delay: "0s"   },
    { name: "Fatou M.", steps: "3/5", pct: 62, color: "bg-sky-500",     delay: "0.2s" },
    { name: "Yves T.",  steps: "2/5", pct: 45, color: "bg-violet-500",  delay: "0.4s" },
    { name: "Aïcha D.", steps: "4/6", pct: 73, color: "bg-amber-500",   delay: "0.6s" },
  ];

  return (
    <div className="space-y-3">
      {/* Live scan */}
      <div className="rounded-2xl border border-sky-100 bg-white p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("landing.b2b_scan_label")} · {scanPct}%
          </span>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600">
            Live
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-sky-50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-200"
            style={{ width: `${scanPct}%` }}
          />
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-sky-100 bg-white p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Promo 2025</span>
          <span className="font-mono text-[10px] font-bold text-emerald-600">67% moy.</span>
        </div>
        {learners.map(({ name, steps, pct, color, delay }) => (
          <div key={name} className="space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[11px] font-semibold">{name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{steps}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-sky-50">
              <div
                className={`h-full rounded-full ${color} origin-left`}
                style={{ width: `${pct}%`, animation: `b2b-fill 1.8s ease-out ${delay} both` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Ticker activity feed */}
      <div className="rounded-2xl border border-sky-100 bg-white p-3 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-0.5">
          {t("landing.b2b_activity_live")}
        </p>
        <Ticker items={actItems} renderItem={renderAct} pause={3000} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EMPLOYMENT DASHBOARD
   ══════════════════════════════════════════════════════════════════════════ */

type MatchItem = { name: string; role: string; score: string; style: string };

function renderMatch(item: MatchItem) {
  return (
    <div className={`flex h-full items-center gap-3 rounded-2xl border px-4 ${item.style}`}>
      <span className="h-2 w-2 rounded-full bg-current animate-pulse shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold leading-none truncate">{item.name}</p>
        <p className="text-[10px] mt-0.5 opacity-70 truncate">{item.role}</p>
      </div>
      <span className="font-mono text-sm font-extrabold shrink-0">{item.score}</span>
    </div>
  );
}

function EmpDashboard() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState([24, 12, 7, 3]);

  useEffect(() => {
    const id = setInterval(() => setCounts((c) => c.map((v, i) => (i === 3 ? v + 1 : v))), 9000);
    return () => clearInterval(id);
  }, []);

  const matchItems: MatchItem[] = [
    { name: "Serge M.", role: t("landing.b2b_match_1_role"), score: "93%", style: "text-violet-700 bg-violet-50 border-violet-200" },
    { name: "Binta K.", role: t("landing.b2b_match_2_role"), score: "88%", style: "text-sky-700 bg-sky-50 border-sky-200"           },
    { name: "Ange P.",  role: t("landing.b2b_match_3_role"), score: "96%", style: "text-emerald-700 bg-emerald-50 border-emerald-200"},
    { name: "David O.", role: t("landing.b2b_match_4_role"), score: "85%", style: "text-amber-700 bg-amber-50 border-amber-200"     },
    { name: "Chloé N.", role: t("landing.b2b_match_5_role"), score: "91%", style: "text-rose-700 bg-rose-50 border-rose-200"       },
  ];

  const stageLabel = [
    t("landing.b2b_stage_1"),
    t("landing.b2b_stage_2"),
    t("landing.b2b_stage_3"),
    t("landing.b2b_stage_4"),
  ];
  const stageStyle = [
    "text-sky-700 bg-sky-50 border-sky-200",
    "text-violet-700 bg-violet-50 border-violet-200",
    "text-amber-700 bg-amber-50 border-amber-200",
    "text-emerald-700 bg-emerald-50 border-emerald-200",
  ];

  return (
    <div className="space-y-3">
      {/* Pipeline */}
      <div className="rounded-2xl border border-violet-100 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Pipeline · Jan 2025</span>
          <span className="font-mono text-[10px] font-semibold text-violet-600">{t("landing.b2b_pipeline_growth")}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {counts.map((count, i) => (
            <div key={stageLabel[i]} className={`rounded-xl border p-2.5 text-center ${stageStyle[i]}`}>
              <p className="font-mono text-2xl font-extrabold leading-none">{count}</p>
              <p className="mt-1 text-[8.5px] font-semibold leading-tight">{stageLabel[i]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Matching bar */}
      <div className="rounded-2xl border border-violet-100 bg-white p-3.5 shadow-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{t("landing.b2b_matching_score")}</span>
          <span className="font-mono text-xs font-extrabold text-violet-600">91%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-violet-50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400 origin-left"
            style={{ width: "91%", animation: "b2b-fill 2s ease-out 0.5s both" }}
          />
        </div>
      </div>

      {/* Ticker match feed */}
      <div className="rounded-2xl border border-violet-100 bg-white p-3 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-0.5">
          {t("landing.b2b_matches_live")}
        </p>
        <Ticker items={matchItems} renderItem={renderMatch} pause={3600} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION
   ══════════════════════════════════════════════════════════════════════════ */

export function B2BSection() {
  const { t } = useTranslation();

  const eduFeatures = [
    { title: t("landing.b2b_edu_f1"), desc: t("landing.b2b_edu_f1_desc") },
    { title: t("landing.b2b_edu_f2"), desc: t("landing.b2b_edu_f2_desc") },
    { title: t("landing.b2b_edu_f3"), desc: t("landing.b2b_edu_f3_desc") },
    { title: t("landing.b2b_edu_f4"), desc: t("landing.b2b_edu_f4_desc") },
  ];

  const empFeatures = [
    { title: t("landing.b2b_emp_f1"), desc: t("landing.b2b_emp_f1_desc") },
    { title: t("landing.b2b_emp_f2"), desc: t("landing.b2b_emp_f2_desc") },
    { title: t("landing.b2b_emp_f3"), desc: t("landing.b2b_emp_f3_desc") },
    { title: t("landing.b2b_emp_f4"), desc: t("landing.b2b_emp_f4_desc") },
  ];

  const stats = [
    { value: "48h",    label: t("landing.b2b_stat_deploy"),     Icon: Clock,      color: "text-sky-600"     },
    { value: "50+",    label: t("landing.b2b_stat_structures"), Icon: Users,      color: "text-violet-600"  },
    { value: "5 000+", label: t("landing.b2b_stat_profiles"),   Icon: TrendingUp, color: "text-emerald-600" },
  ];

  return (
    <section
      className="relative overflow-hidden py-16 md:py-28"
      style={{
        background:
          "linear-gradient(160deg, #eef2ff 0%, #ffffff 30%, #f5f3ff 65%, #fafaff 100%)",
      }}
    >
      <div className="pointer-events-none absolute -top-20 right-1/3 h-[450px] w-[450px] rounded-full bg-sky-300/15 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-300/15 blur-[80px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, #c7d2fe 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-6 bg-primary/40" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            {t("landing.b2b_label")}
          </span>
          <span className="h-px w-6 bg-primary/40" />
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-xl text-center mb-10 md:mb-14">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-4xl leading-tight">
            {t("landing.b2b_headline")}{" "}
            <span
              style={{
                background: "linear-gradient(90deg, hsl(var(--primary)), #8b5cf6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("landing.b2b_headline_accent")}
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {t("landing.b2b_subtitle")}
          </p>
        </div>

        {/* ── Row 1 : Education — text LEFT · dashboard RIGHT ── */}
        <div className="mb-4 rounded-2xl md:rounded-3xl border border-sky-100 bg-white/80 shadow-sm backdrop-blur-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Text */}
            <div className="p-5 md:p-10 space-y-5 md:space-y-6 border-b md:border-b-0 md:border-r border-sky-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 ring-1 ring-sky-200">
                  <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-sky-600" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-500">{t("landing.b2b_edu_tag")}</p>
                  <h3 className="text-base md:text-lg font-bold leading-tight">{t("landing.b2b_edu_title")}</h3>
                  <p className="text-xs text-muted-foreground">{t("landing.b2b_edu_types")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("landing.b2b_edu_desc")}
              </p>
              <ul className="space-y-3 md:space-y-3.5">
                {eduFeatures.map(({ title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100">
                      <CheckCircle2 className="h-3 w-3 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Dashboard */}
            <div className="p-5 md:p-10 bg-sky-50/40">
              <EduDashboard />
            </div>
          </div>
        </div>

        {/* ── Row 2 : Employment — dashboard LEFT · text RIGHT (inverted) ── */}
        <div className="mb-6 md:mb-8 rounded-2xl md:rounded-3xl border border-violet-100 bg-white/80 shadow-sm backdrop-blur-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Dashboard (left on md+, below on mobile) */}
            <div className="order-2 md:order-1 p-5 md:p-10 bg-violet-50/30 border-t md:border-t-0 md:border-r border-violet-100">
              <EmpDashboard />
            </div>
            {/* Text (right on md+, above on mobile) */}
            <div className="order-1 md:order-2 p-5 md:p-10 space-y-5 md:space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 ring-1 ring-violet-200">
                  <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">{t("landing.b2b_emp_tag")}</p>
                  <h3 className="text-base md:text-lg font-bold leading-tight">{t("landing.b2b_emp_title")}</h3>
                  <p className="text-xs text-muted-foreground">{t("landing.b2b_emp_types")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("landing.b2b_emp_desc")}
              </p>
              <ul className="space-y-3 md:space-y-3.5">
                {empFeatures.map(({ title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100">
                      <CheckCircle2 className="h-3 w-3 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats + CTA */}
        <div className="rounded-2xl md:rounded-3xl border border-primary/20 bg-white/80 shadow-sm backdrop-blur-sm p-5 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex flex-1 justify-around gap-4 w-full">
              {stats.map(({ value, label, Icon, color }) => (
                <div key={label} className="text-center">
                  <Icon className={`h-4 w-4 ${color} mx-auto mb-1.5`} />
                  <p className={`font-mono text-xl md:text-2xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="hidden md:block w-px h-14 bg-border" />
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Button
                size="lg"
                className="gap-2 font-bold shadow-md shadow-primary/20"
                onClick={() =>
                  (window.location.href =
                    "mailto:contact@malaya.co?subject=Partenariat%20structure%20Malayka")
                }
              >
                <Mail className="h-4 w-4" />
                {t("landing.b2b_cta_partner")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => (window.location.href = "/onboarding")}
              >
                {t("landing.b2b_cta_trial")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes b2b-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}

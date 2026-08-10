import { useTranslation } from "react-i18next";
import {
  Globe2, Sparkles, FileText, BrainCircuit,
  Bell, Users2, CheckCircle2, GraduationCap, Briefcase, Search,
} from "lucide-react";

/* ── Mini-visuals ─────────────────────────────────────────────────────────── */

function ScanVisual() {
  return (
    <div className="mt-3 space-y-2 rounded-xl bg-muted/40 p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">1 247 sources</span>
        <span className="font-mono text-[10px] font-bold text-primary">73%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
          style={{ width: "73%", animation: "f-scan 3s ease-in-out infinite alternate" }}
        />
      </div>
      <div className="flex gap-1 flex-wrap">
        {["Abidjan", "Dakar", "Paris", "Nairobi", "Douala"].map((c) => (
          <span key={c} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">{c}</span>
        ))}
      </div>
    </div>
  );
}

function ScoreVisual() {
  const maxPx = 36;
  const items = [
    { label: "Stage",  pct: 65, color: "bg-primary" },
    { label: "Bourse", pct: 96, color: "bg-violet-500" },
    { label: "Projet", pct: 81, color: "bg-emerald-500" },
    { label: "Emploi", pct: 74, color: "bg-amber-500" },
  ];
  return (
    <div className="mt-3 flex items-end gap-2">
      {items.map(({ label, pct, color }) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-0.5">
          <span className="font-mono text-[9px] font-bold text-muted-foreground">{pct}%</span>
          <div
            className={`w-full rounded-t-sm opacity-80 ${color}`}
            style={{ height: `${Math.round((pct / 100) * maxPx)}px` }}
          />
          <span className="truncate w-full text-center text-[8px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function PlanVisual() {
  return (
    <div className="mt-3 space-y-1.5">
      {[
        { n: "01", label: "Identifier les bourses ouvertes", done: true },
        { n: "02", label: "Préparer le dossier",             done: true },
        { n: "03", label: "Générer la lettre de motivation", done: false },
        { n: "04", label: "Soumettre la candidature",        done: false },
      ].map(({ n, label, done }) => (
        <div key={n} className="flex items-center gap-2">
          <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            style={{ height: '18px', width: '18px' }}>
            {done ? <CheckCircle2 className="h-2.5 w-2.5" /> : n}
          </span>
          <span className={`text-[11px] ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function DocVisual() {
  return (
    <div className="mt-3 rounded-xl border bg-muted/20 p-3 space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-3.5 w-3.5 text-emerald-600" />
        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Lettre générée · 8 sec</span>
        <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />
      </div>
      {[1, 0.85, 0.95, 0.7, 0.9, 0.55].map((w, i) => (
        <div key={i} className="h-1.5 rounded-full bg-muted" style={{ width: `${w * 100}%` }} />
      ))}
    </div>
  );
}

function WhatsAppVisual() {
  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="h-5 w-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
          <Bell className="h-2.5 w-2.5 text-white" />
        </div>
        <span className="font-mono text-[10px] font-bold text-foreground">Malayka · WhatsApp</span>
        <span className="ml-auto text-[9px] text-muted-foreground">maintenant</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">
        🎯 <strong>Bourse Master</strong> — Campus France
        · <span className="font-semibold text-violet-600">96% match</span>
        <br />
        Deadline : 15 mars · Postule →
      </p>
    </div>
  );
}

function ProfileVisual() {
  return (
    <div className="mt-3 space-y-1.5">
      {[
        { Icon: GraduationCap, label: "Étudiant(e)",          color: "bg-sky-100 text-sky-600 dark:bg-sky-950/40" },
        { Icon: Briefcase,     label: "Professionnel(le)",     color: "bg-violet-100 text-violet-600 dark:bg-violet-950/40" },
        { Icon: Search,        label: "Chercheur d'emploi",    color: "bg-amber-100 text-amber-600 dark:bg-amber-950/40" },
      ].map(({ Icon, label, color }) => (
        <div key={label} className="flex items-center gap-2.5 rounded-lg border bg-muted/20 px-2.5 py-1.5">
          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${color}`}>
            <Icon className="h-3 w-3" />
          </div>
          <span className="text-xs font-medium flex-1">{label}</span>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        </div>
      ))}
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-6 bg-primary/40" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">Fonctionnalités</span>
          <span className="h-px w-6 bg-primary/40" />
        </div>

        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t("landing.features_title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("landing.features_subtitle")}</p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Row 1: wide + small */}
          <div className="md:col-span-2 rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Globe2 className="h-4.5 w-4.5 text-primary" style={{ height: '1.125rem', width: '1.125rem' }} />
              </div>
              <div>
                <p className="font-bold text-sm">{t("landing.feature_1_title")}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("landing.feature_1_desc")}</p>
              </div>
            </div>
            <ScanVisual />
          </div>

          <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/40">
                <Sparkles className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-sm">{t("landing.feature_2_title")}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("landing.feature_2_desc")}</p>
              </div>
            </div>
            <ScoreVisual />
          </div>

          {/* Row 2: small + wide */}
          <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/40">
                <BrainCircuit className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <p className="font-bold text-sm">{t("landing.feature_4_title")}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("landing.feature_4_desc")}</p>
              </div>
            </div>
            <PlanVisual />
          </div>

          <div className="md:col-span-2 rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40">
                <FileText className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-sm">{t("landing.feature_3_title")}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("landing.feature_3_desc")}</p>
              </div>
            </div>
            <DocVisual />
          </div>

          {/* Row 3: small + wide */}
          <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950/40">
                <Bell className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-sm">{t("landing.feature_5_title")}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("landing.feature_5_desc")}</p>
              </div>
            </div>
            <WhatsAppVisual />
          </div>

          <div className="md:col-span-2 rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/40">
                <Users2 className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="font-bold text-sm">{t("landing.feature_6_title")}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("landing.feature_6_desc")}</p>
              </div>
            </div>
            <ProfileVisual />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes f-scan { from { width: 48%; } to { width: 86%; } }
      `}</style>
    </section>
  );
}

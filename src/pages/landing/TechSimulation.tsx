import { useState, useEffect, useRef } from "react";
import {
  Activity, Network, Globe2, Building2, FileText,
  Briefcase, GraduationCap, Banknote, Search, Shield,
  CheckCircle, Filter, Bell, Sparkles, Database,
  ArrowDownRight, ArrowDownLeft,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const MODELS = [
  { label: "Claude",    org: "Anthropic", c1: "#CF6920", c2: "#F59E0B", l: "A" },
  { label: "GPT-4o",   org: "OpenAI",    c1: "#0D9488", c2: "#10B981", l: "O" },
  { label: "Gemini",   org: "Google",    c1: "#4285F4", c2: "#A855F7", l: "G" },
  { label: "Llama",    org: "Meta",      c1: "#1D4ED8", c2: "#3B82F6", l: "L" },
  { label: "DeepSeek", org: "DeepSeek",  c1: "#7C3AED", c2: "#C026D3", l: "D" },
];

const AGENTS = [
  { id: "career", label: "Emploi",      Icon: Briefcase,     col: "#2563EB" },
  { id: "edu",    label: "Éducation",   Icon: GraduationCap, col: "#7C3AED" },
  { id: "fund",   label: "Financement", Icon: Banknote,      col: "#059669" },
  { id: "doc",    label: "Documents",   Icon: FileText,      col: "#D97706" },
  { id: "guard",  label: "Guardrails",  Icon: Shield,        col: "#DC2626" },
  { id: "search", label: "Recherche",   Icon: Search,        col: "#EA580C" },
];

const AGENT_SCENARIOS = [
  { msg: "Emploi data science à Abidjan",    agentId: "career", mIdx: 0, hasDoc: false, reply: "8 offres · score 87% · 3 nouvelles ce jour",           doc: null                   },
  { msg: "Dossier de subvention agri-tech",  agentId: "fund",   mIdx: 1, hasDoc: true,  reply: "Dossier subvention (14 pages) prêt au téléchargement",  doc: "Subvention_2026.pdf"  },
  { msg: "Bourses master IA au Canada",      agentId: "edu",    mIdx: 2, hasDoc: false, reply: "5 bourses correspondantes · deadline dans 23 j",         doc: null                   },
  { msg: "CV ATS optimisé Lead Developer",   agentId: "doc",    mIdx: 3, hasDoc: true,  reply: "CV généré · ATS score 94% · PDF & DOCX disponibles",    doc: "CV_LeadDev_ATS94.pdf" },
];

const SCRAP_SCENARIOS = [
  { msg: "Je cherche un emploi en data science à Abidjan", profile: "Data Scientist · 2 ans exp." },
  { msg: "Bourses d'études pour un master en IA",          profile: "Étudiante · Licence 3 info"  },
  { msg: "Stage développement web — Paris ou remote",      profile: "Dev Web · Junior · 6 mois"   },
];

// SVG paths from official brand assets (24×24 viewBox)
const SVG_LINKEDIN  = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const SVG_FACEBOOK  = "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const SVG_TELEGRAM  = "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z";
const SVG_REDDIT    = "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z";
const SVG_TWITTER_X = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const SVG_GLASSDOOR = "M12.001 0C5.373 0 0 5.371 0 12c0 6.628 5.373 12 12.001 12C18.63 24 24 18.628 24 12 24 5.371 18.63 0 12.001 0zM8.32 6.693H15.1a.63.63 0 0 1 .63.631v.86a.63.63 0 0 1-.63.631H8.32a.63.63 0 0 1-.63-.63v-.861a.63.63 0 0 1 .63-.631zm7.41 9.975H8.95a.63.63 0 0 1-.63-.631v-.86a.63.63 0 0 1 .63-.631H15.73a.63.63 0 0 1 .63.63v.862a.63.63 0 0 1-.63.63zm.63-3.836a.63.63 0 0 1-.63.63H8.32a.63.63 0 0 1-.63-.63v-.861a.63.63 0 0 1 .63-.63H15.73a.63.63 0 0 1 .63.63z";

type Source = { label: string; bg: string; svg?: string; init?: string };

const SOURCES: Source[] = [
  { label: "LinkedIn",   bg: "#0A66C2", svg: SVG_LINKEDIN  },
  { label: "Indeed",     bg: "#003A9B", init: "in"          },
  { label: "Facebook",   bg: "#1877F2", svg: SVG_FACEBOOK   },
  { label: "Telegram",   bg: "#229ED9", svg: SVG_TELEGRAM   },
  { label: "Reddit",     bg: "#FF4500", svg: SVG_REDDIT     },
  { label: "X / Twitter",bg: "#14171A", svg: SVG_TWITTER_X  },
  { label: "AfricaJobs", bg: "#D97706", init: "AJ"          },
  { label: "Emploi.ci",  bg: "#059669", init: "E.ci"        },
  { label: "Jobberman",  bg: "#1D4ED8", init: "JB"          },
  { label: "Glassdoor",  bg: "#0D9488", svg: SVG_GLASSDOOR  },
  { label: "ApplyBoard", bg: "#DC2626", init: "AB"          },
  { label: "BrighterM.", bg: "#92400E", init: "BM"          },
];

// Steps agents: 0 idle · 1 msg · 2 triage · 3 routing · 4 agent · 5 llm · 6 doc · 7 reply · 8 done
const AGENT_DELAYS = [400, 1000, 900, 700, 1400, 1800, 1300, 2100, 2600];

// Steps scraping: 0 idle · 1 msg · 2 scraping (counter) · 3 done · 4 matching · 5 found · 6 split · 7 notify · 8 pause
const SCRAP_DELAYS  = [400, 900, 2800, 600, 1400, 1000, 1200, 2000, 2800];

// Steps structures: 0-8
const STRUCT_DELAYS = [900, 1100, 900, 900, 900, 1200, 1300, 2000, 3000];

// ── Tiny shared helpers ───────────────────────────────────────────────────────

function Ticker({ color }: { color: string }) {
  return (
    <span className="flex gap-0.5 items-center shrink-0">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full animate-bounce"
          style={{ backgroundColor: color, animationDelay: `${i * 100}ms` }}
        />
      ))}
    </span>
  );
}

function MiniArrow({ color }: { color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 my-0.5">
      <div className="h-4 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${color})` }} />
      <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: `5px solid ${color}` }} />
    </div>
  );
}

function SourceLogo({ src }: { src: Source }) {
  if (src.svg) {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="white" aria-hidden="true">
        <path d={src.svg} />
      </svg>
    );
  }
  return (
    <span className="text-[9px] font-black text-white leading-none tracking-tight">
      {src.init}
    </span>
  );
}

function FadeIn({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(8px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
      {children}
    </div>
  );
}

// ── Section wrapper (light theme) ─────────────────────────────────────────────

function SectionWrap({ num, label, Icon, children, accent }: {
  num: string; label: string; Icon: React.ElementType;
  children: React.ReactNode; accent: string;
}) {
  return (
    <div className="border-t border-emerald-100 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Label row */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${accent}BB, ${accent})` }}
          >
            {num}
          </div>
          <Icon className="h-4 w-4 shrink-0" style={{ color: accent }} />
          <span className="text-sm font-black uppercase tracking-wider text-gray-800">{label}</span>
          <div className="flex items-center gap-1 ml-auto">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Live</span>
          </div>
        </div>
        {/* Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── 01 · Agent flow ───────────────────────────────────────────────────────────

function AgentsSection() {
  const [scIdx, setScIdx] = useState(0);
  const [step, setStep] = useState(0);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const sc    = AGENT_SCENARIOS[scIdx];
  const agent = AGENTS.find((a) => a.id === sc.agentId)!;
  const model = MODELS[sc.mIdx];
  const maxStep   = sc.hasDoc ? 8 : 7;
  const replyStep = sc.hasDoc ? 7 : 6;

  useEffect(() => {
    t.current = setTimeout(() => {
      setStep((s) => {
        if (s >= maxStep) { setScIdx((i) => (i + 1) % AGENT_SCENARIOS.length); return 0; }
        return s + 1;
      });
    }, AGENT_DELAYS[step] ?? 1500);
    return () => clearTimeout(t.current);
  }, [step, maxStep]);

  const v = (n: number) => step >= n;

  return (
    <SectionWrap num="01" label="Orchestration Multi-Agents" Icon={Network} accent="#7C3AED">
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">

          {/* ── Flow ── */}
          <div className="space-y-1.5">

            {/* User msg */}
            <FadeIn visible={v(1)}>
              <div className="flex justify-end items-end gap-2">
                <div className="rounded-xl rounded-br-sm bg-violet-600 px-3 py-1.5 text-xs text-white max-w-[200px] leading-snug shadow-sm">
                  {sc.msg}
                </div>
                <div className="h-6 w-6 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-[9px] font-black text-violet-700 shrink-0">
                  U
                </div>
              </div>
            </FadeIn>

            {v(2) && <MiniArrow color="#7C3AED" />}

            {/* Triage */}
            <FadeIn visible={v(2)}>
              <div
                className="rounded-xl border p-2.5 flex items-center gap-2 transition-all duration-400"
                style={{
                  borderColor: v(2) && !v(4) ? "#C4B5FD" : "#E5E7EB",
                  background:  v(2) && !v(4) ? "#F5F3FF" : "#F9FAFB",
                  boxShadow:   v(2) && !v(4) ? "0 0 0 3px #EDE9FE" : "none",
                }}
              >
                <Network className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                <span className="text-xs font-bold text-gray-800">Agent Triage</span>
                <span className="text-[10px] text-gray-400 ml-auto">
                  {step === 2 ? "analyse…" : step === 3 ? "routing →" : v(4) ? "✓ routé" : ""}
                </span>
                {(step === 2 || step === 3) && <Ticker color="#7C3AED" />}
                {v(4) && <CheckCircle className="h-3.5 w-3.5 text-violet-500 shrink-0" />}
              </div>
            </FadeIn>

            {v(4) && <MiniArrow color={agent.col} />}

            {/* Specialist agents */}
            <FadeIn visible={v(4)}>
              <div className="grid grid-cols-6 gap-1">
                {AGENTS.map((a) => {
                  const active = a.id === sc.agentId;
                  const Icon = a.Icon;
                  return (
                    <div
                      key={a.id}
                      className="rounded-lg border p-1.5 flex flex-col items-center gap-1 transition-all duration-400"
                      style={{
                        borderColor: active ? a.col + "60" : "#E5E7EB",
                        background:  active ? a.col + "12" : "#F9FAFB",
                        boxShadow:   active ? `0 0 0 2px ${a.col}30` : "none",
                        transform:   active ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: active ? a.col : "#9CA3AF" }} />
                      <span className="text-[8px] font-bold text-center leading-tight" style={{ color: active ? a.col : "#9CA3AF" }}>
                        {a.label}
                      </span>
                      {active && v(5) && <Ticker color={a.col} />}
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            {/* LLM strip */}
            <FadeIn visible={v(5)}>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">Modèle IA</p>
                <div className="flex gap-1 flex-wrap">
                  {MODELS.map((m, i) => {
                    const active = i === sc.mIdx && v(5);
                    return (
                      <div
                        key={m.label}
                        className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition-all duration-400"
                        style={{
                          background: active ? `linear-gradient(135deg,${m.c1},${m.c2})` : "#F3F4F6",
                          color:      active ? "#fff" : "#9CA3AF",
                          boxShadow:  active ? `0 2px 8px ${m.c1}50` : "none",
                          transform:  active ? "scale(1.06)" : "scale(1)",
                        }}
                      >
                        {active && (
                          <span className="h-3.5 w-3.5 rounded-full bg-white/25 flex items-center justify-center text-[7px] font-black">
                            {m.l}
                          </span>
                        )}
                        {m.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            {/* Doc agent */}
            {sc.hasDoc && (
              <FadeIn visible={v(6)}>
                <div
                  className="rounded-xl border p-2.5 flex items-center gap-2 transition-all duration-400"
                  style={{
                    borderColor: v(6) && !v(7) ? "#FCD34D" : "#E5E7EB",
                    background:  v(6) && !v(7) ? "#FFFBEB" : "#F9FAFB",
                    boxShadow:   v(6) && !v(7) ? "0 0 0 3px #FEF3C7" : "none",
                  }}
                >
                  <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Agent Documents</span>
                  <span className="text-[10px] text-amber-600 ml-auto truncate max-w-[100px]">
                    {step === 6 ? "génération…" : sc.doc ?? ""}
                  </span>
                  {step === 6 && <Ticker color="#D97706" />}
                  {v(7) && <CheckCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                </div>
              </FadeIn>
            )}

            {v(replyStep) && <MiniArrow color="#059669" />}

            {/* Response */}
            <FadeIn visible={v(replyStep)}>
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                </div>
                <div className="rounded-xl rounded-bl-sm border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-gray-800 leading-snug shadow-sm">
                  {sc.reply}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Side status ── */}
          <div className="space-y-3">
            {/* Pipeline */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-2">
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-2.5">Pipeline temps réel</p>
              {[
                { lbl: "Requête reçue",           n: 1 },
                { lbl: "Triage Agent analyse",    n: 2 },
                { lbl: "Routing intelligent",     n: 3 },
                { lbl: "Agent spécialisé activé", n: 4 },
                { lbl: "Modèle LLM sélectionné",  n: 5 },
                ...(sc.hasDoc ? [{ lbl: "Génération document", n: 6 }] : []),
                { lbl: "Réponse livrée",          n: replyStep },
              ].map(({ lbl, n }) => (
                <div key={lbl} className="flex items-center gap-2">
                  <div
                    className="h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      borderColor: v(n) ? "#059669" : "#D1D5DB",
                      background:  v(n) ? "#D1FAE5" : "#F9FAFB",
                    }}
                  >
                    {v(n) && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="text-[11px] transition-colors duration-300" style={{ color: v(n) ? "#1F2937" : "#9CA3AF" }}>
                    {lbl}
                  </span>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { lbl: "Latence",    val: v(replyStep) ? "1.2 s"  : "—", col: "#059669" },
                { lbl: "Guardrails", val: v(4) ? "✓ OK"           : "—", col: "#2563EB" },
                { lbl: "Qualité",    val: v(replyStep) ? "98/100" : "—", col: "#7C3AED" },
                { lbl: "Tokens",     val: v(replyStep) ? "2 847"  : "—", col: "#D97706" },
              ].map(({ lbl, val, col }) => (
                <div key={lbl} className="rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                  <p className="text-[9px] text-gray-400">{lbl}</p>
                  <p className="text-xs font-mono font-black mt-0.5" style={{ color: col }}>{val}</p>
                </div>
              ))}
            </div>

            {/* Current agent + model */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex items-center gap-3">
              <agent.Icon className="h-5 w-5 shrink-0" style={{ color: agent.col }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800">{agent.label}</p>
                <div
                  className="mt-0.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: model.c1 + "20", color: model.c1, border: `1px solid ${model.c1}30` }}
                >
                  {model.label} · {model.org}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ── 02 · Scraping ─────────────────────────────────────────────────────────────

function ScrapingSection() {
  const [scIdx, setScIdx]         = useState(0);
  const [step, setStep]           = useState(0);
  const [activeSource, setActiveSrc] = useState(0);
  const [scrapedCount, setScraped]   = useState(0);
  const [matchPct, setMatchPct]      = useState(0);
  const t    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const srcT = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const cntT = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const mchT = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const sc = SCRAP_SCENARIOS[scIdx];

  // Step timer
  useEffect(() => {
    t.current = setTimeout(() => {
      setStep((s) => {
        const next = s + 1;
        if (next > 8) {
          setScIdx((i) => (i + 1) % SCRAP_SCENARIOS.length);
          setScraped(0);
          setMatchPct(0);
          return 0;
        }
        return next;
      });
    }, SCRAP_DELAYS[step] ?? 2000);
    return () => clearTimeout(t.current);
  }, [step]);

  // Source rotation during step 2-3
  useEffect(() => {
    if (step === 2 || step === 3) {
      srcT.current = setInterval(() => setActiveSrc((i) => (i + 1) % SOURCES.length), 200);
    } else {
      clearInterval(srcT.current);
    }
    return () => clearInterval(srcT.current);
  }, [step]);

  // Scraped counter during step 2
  useEffect(() => {
    if (step !== 2) return;
    const target = 47_234;
    let n = 0;
    cntT.current = setInterval(() => {
      n = Math.min(n + Math.floor(Math.random() * 600 + 200), target);
      setScraped(n);
      if (n >= target) clearInterval(cntT.current);
    }, 60);
    return () => clearInterval(cntT.current);
  }, [step]);

  // Match progress during step 4
  useEffect(() => {
    if (step !== 4) return;
    let pct = 0;
    mchT.current = setInterval(() => {
      pct = Math.min(pct + Math.floor(Math.random() * 8 + 3), 91);
      setMatchPct(pct);
      if (pct >= 91) clearInterval(mchT.current);
    }, 60);
    return () => clearInterval(mchT.current);
  }, [step]);

  const v = (n: number) => step >= n;
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  return (
    <SectionWrap num="02" label="Scraping & Matching en temps réel" Icon={Globe2} accent="#2563EB">
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">

          {/* ── Main flow ── */}
          <div className="space-y-2">

            {/* User request */}
            <FadeIn visible={v(1)}>
              <div className="flex justify-end items-end gap-2">
                <div className="rounded-xl rounded-br-sm bg-blue-600 px-3 py-1.5 text-xs text-white leading-snug shadow-sm max-w-[220px]">
                  {sc.msg}
                </div>
                <div className="h-6 w-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[9px] font-black text-blue-700 shrink-0">
                  U
                </div>
              </div>
            </FadeIn>

            {v(2) && <MiniArrow color="#2563EB" />}

            {/* Scraping box */}
            <FadeIn visible={v(2)}>
              <div
                className="rounded-xl border p-3 transition-all duration-400"
                style={{
                  borderColor: v(2) && !v(4) ? "#93C5FD" : "#E5E7EB",
                  background:  v(2) && !v(4) ? "#EFF6FF" : "#F9FAFB",
                  boxShadow:   v(2) && !v(4) ? "0 0 0 3px #DBEAFE" : "none",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Globe2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Scraping en boucle</span>
                  <span className="text-[9px] text-blue-500 ml-auto font-mono">
                    {v(3) ? `${fmt(47_234)} offres` : scrapedCount > 0 ? fmt(scrapedCount) + "…" : "démarrage…"}
                  </span>
                  {v(2) && !v(4) && <Ticker color="#2563EB" />}
                  {v(4) && <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                </div>
                {/* Sources grid */}
                <div className="grid grid-cols-6 gap-1">
                  {SOURCES.map((src, i) => {
                    const active = i === activeSource && (step === 2 || step === 3);
                    return (
                      <div
                        key={src.label}
                        className="rounded-lg border p-1 flex flex-col items-center gap-0.5 text-center transition-all duration-150"
                        style={{
                          borderColor: active ? src.bg + "AA" : "#E5E7EB",
                          background:  active ? src.bg + "18" : "#F9FAFB",
                          boxShadow:   active ? `0 0 8px ${src.bg}40` : "none",
                          transform:   active ? "scale(1.1)" : "scale(1)",
                        }}
                      >
                        <div
                          className="h-6 w-6 rounded-md flex items-center justify-center mx-auto shrink-0 transition-all duration-150"
                          style={{ background: active ? src.bg : "#F3F4F6" }}
                        >
                          {active ? (
                            <SourceLogo src={src} />
                          ) : src.svg ? (
                            <svg viewBox="0 0 24 24" className="h-3 w-3" style={{ fill: src.bg }} aria-hidden="true">
                              <path d={src.svg} />
                            </svg>
                          ) : (
                            <span className="text-[7px] font-black leading-none" style={{ color: src.bg }}>
                              {src.init}
                            </span>
                          )}
                        </div>
                        <span className="text-[7px] font-bold leading-tight" style={{ color: active ? "#1F2937" : "#9CA3AF" }}>
                          {src.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            {v(4) && <MiniArrow color="#7C3AED" />}

            {/* Matching IA */}
            <FadeIn visible={v(4)}>
              <div
                className="rounded-xl border p-3 transition-all duration-400"
                style={{
                  borderColor: v(4) && !v(6) ? "#C4B5FD" : "#E5E7EB",
                  background:  v(4) && !v(6) ? "#F5F3FF" : "#F9FAFB",
                  boxShadow:   v(4) && !v(6) ? "0 0 0 3px #EDE9FE" : "none",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Matching IA</span>
                  <span className="text-[9px] text-violet-500 font-mono ml-auto">{matchPct}% match</span>
                  {v(4) && !v(6) && <Ticker color="#7C3AED" />}
                  {v(6) && <CheckCircle className="h-3.5 w-3.5 text-violet-500 shrink-0" />}
                </div>
                {/* Profile tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] text-gray-500">Profil détecté :</span>
                  <span className="rounded-full bg-violet-100 border border-violet-200 px-2 py-0.5 text-[9px] font-bold text-violet-700">
                    {sc.profile}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${matchPct}%`,
                      background: "linear-gradient(to right, #7C3AED, #2563EB)",
                    }}
                  />
                </div>
              </div>
            </FadeIn>

            {/* Fork: deliver + store */}
            <FadeIn visible={v(6)}>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {/* Best offer → User */}
                <div
                  className="rounded-xl border p-2.5 transition-all duration-400"
                  style={{
                    borderColor: "#6EE7B7",
                    background: "#ECFDF5",
                    boxShadow: "0 0 0 2px #D1FAE5",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-black text-emerald-700">Offre parfaite</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                      <Sparkles className="h-2.5 w-2.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-800 leading-tight">Notifiée à l'utilisateur</p>
                      <p className="text-[8px] text-emerald-600 font-mono">score 91%</p>
                    </div>
                  </div>
                </div>

                {/* Others → DB */}
                <div
                  className="rounded-xl border p-2.5 transition-all duration-400"
                  style={{
                    borderColor: "#BAE6FD",
                    background: "#F0F9FF",
                    boxShadow: "0 0 0 2px #E0F2FE",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ArrowDownLeft className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-black text-blue-700">Autres offres</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
                      <Database className="h-2.5 w-2.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-800 leading-tight">Stockées en base</p>
                      <p className="text-[8px] text-blue-500 font-mono">47 233 offres</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Notification */}
            <FadeIn visible={v(7)}>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 flex items-start gap-2 shadow-sm">
                <Bell className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Offre envoyée dans ton chat !</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                    L'offre la plus adaptée a été transmise directement à l'utilisateur selon son profil.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Stats panel ── */}
          <div className="space-y-3">
            <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Métriques live</p>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { lbl: "Offres scrapées",   val: v(3) ? "47 234" : v(2) ? fmt(scrapedCount) : "—", col: "#2563EB" },
                { lbl: "Filtrées par IA",   val: v(4) ? "3 847"  : "—",    col: "#7C3AED" },
                { lbl: "Score de matching", val: v(5) ? `${matchPct}%` : "—", col: "#059669" },
                { lbl: "Offres en base",    val: v(6) ? "47 233" : "—",    col: "#D97706" },
              ].map(({ lbl, val, col }) => (
                <div key={lbl} className="rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                  <p className="text-[9px] text-gray-400">{lbl}</p>
                  <p className="text-sm font-black mt-0.5 tabular-nums" style={{ color: col }}>{val}</p>
                </div>
              ))}
            </div>

            {/* Pipeline steps */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-2">
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-2">Pipeline</p>
              {[
                { lbl: "Requête utilisateur",   n: 1 },
                { lbl: "Scraping 12 sources",   n: 2 },
                { lbl: "47 234 offres trouvées",n: 3 },
                { lbl: "Matching IA profil",    n: 4 },
                { lbl: "Offre parfaite trouvée",n: 5 },
                { lbl: "Envoyée à l'utilisateur",n: 6 },
                { lbl: "Reste stocké en base",  n: 6 },
              ].map(({ lbl, n }) => (
                <div key={lbl} className="flex items-center gap-2">
                  <div
                    className="h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{ borderColor: v(n) ? "#059669" : "#D1D5DB", background: v(n) ? "#D1FAE5" : "#F9FAFB" }}
                  >
                    {v(n) && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="text-[11px] transition-colors" style={{ color: v(n) ? "#1F2937" : "#9CA3AF" }}>
                    {lbl}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { lbl: "Sources",            val: `${SOURCES.length} plateformes`, col: "#2563EB" },
                { lbl: "Cycle de scraping",  val: "toutes les 4h",  col: "#059669" },
                { lbl: "Matching",           val: "91% précision",  col: "#7C3AED" },
                { lbl: "Pays couverts",      val: "47+ pays",       col: "#D97706" },
              ].map(({ lbl, val, col }) => (
                <div key={lbl} className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
                  <p className="text-xs font-black" style={{ color: col }}>{val}</p>
                  <p className="text-[8px] text-gray-400 mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ── 03 · Structures ───────────────────────────────────────────────────────────

const STUDENTS = [
  { n: "Moussa K.",    i: "M", prog: 72 },
  { n: "Aicha D.",     i: "A", prog: 88 },
  { n: "Jean-Paul T.", i: "J", prog: 54 },
  { n: "Fatoumata B.", i: "F", prog: 91 },
  { n: "Ibrahim C.",   i: "I", prog: 67 },
  { n: "Sarah M.",     i: "S", prog: 83 },
];

function StructuresSection() {
  const [step, setStep] = useState(0);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    t.current = setTimeout(() => setStep((s) => (s >= 8 ? 0 : s + 1)), STRUCT_DELAYS[step] ?? 2000);
    return () => clearTimeout(t.current);
  }, [step]);

  const v = (n: number) => step >= n;

  return (
    <SectionWrap num="03" label="Structures & Institutions" Icon={Building2} accent="#059669">
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">

          {/* ── Org tree ── */}
          <div className="space-y-2">
            <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-3">
              Mécanisme pas-à-pas
            </p>

            <MiniOrgNodeLight emoji="🏛️" title="Université de Cocody · Abidjan" badge="admin"     color="#2563EB" active={step <= 1} visible />

            <div className="pl-4 border-l-2 border-blue-100 ml-3 space-y-1.5">
              <MiniOrgNodeLight emoji="👤" title="Prof. Koffi A. — Conseiller emploi" badge="conseiller" color="#7C3AED" active={step === 1} visible={v(1)} />
              <MiniOrgNodeLight emoji="👤" title="Dr. Aminata S. — Coordinatrice"     badge="conseiller" color="#7C3AED" active={step === 2} visible={v(2)} />

              {v(3) && (
                <div className="pl-3 border-l-2 border-violet-100 ml-3 pt-1.5 space-y-1.5">
                  <p className="text-[8px] text-gray-400 font-mono uppercase mb-1.5">
                    Apprenants — via code d'invitation
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {STUDENTS.map((st, idx) => {
                      const shown = v(3 + Math.min(idx, 3));
                      return (
                        <div
                          key={st.n}
                          className="rounded-lg border p-1.5 text-center transition-all duration-400"
                          style={{
                            borderColor: shown ? "#6EE7B7" : "#E5E7EB",
                            background:  shown ? "#ECFDF5" : "#F9FAFB",
                          }}
                        >
                          <div className="h-5 w-5 rounded-full bg-emerald-100 border border-emerald-200 mx-auto mb-0.5 flex items-center justify-center text-[8px] font-black text-emerald-700">
                            {st.i}
                          </div>
                          <p className="text-[8px] text-gray-500 leading-tight">{st.n}</p>
                          {v(7) && (
                            <div className="mt-1 h-0.5 w-full rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                                style={{ width: `${st.prog}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* AI layer */}
            {v(6) && (
              <div
                className="rounded-xl border border-violet-200 bg-violet-50 p-3 shadow-sm"
                style={{ boxShadow: "0 0 0 3px #EDE9FE" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                  <p className="text-xs font-bold text-gray-800">IA personnalisée par apprenant</p>
                </div>
                {v(7) && (
                  <div className="space-y-1">
                    {[
                      "Moussa → 3 offres stage data science",
                      "Aicha   → 2 bourses master IA Canada",
                      "Ibrahim → 1 appel d'offres développeur",
                    ].map((line) => (
                      <div key={line} className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-violet-400 shrink-0" />
                        <span className="text-[10px] text-gray-600">{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Dashboard ── */}
          <div className="space-y-3">
            <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">
              Tableau de bord conseiller
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { lbl: "Apprenants",  val: "6",   e: "👥", col: "#2563EB" },
                { lbl: "Offres matchées", val: "24", e: "🎯", col: "#059669" },
                { lbl: "Engagement",  val: "79%", e: "📈", col: "#7C3AED" },
                { lbl: "Alertes",     val: "3",   e: "🔔", col: "#D97706" },
              ].map(({ lbl, val, e, col }) => (
                <div key={lbl} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-base">{e}</span>
                    <span className="text-base font-black" style={{ color: col }}>{v(6) ? val : "—"}</span>
                  </div>
                  <p className="text-[9px] text-gray-400">{lbl}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-1.5">
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-2">Actions disponibles</p>
              {[
                { e: "🔗", lbl: "Inviter un apprenant",      n: 1 },
                { e: "📚", lbl: "Créer groupe / parcours",    n: 3 },
                { e: "🎯", lbl: "Assigner objectifs IA",      n: 5 },
                { e: "📊", lbl: "Voir progression en direct", n: 7 },
                { e: "📤", lbl: "Exporter rapport CSV",       n: 8 },
              ].map(({ e, lbl, n }) => (
                <div key={lbl} className="flex items-center gap-2">
                  <div
                    className="h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: v(n) ? "#059669" : "#D1D5DB", background: v(n) ? "#D1FAE5" : "#F9FAFB" }}
                  >
                    {v(n) && <div className="h-1 w-1 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="text-[11px] transition-colors" style={{ color: v(n) ? "#1F2937" : "#9CA3AF" }}>
                    {e} {lbl}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2 transition-all duration-500"
              style={{ opacity: v(8) ? 1 : 0, transform: v(8) ? "none" : "translateY(4px)" }}
            >
              <Bell className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="text-xs font-bold text-gray-800">Nouvelle opportunité !</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                  Stage Data Analyst · Orange CI · 3 apprenants éligibles notifiés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

function MiniOrgNodeLight({ emoji, title, badge, color, active, visible }: {
  emoji: string; title: string; badge: string;
  color: string; active: boolean; visible: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-2.5 flex items-center gap-2 transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        borderColor: active ? color + "50" : "#E5E7EB",
        background:  active ? color + "0E" : "#F9FAFB",
        boxShadow:   active ? `0 0 0 3px ${color}18` : "none",
      }}
    >
      <span className="text-base shrink-0">{emoji}</span>
      <span className="text-xs font-bold text-gray-800 flex-1 min-w-0 truncate">{title}</span>
      <span
        className="rounded-md px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase shrink-0"
        style={{ background: color + "18", color }}
      >
        {badge}
      </span>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function TechSimulation() {
  return (
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #f0fdf4, #ffffff, #f0fdf4)" }}>
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(5,150,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <div className="pt-16 pb-4 text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 mb-5">
          <Activity className="h-3 w-3 text-emerald-600 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest">
            Live — Architecture IA
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 leading-tight">
          Comment Malayka{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #7C3AED, #2563EB, #059669)" }}
          >
            pense et agit
          </span>
        </h2>
        <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
          3 simulations en temps réel — agents IA, scraping mondial avec redistribution, gestion des structures.
        </p>
      </div>

      <AgentsSection />
      <ScrapingSection />
      <StructuresSection />

      {/* LLM strip */}
      <div className="border-t border-emerald-100 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest text-center mb-4">
            Compatible avec tous les grands modèles LLM
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {MODELS.map((m) => (
              <div key={m.label} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-gray-200 bg-white shadow-sm">
                <div
                  className="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${m.c1}, ${m.c2})` }}
                >
                  {m.l}
                </div>
                <span className="text-[11px] font-semibold text-gray-600">{m.label}</span>
                <span className="text-[9px] text-gray-400">{m.org}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

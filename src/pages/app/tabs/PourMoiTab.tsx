import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus, Sparkles, RefreshCw, ChevronDown, ChevronRight,
  Briefcase, GraduationCap, Banknote, Trophy, FileText,
  Laptop, BookOpen, Compass, Target, MessageCircle, ArrowLeft,
} from "lucide-react";
import { RecommendationFeed } from "@/components/recommendations/RecommendationFeed";
import { BrowseOffersFeed } from "@/components/recommendations/BrowseOffersFeed";
import { Button } from "@/components/ui/button";
import { NewObjectiveSheet } from "@/components/app/NewObjectiveSheet";
import { useChatThreads, isActionThread } from "@/hooks/queries/use-chat-threads";
import { cn, formatRelativeTime } from "@/shared/lib/utils";
import type { ChatThread } from "@/shared/types";

// ── Méta des topics objectifs ─────────────────────────────────────────────
// Miroir de NewObjectiveSheet.TOPICS — source de vérité pour icônes/couleurs

interface TopicMeta {
  labelKey: string;
  Icon: React.ElementType;
  color: string;
  bg: string;
  text: string;
}

const TOPIC_META: Record<string, TopicMeta> = {
  stage_emploi:           { labelKey: "goals.topic_stage",       Icon: Briefcase,     color: "bg-blue-100 text-blue-600",      bg: "bg-blue-100",    text: "text-blue-600"     },
  bourse_etudes:          { labelKey: "goals.topic_bourse",      Icon: GraduationCap, color: "bg-violet-100 text-violet-600",  bg: "bg-violet-100",  text: "text-violet-600"   },
  subvention_financement: { labelKey: "goals.topic_financement", Icon: Banknote,      color: "bg-emerald-100 text-emerald-600",bg: "bg-emerald-100", text: "text-emerald-600"  },
  prepa_exam:             { labelKey: "goals.topic_exam",        Icon: Trophy,        color: "bg-amber-100 text-amber-600",    bg: "bg-amber-100",   text: "text-amber-600"    },
  appel_offres:           { labelKey: "goals.topic_appel_offres",Icon: FileText,      color: "bg-orange-100 text-orange-600",  bg: "bg-orange-100",  text: "text-orange-600"   },
  missions_freelance:     { labelKey: "goals.topic_freelance",   Icon: Laptop,        color: "bg-pink-100 text-pink-600",      bg: "bg-pink-100",    text: "text-pink-600"     },
  appels_projet:          { labelKey: "goals.topic_appels_projet",Icon: BookOpen,     color: "bg-sky-100 text-sky-600",        bg: "bg-sky-100",     text: "text-sky-600"      },
  orientation_carriere:   { labelKey: "goals.topic_orientation", Icon: Compass,       color: "bg-rose-100 text-rose-600",      bg: "bg-rose-100",    text: "text-rose-600"     },
  career:       { labelKey: "goals.legacy_career",      Icon: Briefcase,     color: "bg-blue-100 text-blue-600",      bg: "bg-blue-100",    text: "text-blue-600"     },
  scholarship:  { labelKey: "goals.legacy_scholarship", Icon: GraduationCap, color: "bg-violet-100 text-violet-600",  bg: "bg-violet-100",  text: "text-violet-600"   },
  funding:      { labelKey: "goals.legacy_funding",     Icon: Banknote,      color: "bg-emerald-100 text-emerald-600",bg: "bg-emerald-100", text: "text-emerald-600"  },
  exam:         { labelKey: "goals.legacy_exam",        Icon: Trophy,        color: "bg-amber-100 text-amber-600",    bg: "bg-amber-100",   text: "text-amber-600"    },
  tender:       { labelKey: "goals.legacy_tender",      Icon: FileText,      color: "bg-orange-100 text-orange-600",  bg: "bg-orange-100",  text: "text-orange-600"   },
  freelance:    { labelKey: "goals.legacy_freelance",   Icon: Laptop,        color: "bg-pink-100 text-pink-600",      bg: "bg-pink-100",    text: "text-pink-600"     },
  study_grant:  { labelKey: "goals.legacy_study_grant", Icon: BookOpen,     color: "bg-sky-100 text-sky-600",        bg: "bg-sky-100",     text: "text-sky-600"      },
  professional: { labelKey: "goals.legacy_professional",Icon: Compass,      color: "bg-rose-100 text-rose-600",      bg: "bg-rose-100",    text: "text-rose-600"     },
  _other:       { labelKey: "goals.legacy_other",       Icon: Sparkles,     color: "bg-muted text-muted-foreground", bg: "bg-muted",       text: "text-muted-foreground" },
};

// Ordre d'affichage — nouveaux keys en premier, legacy ensuite
const TOPIC_ORDER = [
  "stage_emploi", "bourse_etudes", "subvention_financement", "prepa_exam",
  "appel_offres", "missions_freelance", "appels_projet", "orientation_carriere",
  "career", "scholarship", "exam", "funding",
  "tender", "freelance", "study_grant", "professional", "_other",
];

// ── Groupement des threads par topic ──────────────────────────────────────
function groupByTopic(threads: ChatThread[]): Map<string, ChatThread[]> {
  const map = new Map<string, ChatThread[]>();
  for (const t of threads) {
    const key = t.preset_key && TOPIC_META[t.preset_key] ? t.preset_key : "_other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  // Trier chaque groupe par date décroissante
  for (const [, list] of map) {
    list.sort((a, b) => {
      const ta = a.updated_at ?? a.created_at;
      const tb = b.updated_at ?? b.created_at;
      return tb.localeCompare(ta);
    });
  }
  return map;
}

// ── Squelette ─────────────────────────────────────────────────────────────
function TopicSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-2/5 rounded bg-muted" />
          <div className="h-2.5 w-1/5 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

// ── Sous-item d'objectif ───────────────────────────────────────────────────
function ObjectiveItem({
  thread,
  onClick,
}: {
  thread: ChatThread;
  onClick: () => void;
}) {
  return (
    <button
      className="flex w-full items-center gap-2 pl-10 pr-3 py-2 text-left hover:bg-muted/30 transition-colors border-t first:border-t-0"
      onClick={onClick}
    >
      <MessageCircle className="h-3 w-3 shrink-0 text-muted-foreground/60" />
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-medium leading-snug">{thread.title}</p>
        {thread.updated_at && (
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            {formatRelativeTime(thread.updated_at)}
          </p>
        )}
      </div>
      {thread.message_count > 0 && (
        <span className="shrink-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
          {thread.message_count > 99 ? "99+" : thread.message_count}
        </span>
      )}
      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
    </button>
  );
}

// ── Carte topic dépliable ─────────────────────────────────────────────────
function TopicCard({
  topicKey,
  threads,
  navigate,
  defaultOpen,
}: {
  topicKey: string;
  threads: ChatThread[];
  navigate: (path: string, opts?: { state?: unknown }) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { t } = useTranslation();
  const meta = TOPIC_META[topicKey] ?? TOPIC_META._other;
  const { Icon, labelKey, bg, text } = meta;
  const label = t(labelKey);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* En-tête du topic */}
      <button
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", bg)}>
          <Icon className={cn("h-4 w-4", text)} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight truncate">{label}</p>
          <p className={cn("text-[10px] mt-0.5", text)}>
            {t(threads.length !== 1 ? "goals.objectives_count_other" : "goals.objectives_count_one", { count: threads.length })}
          </p>
        </div>

        <div className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full transition-colors shrink-0",
          open ? bg : "bg-muted"
        )}>
          {open
            ? <ChevronDown className={cn("h-3 w-3", text)} />
            : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {/* Liste des objectifs (dépliable) */}
      {open && (
        <div className="border-t">
          {threads.map((t) => (
            <ObjectiveItem
              key={t.id}
              thread={t}
              onClick={() => navigate(`/app/chat/${t.id}`, { state: { title: t.title } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-7 w-7 text-primary" />
      </div>
      <div>
        <p className="font-semibold">{t("app.no_goals")}</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {t("app.no_goals_long")}
        </p>
      </div>
      <Button onClick={onNew} className="gap-2">
        <Plus className="h-4 w-4" />
        {t("app.create_first")}
      </Button>
    </div>
  );
}

// ── Onglet principal ───────────────────────────────────────────────────────
export default function PourMoiTab() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: allThreads, isLoading, isError, refetch } = useChatThreads();

  // Filtres depuis les query params (liens depuis Tendances)
  const filterOfferTypes = searchParams.get("offer_types") ?? undefined;
  const filterSkill      = searchParams.get("skill") ?? undefined;
  const filterCountry    = searchParams.get("country") ?? undefined;
  const filterMaxAge     = Number(searchParams.get("max_age") ?? 60) || 60;
  const hasFilter        = !!(filterOfferTypes || filterSkill || filterCountry);

  // Ne garder que les objectifs (exclure les livrables)
  const objectiveThreads = (allThreads ?? []).filter((t) => !isActionThread(t));

  // Grouper par topic parent
  const grouped = groupByTopic(objectiveThreads);

  // Ordre d'affichage : uniquement les topics qui ont au moins 1 thread
  const visibleTopics = TOPIC_ORDER.filter((key) => (grouped.get(key)?.length ?? 0) > 0);
  const hasObjectives = visibleTopics.length > 0;

  // ── Vue filtrée (depuis Tendances) ────────────────────────────────────────
  if (hasFilter) {
    return (
      <div className="flex flex-col px-4 py-5 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchParams({})}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">
            {filterSkill
              ? `Offres · ${filterSkill}`
              : filterCountry
              ? `Offres · ${filterCountry}`
              : "Offres pour toi"}
          </h1>
        </div>
        <BrowseOffersFeed
          params={{
            offer_types: filterOfferTypes,
            skill: filterSkill,
            country: filterCountry,
            max_age: filterMaxAge,
            limit: 100,
          }}
        />
      </div>
    );
  }

  // ── Vue normale ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{t("app.my_goals")}</h1>
        <div className="flex items-center gap-2">
          {isError && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" className="gap-1.5" onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>{t("app.new_goal")}</span>
          </Button>
        </div>
      </div>

      {/* Chargement */}
      {isLoading && (
        <div className="space-y-3">
          <TopicSkeleton />
          <TopicSkeleton />
          <TopicSkeleton />
        </div>
      )}

      {/* Erreur */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
          <p className="text-sm font-medium text-destructive">
            {t("app.load_error")}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            {t("common.retry")}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && !hasObjectives && (
        <EmptyState onNew={() => setSheetOpen(true)} />
      )}

      {/* Groupes de topics */}
      {!isLoading && !isError && hasObjectives && (
        <div className="space-y-2">
          {visibleTopics.map((key, idx) => (
            <TopicCard
              key={key}
              topicKey={key}
              threads={grouped.get(key)!}
              navigate={navigate}
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      )}

      {/* ── Section recommandations ──────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.for_you")}
          </h2>
        </div>
        <RecommendationFeed />
      </div>

      {/* Sheet création */}
      <NewObjectiveSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreated={(thread) => navigate(`/app/chat/${thread.id}`)}
      />
    </div>
  );
}

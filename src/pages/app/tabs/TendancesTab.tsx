import { useState } from "react";
import { Loader2, RefreshCw, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useTrendsSummary } from "@/hooks/queries/use-trends";
import { SemaineAfriqueSection } from "./trends/SemaineAfriqueSection";
import { MonPaysSection } from "./trends/MonPaysSection";
import { CompetencesSection } from "./trends/CompetencesSection";
import { VueGlobaleSection } from "./trends/VueGlobaleSection";

type TabId = "semaine" | "mon_pays" | "competences" | "globale";

const TABS: { id: TabId; labelKey: string }[] = [
  { id: "semaine",     labelKey: "trends.tab_semaine" },
  { id: "mon_pays",   labelKey: "trends.tab_mon_pays" },
  { id: "competences", labelKey: "trends.tab_competences" },
  { id: "globale",    labelKey: "trends.tab_globale" },
];

function TrendsSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-4 py-3">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("trends.loading_hint")}</p>
      </div>
      <div className="space-y-3 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-12 rounded bg-muted" />
            </div>
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-4/5 rounded bg-muted" />
            <div className="h-8 w-full rounded-lg bg-muted/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TendancesTab() {
  const [activeTab, setActiveTab] = useState<TabId>("semaine");
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useTrendsSummary();

  return (
    <div className="flex flex-col px-4 py-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{t("trends.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("trends.subtitle")}</p>
        </div>
        {(isError || !isLoading) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => void refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Horizontal pill nav */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
          <p className="text-sm font-medium text-destructive">
            {t("trends.load_error")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("common.retry")}
          </Button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && <TrendsSkeleton />}

      {/* Section content */}
      {!isLoading && !isError && data && (
        <>
          {activeTab === "semaine"     && <SemaineAfriqueSection data={data.week_africa} />}
          {activeTab === "mon_pays"    && <MonPaysSection data={data.mon_pays} />}
          {activeTab === "competences" && <CompetencesSection data={data.competences} />}
          {activeTab === "globale"     && <VueGlobaleSection data={data.vue_globale} />}
        </>
      )}

      {/* No data (fetch succeeded but returned nothing) */}
      {!isLoading && !isError && !data && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted py-14 text-center">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-semibold">{t("trends.no_data")}</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              {t("trends.no_data_hint")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

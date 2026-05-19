import { TrendingUp, Clock, Bell, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function TendancesTab() {
  const { t } = useTranslation();

  const PREVIEW_ITEMS = [
    { emoji: "💼", catKey: "trends.cat_emploi",    titleKey: "trends.preview_1" },
    { emoji: "🎓", catKey: "trends.cat_bourses",   titleKey: "trends.preview_2" },
    { emoji: "📈", catKey: "trends.cat_salaires",  titleKey: "trends.preview_3" },
    { emoji: "🌍", catKey: "trends.cat_tendances", titleKey: "trends.preview_4" },
    { emoji: "🚀", catKey: "trends.cat_startups",  titleKey: "trends.preview_5" },
  ];

  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      <div>
        <h1 className="text-lg font-bold">{t("trends.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("trends.subtitle")}</p>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-6 text-center space-y-3">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <TrendingUp className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div>
          <p className="font-bold text-base">{t("trends.coming_title")}</p>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">
            {t("trends.coming_hint")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            if ("Notification" in window) {
              void Notification.requestPermission();
            }
          }}
        >
          <Bell className="h-3.5 w-3.5" />
          {t("trends.alert_btn")}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("trends.preview_title")}
          </p>
        </div>
        {PREVIEW_ITEMS.map((item) => (
          <div
            key={item.titleKey}
            className="flex items-start gap-3 rounded-xl border bg-card/50 p-3.5 opacity-50 select-none"
          >
            <span className="text-xl shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {t(item.catKey)}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-tight line-clamp-2">
                {t(item.titleKey)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>{t("trends.soon")}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-2">
        {t("trends.phase3")}
      </p>
    </div>
  );
}

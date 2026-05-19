import { TrendingUp, Clock, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PREVIEW_ITEMS = [
  { emoji: "💼", category: "Emploi",    title: "Marché Tech en Afrique de l'Ouest : +23% d'offres", time: "Bientôt" },
  { emoji: "🎓", category: "Bourses",   title: "Bourses d'études internationales Q3 2025", time: "Bientôt" },
  { emoji: "📈", category: "Salaires",  title: "Marketing Digital : salaires en hausse de +15%", time: "Bientôt" },
  { emoji: "🌍", category: "Tendances", title: "Top compétences recherchées au Sénégal 2025", time: "Bientôt" },
  { emoji: "🚀", category: "Startups",  title: "Écosystème startup ivoirien : 40 levées de fonds", time: "Bientôt" },
];

export default function TendancesTab() {
  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold">Tendances</h1>
        <p className="text-sm text-muted-foreground">
          Marchés & opportunités en temps réel
        </p>
      </div>

      {/* Bannière "Bientôt" */}
      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-6 text-center space-y-3">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <TrendingUp className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div>
          <p className="font-bold text-base">Analyses de marché en cours</p>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">
            Des analyses personnalisées selon ton profil et domaine arrivent très bientôt.
            Active les alertes pour être notifié en premier.
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
          M'alerter à l'ouverture
        </Button>
      </div>

      {/* Aperçu des analyses à venir */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Aperçu des analyses prévues
          </p>
        </div>
        {PREVIEW_ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 rounded-xl border bg-card/50 p-3.5 opacity-50 select-none"
          >
            <span className="text-xl shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.category}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-tight line-clamp-2">
                {item.title}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-2">
        Disponible dès la Phase 3+ du développement
      </p>
    </div>
  );
}

/**
 * MyCoursesAndExercisesPage — index élève de tout ce qui a été reçu (cours,
 * plans d'évolution, exercices, évaluations), tous confondus.
 *
 * Corrige un vrai cul-de-sac : jusqu'ici, MyCoursePage n'avait aucun retour
 * vers une liste — un élève ne pouvait retrouver un cours/exercice que via le
 * lien de la notification qui l'a annoncé la première fois.
 */

import { Link } from "react-router-dom";
import { BookOpen, ClipboardList, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreBadge } from "@/components/structures/ScoreBadge";
import { cn } from "@/shared/lib/utils";
import { useMyDeliveries } from "@/hooks/queries/use-structure";
import type { DeliveryItem } from "@/services/api/structure.api";

function deliveryHref(item: DeliveryItem): string {
  if (item.kind === "course" || item.kind === "evolution_plan") {
    return `/classrooms/courses/${item.id}`;
  }
  return `/classrooms/exercises/${item.id}`;
}

function DeliveryIcon({ kind }: { kind: DeliveryItem["kind"] }) {
  if (kind === "evolution_plan") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
        <Sparkles className="h-5 w-5" />
      </div>
    );
  }
  if (kind === "exercise" || kind === "evaluation") {
    return (
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        kind === "evaluation" ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600",
      )}>
        <ClipboardList className="h-5 w-5" />
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
      <BookOpen className="h-5 w-5" />
    </div>
  );
}

const KIND_LABELS: Record<DeliveryItem["kind"], string> = {
  course: "Cours",
  evolution_plan: "Plan personnalisé",
  exercise: "Exercice",
  evaluation: "Évaluation",
};

export default function MyCoursesAndExercisesPage() {
  const { data, isLoading } = useMyDeliveries();
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <Link to="/app" className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Retour à l'accueil
        </Link>
        <h1 className="text-xl font-bold">Mes cours & exercices</h1>
      </header>

      <main className="mx-auto max-w-2xl space-y-2 p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-lg bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
            Rien reçu pour l'instant. Ce qui t'est envoyé par un enseignant apparaîtra ici.
          </p>
        ) : (
          items.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              to={deliveryHref(item)}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <DeliveryIcon kind={item.kind} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{item.title}</p>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">{KIND_LABELS[item.kind]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.classroom_name}</p>
                {(item.kind === "exercise" || item.kind === "evaluation") ? (
                  <div className="mt-1.5">
                    <ScoreBadge pct={item.score_pct} size="sm" />
                  </div>
                ) : (
                  <div className="mt-1.5 flex max-w-[180px] items-center gap-2">
                    <Progress value={item.completion_pct} className="h-1.5 flex-1" />
                    <span className="shrink-0 text-xs font-semibold text-primary">{item.completion_pct}%</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  );
}

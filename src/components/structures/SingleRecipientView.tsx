import type { ReactNode } from "react";
import type { MatrixColumn } from "./RecipientMatrix";

/** Vue dédiée pour UN SEUL destinataire — corrige le cas des plans d'évolution
 * (toujours 1 étudiant) affichés jusqu'ici dans une matrice à une seule ligne,
 * un format pensé pour comparer plusieurs étudiants, pas pour lire le détail
 * d'un seul. Liste verticale label → contenu, plus lisible à cette échelle. */
export function SingleRecipientView({
  recipientName,
  columns,
  cells,
}: {
  recipientName: string;
  columns: MatrixColumn[];
  cells: Record<string, ReactNode>;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {recipientName}
      </p>
      <div className="space-y-3">
        {columns.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 border-b pb-2.5 last:border-0 last:pb-0">
            <span className="min-w-0 flex-1 text-sm">{c.label}</span>
            <span className="shrink-0">{cells[c.id] ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

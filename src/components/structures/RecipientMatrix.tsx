import type { ReactNode } from "react";

/** Généralisée depuis la table inline de CourseProgressPage — étudiant × colonnes
 * arbitraires (icônes d'étape pour un cours, badges de score pour un exercice).
 * Le contenu de chaque cellule est un ReactNode fourni par l'appelant. */
export interface MatrixColumn {
  id: string;
  label: string;
}

export interface MatrixRecipient {
  id: string;
  name: string;
  cells: Record<string, ReactNode>;
}

export function RecipientMatrix({
  columns,
  recipients,
  studentLabel = "Étudiant",
}: {
  columns: MatrixColumn[];
  recipients: MatrixRecipient[];
  studentLabel?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">
              {studentLabel}
            </th>
            {columns.map((c) => (
              <th key={c.id} className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recipients.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="px-4 py-2.5 text-xs font-medium">{r.name}</td>
              {columns.map((c) => (
                <td key={c.id} className="px-3 py-2.5 text-center">
                  {r.cells[c.id] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface Props { page: number; pages: number; total: number; size: number; onPage: (p: number) => void; }
export function AdminPagination({ page, pages, total, size, onPage }: Props) {
  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, total);
  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">{total === 0 ? "Aucun résultat" : `${from}–${to} sur ${total.toLocaleString()}`}</p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="px-2 text-xs text-muted-foreground">{page} / {pages}</span>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= pages} onClick={() => onPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

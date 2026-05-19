import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepProgressProps {
  current: number;
  total: number;
  onBack?: () => void;
  label?: string;
}

export function StepProgress({ current, total, onBack, label }: StepProgressProps) {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {onBack ? (
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      ) : (
        <div className="h-8 w-8 shrink-0" />
      )}
      <div className="flex-1">
        <Progress value={pct} className="h-1.5" />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
        {label ?? `${current + 1}/${total}`}
      </span>
    </div>
  );
}

import { cn } from "@/shared/lib/utils";

const PALETTE = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
];

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

interface Props {
  firstName?: string | null;
  lastName?: string | null;
  fallback?: string;
  className?: string;
}

export function InitialsAvatar({ firstName, lastName, fallback = "?", className }: Props) {
  const initials =
    [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() || fallback;
  const seed = `${firstName ?? ""}${lastName ?? ""}` || fallback;

  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        colorFor(seed),
        className
      )}
    >
      {initials}
    </div>
  );
}

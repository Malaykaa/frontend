import { cn } from "@/shared/lib/utils";

interface AiAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: { wrap: "h-6 w-6", img: "h-4 w-4" },
  md: { wrap: "h-8 w-8", img: "h-5 w-5" },
  lg: { wrap: "h-12 w-12", img: "h-8 w-8" },
};

export function AiAvatar({ size = "md", className }: AiAvatarProps) {
  const s = SIZE[size];
  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center rounded-full bg-black",
        s.wrap,
        className
      )}
    >
      <img src="/icon.png" alt="Malayka IA" className={cn(s.img, "object-contain")} />
    </div>
  );
}

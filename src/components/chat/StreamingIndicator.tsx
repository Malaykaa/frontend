import { AiAvatar } from "./AiAvatar";
import { AnimatedDots } from "./AnimatedDots";

export function StreamingIndicator() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <AiAvatar />
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border bg-card px-4 py-3 shadow-sm">
        <AnimatedDots />
      </div>
    </div>
  );
}

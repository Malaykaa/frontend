export function AnimatedDots({ size = "md" }: { size?: "sm" | "md" }) {
  const dot = size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5";
  return (
    <>
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${dot} rounded-full bg-primary/60`}
            style={{ animation: `mlk-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes mlk-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

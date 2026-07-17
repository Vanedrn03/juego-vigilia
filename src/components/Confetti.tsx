const COLORS = ["#f59e0b", "#fbbf24", "#f97316", "#ef4444", "#22c55e", "#3b82f6"];

export function Confetti({ count = 24 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((i) => {
        const left = (i * 137.5) % 100;
        const delay = (i % 8) * 0.09;
        const duration = 1.1 + (i % 5) * 0.15;
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={i}
            className="absolute top-0 block h-2.5 w-1.5 rounded-sm"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

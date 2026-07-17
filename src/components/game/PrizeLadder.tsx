import type { PrizeLevelView } from "@/lib/game/types";

export function PrizeLadder({
  levels,
  currentStep,
}: {
  levels: PrizeLevelView[];
  currentStep: number;
}) {
  const nextStep = currentStep + 1;
  const sorted = [...levels].sort((a, b) => b.step - a.step);

  return (
    <ol className="flex w-full flex-col-reverse gap-1 text-sm sm:w-64 sm:flex-col">
      {sorted.map((level) => {
          const isCurrent = level.step === nextStep;
          const isPast = level.step <= currentStep;
          return (
            <li
              key={level.step}
              className={[
                "flex items-center justify-between rounded px-3 py-1.5 transition",
                isCurrent
                  ? "scale-105 bg-amber-500 font-bold text-slate-950 shadow-[0_0_16px_-2px_rgba(245,158,11,0.7)]"
                  : isPast
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300",
                level.isCheckpoint && !isCurrent ? "ring-1 ring-amber-500/50" : "",
              ].join(" ")}
            >
              <span>{level.step}. {level.label}</span>
              <span className="font-mono">{level.points.toLocaleString("es")}</span>
            </li>
          );
        })}
    </ol>
  );
}

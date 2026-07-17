const LABELS = { A: "A", B: "B", C: "C", D: "D" } as const;

export function OptionButton({
  optionKey,
  text,
  disabled,
  hidden,
  selected,
  revealState,
  onClick,
}: {
  optionKey: "A" | "B" | "C" | "D";
  text: string;
  disabled: boolean;
  hidden: boolean;
  selected: boolean;
  revealState: "none" | "correct" | "incorrect" | "dimmed";
  onClick: () => void;
}) {
  if (hidden) {
    return <div className="h-16 rounded-lg opacity-0" aria-hidden />;
  }

  const stateClasses =
    revealState === "correct"
      ? "animate-[pop-in_0.35s_ease-out] bg-green-600 border-green-400 text-white"
      : revealState === "incorrect"
        ? "animate-[strike-shake_0.4s_ease-out] bg-red-700 border-red-400 text-white"
        : revealState === "dimmed"
          ? "opacity-40 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
          : selected
            ? "border-amber-400 bg-amber-500/20 text-amber-900 dark:text-amber-200"
            : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:border-amber-400";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-20 w-full items-center gap-3 rounded-lg border px-4 text-left text-2xl font-medium transition disabled:cursor-not-allowed ${stateClasses}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current font-bold">
        {LABELS[optionKey]}
      </span>
      <span>{text}</span>
    </button>
  );
}

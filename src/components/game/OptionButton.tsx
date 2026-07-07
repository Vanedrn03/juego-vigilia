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
    return <div className="h-14 rounded-lg opacity-0" aria-hidden />;
  }

  const stateClasses =
    revealState === "correct"
      ? "bg-green-600 border-green-400 text-white"
      : revealState === "incorrect"
        ? "bg-red-700 border-red-400 text-white"
        : revealState === "dimmed"
          ? "opacity-40 border-slate-700 bg-slate-900"
          : selected
            ? "border-amber-400 bg-amber-500/20 text-amber-200"
            : "border-slate-700 bg-slate-900 text-slate-100 hover:border-amber-400";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-16 w-full items-center gap-3 rounded-lg border px-4 text-left text-xl font-medium transition disabled:cursor-not-allowed ${stateClasses}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current font-bold">
        {LABELS[optionKey]}
      </span>
      <span>{text}</span>
    </button>
  );
}

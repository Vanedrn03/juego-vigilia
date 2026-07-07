import type { FeudAnswerSlotView } from "@/lib/feud/types";

export function Board({
  answers,
  disabled,
  onReveal,
}: {
  answers: FeudAnswerSlotView[];
  disabled: boolean;
  onReveal: (answerId: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {answers.map((a) => (
        <button
          key={a.id}
          type="button"
          disabled={disabled || a.revealed}
          onClick={() => onReveal(a.id)}
          className={`flex h-14 items-center justify-between rounded-lg border px-4 text-lg transition disabled:cursor-not-allowed ${
            a.revealed
              ? "border-amber-400 bg-amber-500/10 text-amber-200"
              : "border-slate-700 bg-slate-900 text-slate-500 hover:border-amber-400 hover:text-slate-200"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current text-sm font-bold">
              {a.rank}
            </span>
            <span>{a.revealed ? a.text : "?"}</span>
          </span>
          {a.revealed && <span className="font-mono">{a.points}</span>}
        </button>
      ))}
    </div>
  );
}

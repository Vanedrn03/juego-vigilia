export function LifelineBar({
  fiftyUsed,
  leaderUsed,
  teamUsed,
  disabled,
  onUseFifty,
  onUseLeader,
  onUseTeam,
}: {
  fiftyUsed: boolean;
  leaderUsed: boolean;
  teamUsed: boolean;
  disabled: boolean;
  onUseFifty: () => void;
  onUseLeader: () => void;
  onUseTeam: () => void;
}) {
  const btnClass = (used: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition ${
      used
        ? "cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 line-through"
        : "border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950"
    }`;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={fiftyUsed || disabled}
        onClick={onUseFifty}
        className={btnClass(fiftyUsed)}
      >
        50/50
      </button>
      <button
        type="button"
        disabled={leaderUsed || disabled}
        onClick={onUseLeader}
        className={btnClass(leaderUsed)}
      >
        Ayuda de un líder
      </button>
      <button
        type="button"
        disabled={teamUsed || disabled}
        onClick={onUseTeam}
        className={btnClass(teamUsed)}
      >
        Consultar con el equipo
      </button>
    </div>
  );
}

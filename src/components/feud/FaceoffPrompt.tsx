export function FaceoffPrompt({
  questionText,
  teamAName,
  teamBName,
  disabled,
  onAssign,
}: {
  questionText: string;
  teamAName: string;
  teamBName: string;
  disabled: boolean;
  onAssign: (team: "TEAM_A" | "TEAM_B") => void;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-amber-500/20 bg-white p-6 text-center shadow-xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Duelo</p>
      <h1 className="text-3xl font-bold lg:text-4xl">{questionText}</h1>
      <p className="text-sm text-slate-500">
        Un jugador de cada equipo responde en voz alta. ¿Quién ganó el control del tablero?
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAssign("TEAM_A")}
          className="rounded bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {teamAName} tomó el control
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAssign("TEAM_B")}
          className="rounded bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {teamBName} tomó el control
        </button>
      </div>
    </div>
  );
}

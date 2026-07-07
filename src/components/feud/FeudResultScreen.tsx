import Link from "next/link";

export function FeudResultScreen({
  teamAName,
  teamBName,
  teamAScore,
  teamBScore,
}: {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
}) {
  const winner =
    teamAScore === teamBScore ? null : teamAScore > teamBScore ? teamAName : teamBName;

  const teams = [
    { name: teamAName, score: teamAScore },
    { name: teamBName, score: teamBScore },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-16 text-center">
      <h1 className="text-3xl font-bold text-amber-400">Resultados finales</h1>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {teams.map((t) => (
          <div
            key={t.name}
            className={`rounded-lg border p-6 ${
              winner === t.name
                ? "border-amber-400 bg-amber-500/10"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            <p className="text-xl font-bold">{t.name}</p>
            <p className="text-3xl font-mono text-amber-300">{t.score.toLocaleString("es")}</p>
          </div>
        ))}
      </div>

      {winner ? (
        <p className="text-xl font-semibold text-amber-300">¡Felicidades {winner}! 🎉</p>
      ) : (
        <p className="text-xl font-semibold text-amber-300">¡Empate!</p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/admin/cristianos/sesiones/nueva"
          className="rounded bg-amber-500 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-400"
        >
          Iniciar otra partida
        </Link>
        <Link
          href="/admin/dashboard"
          className="rounded border border-slate-700 px-5 py-2 hover:border-amber-400"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}

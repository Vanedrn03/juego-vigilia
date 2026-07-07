import type { ParticipantView } from "@/lib/game/types";

const STATUS_LABEL: Record<ParticipantView["status"], string> = {
  ACTIVE: "En juego",
  WON: "¡Ganó la Corona de Vida!",
  WALKED_AWAY: "Se retiró con su puntaje",
  LOST: "Terminó su turno",
};

export function ResultScreen({ participants }: { participants: ParticipantView[] }) {
  const sorted = [...participants].sort((a, b) => b.score - a.score);
  const winner =
    sorted.length > 1 && sorted[0].score !== sorted[1].score ? sorted[0] : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-16 text-center">
      <h1 className="text-3xl font-bold text-amber-400">Resultados finales</h1>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {sorted.map((p) => (
          <div
            key={p.id}
            className={`rounded-lg border p-6 ${
              winner?.id === p.id
                ? "border-amber-400 bg-amber-500/10"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            <p className="text-xl font-bold">{p.name}</p>
            <p className="mb-2 text-sm text-slate-400">{STATUS_LABEL[p.status]}</p>
            <p className="text-3xl font-mono text-amber-300">
              {p.score.toLocaleString("es")}
            </p>
          </div>
        ))}
      </div>

      {winner && (
        <p className="text-xl font-semibold text-amber-300">
          ¡Felicidades {winner.name}! 🎉
        </p>
      )}
      {!winner && sorted.length > 1 && (
        <p className="text-xl font-semibold text-amber-300">¡Empate!</p>
      )}
    </div>
  );
}

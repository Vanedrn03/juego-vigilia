"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Confetti } from "@/components/Confetti";
import { playCelebration } from "@/lib/sound";

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

  useEffect(() => {
    if (winner) playCelebration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 overflow-hidden py-16 text-center">
      {winner && <Confetti />}
      <h1 className="text-4xl font-bold text-amber-600">Resultados finales</h1>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {teams.map((t) => (
          <div
            key={t.name}
            className={`rounded-lg border p-6 ${
              winner === t.name
                ? "border-amber-400 bg-amber-500/10"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <p className="text-2xl font-bold">{t.name}</p>
            <p className="text-4xl font-mono text-amber-700">{t.score.toLocaleString("es")}</p>
          </div>
        ))}
      </div>

      {winner ? (
        <p className="text-2xl font-semibold text-amber-700">¡Felicidades {winner}! 🎉</p>
      ) : (
        <p className="text-2xl font-semibold text-amber-700">¡Empate!</p>
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
          className="rounded border border-slate-300 px-5 py-2 hover:border-amber-400"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}

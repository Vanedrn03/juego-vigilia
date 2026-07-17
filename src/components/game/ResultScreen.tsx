"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { ParticipantView } from "@/lib/game/types";
import { Confetti } from "@/components/Confetti";
import { playCelebration } from "@/lib/sound";

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

  useEffect(() => {
    if (winner) playCelebration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 overflow-hidden py-16 text-center">
      {winner && <Confetti />}
      <h1 className="text-4xl font-bold text-amber-600">Resultados finales</h1>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {sorted.map((p) => (
          <div
            key={p.id}
            className={`rounded-lg border p-6 ${
              winner?.id === p.id
                ? "border-amber-400 bg-amber-500/10"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <p className="text-2xl font-bold">{p.name}</p>
            <p className="mb-2 text-sm text-slate-500">{STATUS_LABEL[p.status]}</p>
            <p className="text-4xl font-mono text-amber-700">
              {p.score.toLocaleString("es")}
            </p>
          </div>
        ))}
      </div>

      {winner && (
        <p className="text-2xl font-semibold text-amber-700">
          ¡Felicidades {winner.name}! 🎉
        </p>
      )}
      {!winner && sorted.length > 1 && (
        <p className="text-2xl font-semibold text-amber-700">¡Empate!</p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/admin/sesiones/nueva"
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

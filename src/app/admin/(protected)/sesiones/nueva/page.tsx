"use client";

import { useActionState, useState } from "react";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/validation/question";
import { BackLink } from "@/components/admin/BackLink";
import { createSessionAction } from "./actions";

export default function NuevaSesionPage() {
  const [state, formAction, pending] = useActionState(createSessionAction, undefined);
  const [mode, setMode] = useState<"TEAMS" | "INDIVIDUAL">("TEAMS");

  const nameLabels =
    mode === "TEAMS" ? ["Nombre del equipo 1", "Nombre del equipo 2"] : ["Jugador 1", "Jugador 2"];

  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/dashboard" label="Volver al panel" />
      <h1 className="mb-6 text-2xl font-bold text-amber-600">Nueva partida</h1>

      <form action={formAction} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-slate-700">Modo de juego</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="TEAMS"
                checked={mode === "TEAMS"}
                onChange={() => setMode("TEAMS")}
              />
              2 equipos
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="INDIVIDUAL"
                checked={mode === "INDIVIDUAL"}
                onChange={() => setMode("INDIVIDUAL")}
              />
              1 vs 1
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-slate-700">{nameLabels[0]}</label>
            <input
              name="participantAName"
              required
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">{nameLabels[1]}</label>
            <input
              name="participantBName"
              required
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-700">
            Categorías a incluir (recomendado: todas)
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="categories" value={c} defaultChecked />
                {CATEGORY_LABELS[c]}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-64">
          <div>
            <label className="mb-1 block text-sm text-slate-700">Dificultad mín.</label>
            <input
              name="minDifficulty"
              type="number"
              min={1}
              max={15}
              defaultValue={1}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">Dificultad máx.</label>
            <input
              name="maxDifficulty"
              type="number"
              min={1}
              max={15}
              defaultValue={15}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {state?.error && (
          <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {pending ? "Armando partida..." : "Barajar preguntas e iniciar"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { createFeudSessionAction } from "./actions";

export function NuevaFeudSesionForm({ maxRounds }: { maxRounds: number }) {
  const [state, formAction, pending] = useActionState(createFeudSessionAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300">Nombre del equipo 1</label>
          <input
            name="teamAName"
            required
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300">Nombre del equipo 2</label>
          <input
            name="teamBName"
            required
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div className="sm:w-48">
        <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300">Número de rondas</label>
        <input
          name="roundCount"
          type="number"
          min={1}
          max={Math.max(maxRounds, 1)}
          defaultValue={Math.min(5, Math.max(maxRounds, 1))}
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {state?.error && (
        <p className="rounded border border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">
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
  );
}

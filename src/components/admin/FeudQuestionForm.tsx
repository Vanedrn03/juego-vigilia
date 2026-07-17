"use client";

import { useActionState, useState } from "react";

export interface FeudQuestionFormDefaults {
  text: string;
  active: boolean;
  answers: { text: string; points: number }[];
}

type FormState = { error?: string };
type AnswerRow = { text: string; points: number };

const BLANK_ROWS: AnswerRow[] = Array.from({ length: 4 }, () => ({ text: "", points: 0 }));

export function FeudQuestionForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prevState: FormState | undefined, formData: FormData) => Promise<FormState>;
  defaults?: FeudQuestionFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [rows, setRows] = useState<AnswerRow[]>(defaults?.answers ?? BLANK_ROWS);

  function updateRow(index: number, field: keyof AnswerRow, value: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: field === "points" ? Number(value) || 0 : value }
          : row
      )
    );
  }

  function addRow() {
    if (rows.length >= 8) return;
    setRows((prev) => [...prev, { text: "", points: 0 }]);
  }

  function removeRow(index: number) {
    if (rows.length <= 3) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <input type="hidden" name="answerCount" value={rows.length} />

      <div>
        <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300">Pregunta de encuesta</label>
        <textarea
          name="text"
          required
          defaultValue={defaults?.text}
          rows={2}
          placeholder="Ej. Nombra algo que la gente hace en la iglesia"
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm text-slate-700 dark:text-slate-300">
            Respuestas ranqueadas (de la más popular a la menos popular)
          </label>
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= 8}
            className="rounded border border-amber-400 px-2 py-1 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-40"
          >
            + Agregar respuesta
          </button>
        </div>

        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-center text-sm text-slate-500 dark:text-slate-400">{i + 1}.</span>
              <input
                name={`answerText-${i}`}
                value={row.text}
                onChange={(e) => updateRow(i, "text", e.target.value)}
                required
                placeholder="Respuesta"
                className="flex-1 rounded border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400 dark:bg-slate-800 dark:text-white"
              />
              <input
                name={`answerPoints-${i}`}
                type="number"
                min={1}
                value={row.points}
                onChange={(e) => updateRow(i, "points", e.target.value)}
                required
                placeholder="Pts"
                className="w-20 rounded border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                disabled={rows.length <= 3}
                className="shrink-0 text-red-600 dark:text-red-400 hover:underline disabled:opacity-30"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaults?.active ?? true}
          className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
        />
        Pregunta activa (disponible para partidas)
      </label>

      {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

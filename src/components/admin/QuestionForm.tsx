"use client";

import { useActionState } from "react";
import { CATEGORIES, CATEGORY_LABELS, OPTION_KEYS } from "@/lib/validation/question";

export interface QuestionFormDefaults {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  difficulty: number;
  category: string;
  bibleVersion: string;
  verseRef: string | null;
  verseText: string | null;
  active: boolean;
}

type FormState = { error?: string };

export function QuestionForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prevState: FormState | undefined, formData: FormData) => Promise<FormState>;
  defaults?: QuestionFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm text-slate-700">Pregunta</label>
        <textarea
          name="text"
          required
          defaultValue={defaults?.text}
          rows={2}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["A", "B", "C", "D"] as const).map((key) => (
          <div key={key}>
            <label className="mb-1 block text-sm text-slate-700">Opción {key}</label>
            <input
              name={`option${key}`}
              required
              defaultValue={defaults?.[`option${key}` as "optionA"]}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm text-slate-700">Opción correcta</label>
          <select
            name="correctOption"
            defaultValue={defaults?.correctOption ?? "A"}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
          >
            {OPTION_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700">Dificultad (1-15)</label>
          <input
            name="difficulty"
            type="number"
            min={1}
            max={15}
            required
            defaultValue={defaults?.difficulty ?? 1}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700">Categoría</label>
          <select
            name="category"
            defaultValue={defaults?.category ?? "GENERAL"}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-700">Versión bíblica</label>
          <input
            name="bibleVersion"
            defaultValue={defaults?.bibleVersion ?? "RV60"}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-700">
            Referencia (opcional, ej. Juan 3:16)
          </label>
          <input
            name="verseRef"
            defaultValue={defaults?.verseRef ?? ""}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-700">
          Nota/paráfrasis de apoyo (opcional, no cites el versículo completo)
        </label>
        <textarea
          name="verseText"
          rows={2}
          defaultValue={defaults?.verseText ?? ""}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaults?.active ?? true}
          className="h-4 w-4 rounded border-slate-300 bg-white"
        />
        Pregunta activa (disponible para partidas)
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

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

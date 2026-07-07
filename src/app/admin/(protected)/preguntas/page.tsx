import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/validation/question";
import { deleteQuestionAction, toggleQuestionActiveAction } from "./actions";
import type { Prisma } from "@/generated/prisma/client";

export default async function PreguntasPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    active?: string;
    q?: string;
    minDifficulty?: string;
    maxDifficulty?: string;
  }>;
}) {
  const sp = await searchParams;

  const where: Prisma.QuestionWhereInput = {};
  if (sp.category) where.category = sp.category as Prisma.QuestionWhereInput["category"];
  if (sp.active === "true") where.active = true;
  if (sp.active === "false") where.active = false;
  if (sp.q) where.text = { contains: sp.q, mode: "insensitive" };
  if (sp.minDifficulty || sp.maxDifficulty) {
    where.difficulty = {
      gte: sp.minDifficulty ? Number(sp.minDifficulty) : 1,
      lte: sp.maxDifficulty ? Number(sp.maxDifficulty) : 15,
    };
  }

  const questions = await prisma.question.findMany({
    where,
    orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-400">Banco de preguntas</h1>
        <Link
          href="/admin/preguntas/nueva"
          className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400"
        >
          + Nueva pregunta
        </Link>
      </div>

      <form className="mb-6 flex flex-wrap items-end gap-3 text-sm" method="get">
        <div>
          <label className="mb-1 block text-slate-400">Buscar</label>
          <input
            name="q"
            defaultValue={sp.q}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-400">Categoría</label>
          <select
            name="category"
            defaultValue={sp.category ?? ""}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white"
          >
            <option value="">Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-slate-400">Dif. mín.</label>
          <input
            name="minDifficulty"
            type="number"
            min={1}
            max={15}
            defaultValue={sp.minDifficulty}
            className="w-16 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-400">Dif. máx.</label>
          <input
            name="maxDifficulty"
            type="number"
            min={1}
            max={15}
            defaultValue={sp.maxDifficulty}
            className="w-16 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-400">Estado</label>
          <select
            name="active"
            defaultValue={sp.active ?? ""}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white"
          >
            <option value="">Todas</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded border border-slate-700 px-3 py-1 hover:border-amber-400"
        >
          Filtrar
        </button>
      </form>

      <p className="mb-3 text-sm text-slate-400">{questions.length} pregunta(s)</p>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-400">
            <tr>
              <th className="px-3 py-2">Dif.</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Pregunta</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {questions.map((q) => (
              <tr key={q.id} className={q.active ? "" : "opacity-50"}>
                <td className="px-3 py-2 font-mono">{q.difficulty}</td>
                <td className="px-3 py-2">{CATEGORY_LABELS[q.category as keyof typeof CATEGORY_LABELS]}</td>
                <td className="max-w-md px-3 py-2">{q.text}</td>
                <td className="px-3 py-2">{q.active ? "Activa" : "Inactiva"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/preguntas/${q.id}/editar`}
                      className="text-amber-400 hover:underline"
                    >
                      Editar
                    </Link>
                    <form
                      action={toggleQuestionActiveAction.bind(null, q.id, !q.active)}
                    >
                      <button type="submit" className="text-slate-300 hover:underline">
                        {q.active ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                    <form action={deleteQuestionAction.bind(null, q.id)}>
                      <button type="submit" className="text-red-400 hover:underline">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/db";
import { BackLink } from "@/components/admin/BackLink";
import { deleteFeudQuestionAction, toggleFeudQuestionActiveAction } from "./actions";

export default async function CristianosPreguntasPage() {
  const questions = await prisma.feudQuestion.findMany({
    orderBy: { createdAt: "desc" },
    include: { answers: { orderBy: { rank: "asc" } } },
  });

  return (
    <div>
      <BackLink href="/admin/dashboard" label="Volver al panel" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-400">
          Preguntas — 100 Cristianos Dijeron
        </h1>
        <Link
          href="/admin/cristianos/preguntas/nueva"
          className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400"
        >
          + Nueva pregunta
        </Link>
      </div>

      <p className="mb-4 text-sm text-slate-400">{questions.length} pregunta(s)</p>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className={`rounded-lg border border-slate-800 bg-slate-900 p-4 ${
              q.active ? "" : "opacity-50"
            }`}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{q.text}</p>
                <p className="text-xs text-slate-500">{q.active ? "Activa" : "Inactiva"}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/admin/cristianos/preguntas/${q.id}/editar`}
                  className="text-amber-400 hover:underline"
                >
                  Editar
                </Link>
                <form action={toggleFeudQuestionActiveAction.bind(null, q.id, !q.active)}>
                  <button type="submit" className="text-slate-300 hover:underline">
                    {q.active ? "Desactivar" : "Activar"}
                  </button>
                </form>
                <form action={deleteFeudQuestionAction.bind(null, q.id)}>
                  <button type="submit" className="text-red-400 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>

            <ol className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              {q.answers.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded bg-slate-800 px-3 py-1.5"
                >
                  <span>
                    <span className="mr-2 font-mono text-amber-400">{a.rank}.</span>
                    {a.text}
                  </span>
                  <span className="font-mono text-slate-400">{a.points}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const [questionCount, activeSessions, recentSessions] = await Promise.all([
    prisma.question.count({ where: { active: true } }),
    prisma.gameSession.count({ where: { status: "IN_PROGRESS" } }),
    prisma.gameSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { participants: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-400">Panel de administración</h1>
        <p className="text-slate-400">
          Misión Cristiana Elim · ¿Quién Quiere Ser Millonario? Bíblico
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Preguntas activas</p>
          <p className="text-3xl font-bold">{questionCount}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Partidas en curso</p>
          <p className="text-3xl font-bold">{activeSessions}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/sesiones/nueva"
          className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400"
        >
          Iniciar nueva partida
        </Link>
        <Link
          href="/admin/preguntas"
          className="rounded border border-slate-700 px-4 py-2 hover:border-amber-400"
        >
          Administrar preguntas
        </Link>
        <Link
          href="/admin/escalera"
          className="rounded border border-slate-700 px-4 py-2 hover:border-amber-400"
        >
          Editar escalera de premios
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Partidas recientes</h2>
        {recentSessions.length === 0 ? (
          <p className="text-slate-400">Todavía no se ha jugado ninguna partida.</p>
        ) : (
          <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800">
            {recentSessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">
                    {s.participants.map((p) => p.name).join(" vs ")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {s.mode === "TEAMS" ? "2 equipos" : "1 vs 1"} · {s.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/sesiones/${s.id}`}
                    className="text-sm text-amber-400 hover:underline"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/juego/${s.id}`}
                    className="text-sm text-amber-400 hover:underline"
                  >
                    Abrir juego
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const [
    questionCount,
    activeSessions,
    recentSessions,
    feudQuestionCount,
    activeFeudSessions,
    recentFeudSessions,
  ] = await Promise.all([
    prisma.question.count({ where: { active: true } }),
    prisma.gameSession.count({ where: { status: "IN_PROGRESS" } }),
    prisma.gameSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { participants: true },
    }),
    prisma.feudQuestion.count({ where: { active: true } }),
    prisma.feudSession.count({ where: { status: "IN_PROGRESS" } }),
    prisma.feudSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-600">Panel de administración</h1>
        <p className="text-slate-500">Misión Cristiana Elim · Elige un juego</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ¿Quién Quiere Ser Bendecido? */}
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-amber-700">¿Quién Quiere Ser Bendecido?</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-100 p-4">
              <p className="text-xs text-slate-500">Preguntas activas</p>
              <p className="text-2xl font-bold">{questionCount}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-100 p-4">
              <p className="text-xs text-slate-500">Partidas en curso</p>
              <p className="text-2xl font-bold">{activeSessions}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/sesiones/nueva"
              className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
            >
              Nueva partida
            </Link>
            <Link
              href="/admin/preguntas"
              className="rounded border border-slate-300 px-3 py-2 text-sm hover:border-amber-400"
            >
              Preguntas
            </Link>
            <Link
              href="/admin/escalera"
              className="rounded border border-slate-300 px-3 py-2 text-sm hover:border-amber-400"
            >
              Escalera de premios
            </Link>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Partidas recientes</h3>
            {recentSessions.length === 0 ? (
              <p className="text-sm text-slate-500">Todavía no se ha jugado ninguna partida.</p>
            ) : (
              <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                {recentSessions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">
                        {s.participants.map((p) => p.name).join(" vs ")}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.mode === "TEAMS" ? "2 equipos" : "1 vs 1"} · {s.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/sesiones/${s.id}`} className="text-amber-600 hover:underline">
                        Ver
                      </Link>
                      <Link href={`/juego/${s.id}`} className="text-amber-600 hover:underline">
                        Abrir
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 100 Cristianos Dijeron */}
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-amber-700">100 Cristianos Dijeron</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-100 p-4">
              <p className="text-xs text-slate-500">Preguntas activas</p>
              <p className="text-2xl font-bold">{feudQuestionCount}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-100 p-4">
              <p className="text-xs text-slate-500">Partidas en curso</p>
              <p className="text-2xl font-bold">{activeFeudSessions}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/cristianos/sesiones/nueva"
              className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
            >
              Nueva partida
            </Link>
            <Link
              href="/admin/cristianos/preguntas"
              className="rounded border border-slate-300 px-3 py-2 text-sm hover:border-amber-400"
            >
              Preguntas
            </Link>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Partidas recientes</h3>
            {recentFeudSessions.length === 0 ? (
              <p className="text-sm text-slate-500">Todavía no se ha jugado ninguna partida.</p>
            ) : (
              <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                {recentFeudSessions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">
                        {s.teamAName} vs {s.teamBName}
                      </p>
                      <p className="text-xs text-slate-500">{s.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/cristianos/sesiones/${s.id}`}
                        className="text-amber-600 hover:underline"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/juego/cristianos/${s.id}`}
                        className="text-amber-600 hover:underline"
                      >
                        Abrir
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

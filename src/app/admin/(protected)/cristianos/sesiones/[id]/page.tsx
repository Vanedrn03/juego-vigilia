import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BackLink } from "@/components/admin/BackLink";

export default async function SesionCristianosAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await prisma.feudSession.findUnique({
    where: { id },
    include: { rounds: { orderBy: { roundNumber: "asc" } } },
  });

  if (!session) notFound();

  return (
    <div>
      <BackLink href="/admin/dashboard" label="Volver al panel" />
      <h1 className="mb-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
        {session.teamAName} vs {session.teamBName}
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Estado: {session.status}</p>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:w-96">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{session.teamAName}</p>
          <p className="text-2xl font-bold">{session.teamAScore.toLocaleString("es")}</p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{session.teamBName}</p>
          <p className="text-2xl font-bold">{session.teamBScore.toLocaleString("es")}</p>
        </div>
      </div>

      <ul className="mb-6 divide-y divide-slate-200 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
        {session.rounds.map((r) => (
          <li key={r.id} className="flex items-center justify-between px-4 py-3">
            <span>Ronda {r.roundNumber}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{r.phase}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/juego/cristianos/${session.id}`}
        className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400"
      >
        Abrir pantalla de juego
      </Link>
    </div>
  );
}

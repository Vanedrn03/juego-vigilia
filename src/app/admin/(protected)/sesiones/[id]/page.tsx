import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BackLink } from "@/components/admin/BackLink";

export default async function SesionAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await prisma.gameSession.findUnique({
    where: { id },
    include: { participants: { orderBy: { order: "asc" } } },
  });

  if (!session) notFound();

  return (
    <div>
      <BackLink href="/admin/dashboard" label="Volver al panel" />
      <h1 className="mb-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
        Partida {session.mode === "TEAMS" ? "2 equipos" : "1 vs 1"}
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Estado: {session.status}</p>

      <ul className="mb-6 divide-y divide-slate-200 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
        {session.participants.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paso {p.currentStep}/15 · {p.status} · {p.score} pts
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        href={`/juego/${session.id}`}
        className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400"
      >
        Abrir pantalla de juego
      </Link>
    </div>
  );
}

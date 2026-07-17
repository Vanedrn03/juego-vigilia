import { prisma } from "@/lib/db";
import { BackLink } from "@/components/admin/BackLink";
import { NuevaFeudSesionForm } from "./NuevaFeudSesionForm";

export default async function NuevaSesionCristianosPage() {
  const activeCount = await prisma.feudQuestion.count({ where: { active: true } });

  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/dashboard" label="Volver al panel" />
      <h1 className="mb-6 text-2xl font-bold text-amber-600 dark:text-amber-400">
        Nueva partida — 100 Cristianos Dijeron
      </h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        {activeCount} pregunta(s) activas disponibles en el banco.
      </p>
      <NuevaFeudSesionForm maxRounds={Math.min(activeCount, 15)} />
    </div>
  );
}

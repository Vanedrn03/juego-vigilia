import { prisma } from "@/lib/db";
import { BackLink } from "@/components/admin/BackLink";
import { updateLadderAction } from "./actions";

export default async function EscaleraPage() {
  const levels = await prisma.prizeLevel.findMany({ orderBy: { step: "desc" } });
  const byStep = new Map(levels.map((l) => [l.step, l]));

  return (
    <div>
      <BackLink href="/admin/dashboard" label="Volver al panel" />
      <h1 className="mb-2 text-2xl font-bold text-amber-400">Escalera de premios</h1>
      <p className="mb-6 text-sm text-slate-400">
        Marca los niveles &quot;checkpoint&quot; (casillas de seguridad): si un participante
        falla después de pasarlos, se queda con esos puntos garantizados.
      </p>

      <form action={updateLadderAction} className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-400">
            <tr>
              <th className="px-3 py-2">Nivel</th>
              <th className="px-3 py-2">Etiqueta</th>
              <th className="px-3 py-2">Puntos</th>
              <th className="px-3 py-2">Checkpoint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {Array.from({ length: 15 }, (_, i) => 15 - i).map((step) => {
              const level = byStep.get(step);
              return (
                <tr key={step}>
                  <td className="px-3 py-2 font-mono">{step}</td>
                  <td className="px-3 py-2">
                    <input
                      name={`label-${step}`}
                      defaultValue={level?.label ?? ""}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      name={`points-${step}`}
                      type="number"
                      min={0}
                      defaultValue={level?.points ?? 0}
                      className="w-32 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      name={`checkpoint-${step}`}
                      defaultChecked={level?.isCheckpoint ?? false}
                      className="h-4 w-4"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-3">
          <button
            type="submit"
            className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400"
          >
            Guardar escalera
          </button>
        </div>
      </form>
    </div>
  );
}

import { prisma } from "@/lib/db";

/** Marca la sesión de Feud como FINISHED cuando ninguna ronda sigue abierta. */
export async function finalizeFeudSessionIfDone(sessionId: string) {
  const openCount = await prisma.feudSessionRound.count({
    where: { sessionId, phase: { not: "DONE" } },
  });

  if (openCount === 0) {
    await prisma.feudSession.update({
      where: { id: sessionId },
      data: { status: "FINISHED" },
    });
  }
}

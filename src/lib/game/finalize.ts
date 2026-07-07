import { prisma } from "@/lib/db";

/** Marca la sesión como FINISHED cuando ningún participante sigue ACTIVE. */
export async function finalizeSessionIfDone(sessionId: string) {
  const activeCount = await prisma.participant.count({
    where: { sessionId, status: "ACTIVE" },
  });

  if (activeCount === 0) {
    await prisma.gameSession.update({
      where: { id: sessionId },
      data: { status: "FINISHED" },
    });
  }
}

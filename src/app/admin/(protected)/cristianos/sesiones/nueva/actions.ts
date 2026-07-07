"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { newFeudSessionSchema } from "@/lib/validation/feudSession";
import { pickFeudRounds } from "@/lib/feud/shuffle";

export async function createFeudSessionAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = newFeudSessionSchema.safeParse({
    teamAName: formData.get("teamAName"),
    teamBName: formData.get("teamBName"),
    roundCount: formData.get("roundCount"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { teamAName, teamBName, roundCount } = parsed.data;

  const pool = await prisma.feudQuestion.findMany({
    where: { active: true },
    select: { id: true },
  });

  let sessionId: string;
  try {
    const roundQuestionIds = pickFeudRounds(pool, roundCount);

    sessionId = await prisma.$transaction(async (tx) => {
      const session = await tx.feudSession.create({
        data: { teamAName, teamBName, status: "IN_PROGRESS" },
      });

      await tx.feudSessionRound.createMany({
        data: roundQuestionIds.map((questionId, index) => ({
          sessionId: session.id,
          questionId,
          roundNumber: index + 1,
        })),
      });

      return session.id;
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "No se pudo armar la partida.",
    };
  }

  redirect(`/juego/cristianos/${sessionId}`);
}

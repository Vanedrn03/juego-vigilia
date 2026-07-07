"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { newSessionSchema } from "@/lib/validation/session";
import { pickLadderForParticipant } from "@/lib/game/shuffle";

export async function createSessionAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const categories = formData.getAll("categories");

  const parsed = newSessionSchema.safeParse({
    mode: formData.get("mode"),
    participantAName: formData.get("participantAName"),
    participantBName: formData.get("participantBName"),
    categories,
    minDifficulty: formData.get("minDifficulty") || 1,
    maxDifficulty: formData.get("maxDifficulty") || 15,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { mode, participantAName, participantBName, categories: cats, minDifficulty, maxDifficulty } =
    parsed.data;

  const pool = await prisma.question.findMany({
    where: {
      active: true,
      category: { in: cats },
      difficulty: { gte: minDifficulty, lte: maxDifficulty },
    },
    select: { id: true, difficulty: true },
  });

  let sessionId: string;
  try {
    sessionId = await prisma.$transaction(async (tx) => {
      const session = await tx.gameSession.create({
        data: { mode, status: "IN_PROGRESS" },
      });

      const usedQuestionIds = new Set<string>();
      const participantNames = [participantAName, participantBName];

      for (let i = 0; i < participantNames.length; i++) {
        const participant = await tx.participant.create({
          data: {
            sessionId: session.id,
            name: participantNames[i],
            order: i,
          },
        });

        const ladder = pickLadderForParticipant(pool, usedQuestionIds);

        await tx.sessionQuestion.createMany({
          data: ladder.map((questionId, index) => ({
            sessionId: session.id,
            participantId: participant.id,
            questionId,
            step: index + 1,
          })),
        });
      }

      return session.id;
    });
  } catch (e) {
    return {
      error:
        e instanceof Error
          ? e.message
          : "No se pudo armar la partida con los filtros elegidos.",
    };
  }

  redirect(`/juego/${sessionId}`);
}

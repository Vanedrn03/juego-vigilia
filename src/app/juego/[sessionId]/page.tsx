import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toPublicSession } from "@/lib/game/serialize";
import { GameScreen } from "./GameScreen";

export default async function JuegoPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const [session, prizeLevels] = await Promise.all([
    prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          orderBy: { order: "asc" },
          include: {
            sessionQuestions: {
              orderBy: { step: "asc" },
              include: { question: true },
            },
          },
        },
      },
    }),
    prisma.prizeLevel.findMany({ orderBy: { step: "asc" } }),
  ]);

  if (!session) notFound();

  return <GameScreen session={toPublicSession(session)} prizeLevels={prizeLevels} />;
}

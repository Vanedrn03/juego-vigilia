import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toPublicFeudSession } from "@/lib/feud/serialize";
import { FeudGameScreen } from "./FeudGameScreen";

export default async function JuegoCristianosPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const session = await prisma.feudSession.findUnique({
    where: { id: sessionId },
    include: {
      rounds: {
        orderBy: { roundNumber: "asc" },
        include: { question: { include: { answers: true } } },
      },
    },
  });

  if (!session) notFound();

  return <FeudGameScreen session={toPublicFeudSession(session)} />;
}
